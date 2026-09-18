import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { dbService, DbUser } from './db';

// Retrieve or generate JWT secret with inter-process container consistency
let cachedSecret: string | null = null;
export function getJwtSecret(): string {
  if (cachedSecret) return cachedSecret;

  const envSecret = process.env.JWT_SECRET || process.env.SECRET_KEY;
  if (envSecret && envSecret.trim().length >= 16) {
    cachedSecret = envSecret.trim();
    return cachedSecret;
  }

  // Check shared file in container tmp directory for multi-process consistency
  const tmpSecretFile = path.join(os.tmpdir(), '.soultalk_jwt_secret');
  try {
    if (fs.existsSync(tmpSecretFile)) {
      const existing = fs.readFileSync(tmpSecretFile, 'utf8').trim();
      if (existing.length >= 32) {
        cachedSecret = existing;
        return cachedSecret;
      }
    }
    const generated = crypto.randomBytes(32).toString('hex');
    fs.writeFileSync(tmpSecretFile, generated, { mode: 0o600 });
    cachedSecret = generated;
    return cachedSecret;
  } catch (err) {
    cachedSecret = crypto.randomBytes(32).toString('hex');
    return cachedSecret;
  }
}

export interface TokenPayload {
  userId: string;
  email: string;
  isGuest: boolean;
  tokenType: 'access' | 'refresh';
  tokenId?: string;
  iat: number;
  exp: number;
}

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(checkHash, 'hex'));
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Generates a short-lived access token (1 hour) for API authentication.
 */
export function generateAccessToken(user: { id: string; email: string; is_guest?: number | boolean }): string {
  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
  const now = Math.floor(Date.now() / 1000);
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    isGuest: Boolean(user.is_guest),
    tokenType: 'access',
    iat: now,
    exp: now + 60 * 60 // 1 hour lifetime
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(signatureInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Generates a long-lived refresh token (30 days) with unique tokenId for session management.
 */
export function generateRefreshToken(user: { id: string; email: string; is_guest?: number | boolean }): { token: string; tokenId: string; expiresAt: number } {
  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
  const now = Math.floor(Date.now() / 1000);
  const tokenId = crypto.randomBytes(16).toString('hex');
  const expiresAt = now + 60 * 60 * 24 * 30; // 30 days

  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    isGuest: Boolean(user.is_guest),
    tokenType: 'refresh',
    tokenId,
    iat: now,
    exp: expiresAt
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', getJwtSecret())
    .update(signatureInput)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const token = `${encodedHeader}.${encodedPayload}.${signature}`;
  return { token, tokenId, expiresAt: expiresAt * 1000 };
}

// Backward compatibility alias: generates access token
export function generateJwtToken(user: { id: string; email: string; is_guest?: number | boolean }): string {
  return generateAccessToken(user);
}

export function verifyJwtToken(token: string): TokenPayload | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const expectedSignature = crypto
      .createHmac('sha256', getJwtSecret())
      .update(signatureInput)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload: TokenPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired token
    }

    return payload;
  } catch (err) {
    return null;
  }
}

export interface AuthenticatedRequest extends express.Request {
  user?: DbUser;
  tokenPayload?: TokenPayload;
}

export async function requireAuth(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authentication required. Please provide a valid Bearer token.',
      code: 'UNAUTHORIZED'
    });
  }

  const token = authHeader.substring(7).trim();
  const payload = verifyJwtToken(token);
  if (!payload || !payload.userId) {
    return res.status(401).json({
      error: 'Invalid or expired session. Please log in again.',
      code: 'TOKEN_INVALID'
    });
  }

  // Enforce access token usage: refresh tokens cannot be used to query API endpoints directly
  if (payload.tokenType === 'refresh') {
    return res.status(401).json({
      error: 'Refresh tokens cannot be used as access tokens. Please use your access token.',
      code: 'INVALID_TOKEN_TYPE'
    });
  }

  try {
    const user = await dbService.getUserById(payload.userId);
    if (!user) {
      return res.status(401).json({
        error: 'User account not found. Please re-authenticate.',
        code: 'USER_NOT_FOUND'
      });
    }

    req.user = user;
    req.tokenPayload = payload;
    next();
  } catch (err: any) {
    return res.status(500).json({
      error: `Database authentication error: ${err.message}`,
      code: 'DB_ERROR'
    });
  }
}

export async function optionalAuth(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const payload = verifyJwtToken(token);
    if (payload && payload.userId && payload.tokenType !== 'refresh') {
      try {
        const user = await dbService.getUserById(payload.userId);
        if (user) {
          req.user = user;
          req.tokenPayload = payload;
          return next();
        }
      } catch (err) {
        // Fall through to guest
      }
    }
  }

  // If no auth token or invalid, proceed as guest
  next();
}
