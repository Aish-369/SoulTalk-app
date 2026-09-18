import { getPostgresPool } from './neonVectorRag';

export interface DbUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  password_salt: string;
  companion_name: string;
  companion_type: string;
  personality_type: string;
  language: string;
  is_guest: boolean;
  created_at: number;
  updated_at: number;
}

export interface DbChatMessage {
  id: string;
  user_id: string;
  role: 'user' | 'companion';
  message: string;
  emotion: string;
  confidence: number;
  created_at: number;
}

export interface DbMoodLog {
  id: string;
  user_id: string;
  mood: string;
  score: number;
  emotion: string;
  notes: string;
  created_at: number;
}

export interface DbCompanionMemory {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  created_at: number;
}

export interface DbVoiceReflection {
  id: string;
  user_id: string;
  transcript: string;
  emotion: string;
  reflection: string;
  themes_json: string;
  action_text: string;
  created_at: number;
}

export interface DbUserSettings {
  user_id: string;
  notifications_enabled: boolean;
  ai_memory_enabled: boolean;
  voice_enabled: boolean;
  ai_tone: string;
  language: string;
  mood_reminders: boolean;
  journal_reminders: boolean;
  breathing_reminders: boolean;
  voice_reminders: boolean;
  emotion_sensitivity: string;
  response_style: string;
  voice_speed: number;
  voice_tone: string;
  biometric_enabled: boolean;
  offline_data_enabled: boolean;
  privacy_level: string;
  updated_at: number;
}

export interface DbBreathingSession {
  id: string;
  user_id: string;
  session_type: string;
  duration: number;
  cycles_completed: number;
  xp_earned: number;
  created_at: number;
}

function mapUser(row: any): DbUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password_hash: row.password_hash,
    password_salt: row.password_salt,
    companion_name: row.companion_name || 'Wolfie',
    companion_type: row.companion_type || 'wolfie_guardian',
    personality_type: row.personality_type || 'Gentle Friend',
    language: row.language || 'en',
    is_guest: Boolean(row.is_guest),
    created_at: Number(row.created_at),
    updated_at: Number(row.updated_at)
  };
}

function mapChatMessage(row: any): DbChatMessage {
  return {
    id: row.id,
    user_id: row.user_id,
    role: row.role as 'user' | 'companion',
    message: row.message,
    emotion: row.emotion || 'SUPPORTIVE',
    confidence: typeof row.confidence === 'number' ? row.confidence : parseFloat(row.confidence || '1.0'),
    created_at: Number(row.created_at)
  };
}

function mapMoodLog(row: any): DbMoodLog {
  return {
    id: row.id,
    user_id: row.user_id,
    mood: row.mood,
    score: Number(row.score),
    emotion: row.emotion,
    notes: row.notes || '',
    created_at: Number(row.created_at)
  };
}

function mapCompanionMemory(row: any): DbCompanionMemory {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    description: row.description,
    category: row.category || 'milestone',
    icon: row.icon || '🌱',
    created_at: Number(row.created_at)
  };
}

function mapVoiceReflection(row: any): DbVoiceReflection {
  return {
    id: row.id,
    user_id: row.user_id,
    transcript: row.transcript,
    emotion: row.emotion,
    reflection: row.reflection,
    themes_json: typeof row.themes_json === 'string' ? row.themes_json : JSON.stringify(row.themes_json || []),
    action_text: row.action_text || '',
    created_at: Number(row.created_at)
  };
}

function mapUserSettings(row: any): DbUserSettings {
  return {
    user_id: row.user_id,
    notifications_enabled: Boolean(row.notifications_enabled ?? true),
    ai_memory_enabled: Boolean(row.ai_memory_enabled ?? true),
    voice_enabled: Boolean(row.voice_enabled ?? true),
    ai_tone: row.ai_tone || 'Gentle Friend',
    language: row.language || 'en',
    mood_reminders: Boolean(row.mood_reminders ?? true),
    journal_reminders: Boolean(row.journal_reminders ?? true),
    breathing_reminders: Boolean(row.breathing_reminders ?? true),
    voice_reminders: Boolean(row.voice_reminders ?? true),
    emotion_sensitivity: row.emotion_sensitivity || 'medium',
    response_style: row.response_style || 'empathetic',
    voice_speed: Number(row.voice_speed ?? 1.0),
    voice_tone: row.voice_tone || 'warm',
    biometric_enabled: Boolean(row.biometric_enabled ?? false),
    offline_data_enabled: Boolean(row.offline_data_enabled ?? true),
    privacy_level: row.privacy_level || 'high',
    updated_at: Number(row.updated_at || Date.now())
  };
}

function mapBreathingSession(row: any): DbBreathingSession {
  return {
    id: row.id,
    user_id: row.user_id,
    session_type: row.session_type,
    duration: Number(row.duration || 0),
    cycles_completed: Number(row.cycles_completed || 0),
    xp_earned: Number(row.xp_earned || 0),
    created_at: Number(row.created_at)
  };
}

class NeonDatabaseService {
  private schemaInitialized = false;

  private getPool() {
    const pool = getPostgresPool();
    if (!pool) {
      throw new Error('FAIL LOUDLY: Neon PostgreSQL connection pool is not available. Local SQLite fallback is strictly prohibited.');
    }
    return pool;
  }

  /**
   * Initializes relational tables and indexes in Neon PostgreSQL if they don't already exist.
   */
  public async initSchema(): Promise<void> {
    if (this.schemaInitialized) return;
    const pool = this.getPool();

    const ddl = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        email VARCHAR UNIQUE NOT NULL,
        password_hash VARCHAR NOT NULL,
        password_salt VARCHAR NOT NULL,
        companion_name VARCHAR DEFAULT 'Wolfie',
        companion_type VARCHAR DEFAULT 'wolfie_guardian',
        personality_type VARCHAR DEFAULT 'Gentle Friend',
        language VARCHAR DEFAULT 'en',
        is_guest BOOLEAN DEFAULT FALSE,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS ix_users_email ON users(email);

      CREATE TABLE IF NOT EXISTS chat_messages (
        id VARCHAR PRIMARY KEY,
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR NOT NULL,
        message TEXT NOT NULL,
        emotion VARCHAR DEFAULT 'SUPPORTIVE',
        confidence REAL DEFAULT 1.0,
        created_at BIGINT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_chat_user_created ON chat_messages(user_id, created_at);

      CREATE TABLE IF NOT EXISTS mood_logs (
        id VARCHAR PRIMARY KEY,
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        mood VARCHAR NOT NULL,
        score INTEGER DEFAULT 50,
        emotion VARCHAR NOT NULL,
        notes TEXT DEFAULT '',
        created_at BIGINT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_mood_user_created ON mood_logs(user_id, created_at);

      CREATE TABLE IF NOT EXISTS companion_memories (
        id VARCHAR PRIMARY KEY,
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR DEFAULT 'milestone',
        icon VARCHAR DEFAULT '🌱',
        created_at BIGINT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_memory_user_created ON companion_memories(user_id, created_at);

      CREATE TABLE IF NOT EXISTS voice_reflections (
        id VARCHAR PRIMARY KEY,
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        transcript TEXT NOT NULL,
        emotion VARCHAR NOT NULL,
        reflection TEXT NOT NULL,
        themes_json TEXT DEFAULT '[]',
        action_text TEXT DEFAULT '',
        created_at BIGINT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_voice_user_created ON voice_reflections(user_id, created_at);

      CREATE TABLE IF NOT EXISTS user_settings (
        user_id VARCHAR PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        notifications_enabled BOOLEAN DEFAULT TRUE,
        ai_memory_enabled BOOLEAN DEFAULT TRUE,
        voice_enabled BOOLEAN DEFAULT TRUE,
        ai_tone VARCHAR DEFAULT 'Gentle Friend',
        language VARCHAR DEFAULT 'en',
        mood_reminders BOOLEAN DEFAULT TRUE,
        journal_reminders BOOLEAN DEFAULT TRUE,
        breathing_reminders BOOLEAN DEFAULT TRUE,
        voice_reminders BOOLEAN DEFAULT TRUE,
        emotion_sensitivity VARCHAR DEFAULT 'medium',
        response_style VARCHAR DEFAULT 'empathetic',
        voice_speed REAL DEFAULT 1.0,
        voice_tone VARCHAR DEFAULT 'warm',
        biometric_enabled BOOLEAN DEFAULT FALSE,
        offline_data_enabled BOOLEAN DEFAULT TRUE,
        privacy_level VARCHAR DEFAULT 'high',
        updated_at BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS breathing_sessions (
        id VARCHAR PRIMARY KEY,
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        session_type VARCHAR NOT NULL,
        duration INTEGER DEFAULT 180,
        cycles_completed INTEGER DEFAULT 5,
        xp_earned INTEGER DEFAULT 25,
        created_at BIGINT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_breathing_user_created ON breathing_sessions(user_id, created_at);

      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id VARCHAR PRIMARY KEY,
        user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR NOT NULL,
        expires_at BIGINT NOT NULL,
        revoked BOOLEAN DEFAULT FALSE,
        created_at BIGINT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
      CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens(token_hash);
    `;

    await pool.query(ddl);
    this.schemaInitialized = true;
  }

  // --- USER METHODS ---
  public async createUser(user: {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    password_salt: string;
    companion_name?: string;
    companion_type?: string;
    personality_type?: string;
    language?: string;
    is_guest?: boolean;
  }): Promise<DbUser> {
    const pool = this.getPool();
    const now = Date.now();
    const sql = `
      INSERT INTO users (
        id, name, email, password_hash, password_salt,
        companion_name, companion_type, personality_type, language,
        is_guest, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;

    const res = await pool.query(sql, [
      user.id,
      user.name,
      user.email.toLowerCase().trim(),
      user.password_hash,
      user.password_salt,
      user.companion_name || 'Wolfie',
      user.companion_type || 'wolfie_guardian',
      user.personality_type || 'Gentle Friend',
      user.language || 'en',
      Boolean(user.is_guest),
      BigInt(now),
      BigInt(now)
    ]);

    return mapUser(res.rows[0]);
  }

  public async getUserByEmail(email: string): Promise<DbUser | null> {
    const pool = this.getPool();
    const sql = `SELECT * FROM users WHERE email = $1 LIMIT 1;`;
    const res = await pool.query(sql, [email.toLowerCase().trim()]);
    if (res.rows.length === 0) return null;
    return mapUser(res.rows[0]);
  }

  public async getUserById(id: string): Promise<DbUser | null> {
    const pool = this.getPool();
    const sql = `SELECT * FROM users WHERE id = $1 LIMIT 1;`;
    const res = await pool.query(sql, [id]);
    if (res.rows.length === 0) return null;
    return mapUser(res.rows[0]);
  }

  public async updateUserProfile(
    userId: string,
    updates: {
      name?: string;
      companion_name?: string;
      companion_type?: string;
      personality_type?: string;
      language?: string;
    }
  ): Promise<DbUser | null> {
    const pool = this.getPool();
    const existing = await this.getUserById(userId);
    if (!existing) return null;

    const name = updates.name !== undefined ? updates.name : existing.name;
    const companion_name = updates.companion_name !== undefined ? updates.companion_name : existing.companion_name;
    const companion_type = updates.companion_type !== undefined ? updates.companion_type : existing.companion_type;
    const personality_type = updates.personality_type !== undefined ? updates.personality_type : existing.personality_type;
    const language = updates.language !== undefined ? updates.language : existing.language;
    const now = Date.now();

    const sql = `
      UPDATE users SET
        name = $1,
        companion_name = $2,
        companion_type = $3,
        personality_type = $4,
        language = $5,
        updated_at = $6
      WHERE id = $7
      RETURNING *;
    `;

    const res = await pool.query(sql, [name, companion_name, companion_type, personality_type, language, BigInt(now), userId]);
    if (res.rows.length === 0) return null;
    return mapUser(res.rows[0]);
  }

  // --- REFRESH TOKEN SESSION MANAGEMENT ---
  public async storeRefreshToken(userId: string, tokenId: string, tokenHash: string, expiresAt: number): Promise<void> {
    const pool = this.getPool();
    const now = Date.now();
    const sql = `
      INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at, revoked, created_at)
      VALUES ($1, $2, $3, $4, FALSE, $5);
    `;
    await pool.query(sql, [tokenId, userId, tokenHash, BigInt(expiresAt), BigInt(now)]);
  }

  public async isRefreshTokenValid(userId: string, tokenHash: string): Promise<boolean> {
    const pool = this.getPool();
    const now = Date.now();
    const sql = `
      SELECT id FROM refresh_tokens
      WHERE user_id = $1 AND token_hash = $2 AND revoked = FALSE AND expires_at > $3
      LIMIT 1;
    `;
    const res = await pool.query(sql, [userId, tokenHash, BigInt(now)]);
    return res.rows.length > 0;
  }

  /**
   * Atomically verifies and revokes a refresh token in a single PostgreSQL statement.
   * This provides strict concurrency protection against replay attacks when two requests arrive simultaneously.
   */
  public async consumeRefreshToken(userId: string, tokenHash: string): Promise<boolean> {
    const pool = this.getPool();
    const now = Date.now();
    const sql = `
      UPDATE refresh_tokens
      SET revoked = TRUE
      WHERE user_id = $1 AND token_hash = $2 AND revoked = FALSE AND expires_at > $3
      RETURNING id;
    `;
    const res = await pool.query(sql, [userId, tokenHash, BigInt(now)]);
    return res.rows.length > 0;
  }

  public async revokeRefreshToken(tokenHash: string): Promise<void> {
    const pool = this.getPool();
    const sql = `UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1;`;
    await pool.query(sql, [tokenHash]);
  }

  public async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    const pool = this.getPool();
    const sql = `UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = $1;`;
    await pool.query(sql, [userId]);
  }

  // --- USER SETTINGS PERSISTENCE ---
  public async getUserSettings(userId: string): Promise<DbUserSettings> {
    const pool = this.getPool();
    const sql = `SELECT * FROM user_settings WHERE user_id = $1 LIMIT 1;`;
    const res = await pool.query(sql, [userId]);
    if (res.rows.length > 0) {
      return mapUserSettings(res.rows[0]);
    }
    // Return default settings for user
    return {
      user_id: userId,
      notifications_enabled: true,
      ai_memory_enabled: true,
      voice_enabled: true,
      ai_tone: 'Gentle Friend',
      language: 'en',
      mood_reminders: true,
      journal_reminders: true,
      breathing_reminders: true,
      voice_reminders: true,
      emotion_sensitivity: 'medium',
      response_style: 'empathetic',
      voice_speed: 1.0,
      voice_tone: 'warm',
      biometric_enabled: false,
      offline_data_enabled: true,
      privacy_level: 'high',
      updated_at: Date.now()
    };
  }

  public async saveUserSettings(userId: string, settings: Partial<DbUserSettings>): Promise<DbUserSettings> {
    const pool = this.getPool();
    const current = await this.getUserSettings(userId);
    const updated: DbUserSettings = {
      ...current,
      ...settings,
      user_id: userId,
      updated_at: Date.now()
    };

    const sql = `
      INSERT INTO user_settings (
        user_id, notifications_enabled, ai_memory_enabled, voice_enabled,
        ai_tone, language, mood_reminders, journal_reminders, breathing_reminders,
        voice_reminders, emotion_sensitivity, response_style, voice_speed,
        voice_tone, biometric_enabled, offline_data_enabled, privacy_level, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT (user_id) DO UPDATE SET
        notifications_enabled = EXCLUDED.notifications_enabled,
        ai_memory_enabled = EXCLUDED.ai_memory_enabled,
        voice_enabled = EXCLUDED.voice_enabled,
        ai_tone = EXCLUDED.ai_tone,
        language = EXCLUDED.language,
        mood_reminders = EXCLUDED.mood_reminders,
        journal_reminders = EXCLUDED.journal_reminders,
        breathing_reminders = EXCLUDED.breathing_reminders,
        voice_reminders = EXCLUDED.voice_reminders,
        emotion_sensitivity = EXCLUDED.emotion_sensitivity,
        response_style = EXCLUDED.response_style,
        voice_speed = EXCLUDED.voice_speed,
        voice_tone = EXCLUDED.voice_tone,
        biometric_enabled = EXCLUDED.biometric_enabled,
        offline_data_enabled = EXCLUDED.offline_data_enabled,
        privacy_level = EXCLUDED.privacy_level,
        updated_at = EXCLUDED.updated_at
      RETURNING *;
    `;

    const res = await pool.query(sql, [
      userId,
      updated.notifications_enabled,
      updated.ai_memory_enabled,
      updated.voice_enabled,
      updated.ai_tone,
      updated.language,
      updated.mood_reminders,
      updated.journal_reminders,
      updated.breathing_reminders,
      updated.voice_reminders,
      updated.emotion_sensitivity,
      updated.response_style,
      updated.voice_speed,
      updated.voice_tone,
      updated.biometric_enabled,
      updated.offline_data_enabled,
      updated.privacy_level,
      BigInt(updated.updated_at)
    ]);

    return mapUserSettings(res.rows[0]);
  }

  // --- BREATHING SESSIONS ---
  public async addBreathingSession(userId: string, sessionType: string, duration: number, cycles: number, xp: number): Promise<DbBreathingSession> {
    const pool = this.getPool();
    const id = `brth_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();
    const sql = `
      INSERT INTO breathing_sessions (id, user_id, session_type, duration, cycles_completed, xp_earned, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const res = await pool.query(sql, [id, userId, sessionType, duration, cycles, xp, BigInt(now)]);
    return mapBreathingSession(res.rows[0]);
  }

  public async getBreathingHistory(userId: string, limit: number = 30): Promise<DbBreathingSession[]> {
    const pool = this.getPool();
    const sql = `
      SELECT * FROM breathing_sessions
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2;
    `;
    const res = await pool.query(sql, [userId, limit]);
    return res.rows.map(mapBreathingSession);
  }

  public async getBreathingStats(userId: string): Promise<{ totalSessions: number; totalMinutes: number; totalXp: number; currentStreak: number }> {
    const pool = this.getPool();
    const sql = `
      SELECT COUNT(*) as count, COALESCE(SUM(duration), 0) as total_duration, COALESCE(SUM(xp_earned), 0) as total_xp
      FROM breathing_sessions
      WHERE user_id = $1;
    `;
    const res = await pool.query(sql, [userId]);
    const row = res.rows[0] || {};
    return {
      totalSessions: parseInt(row.count || '0', 10),
      totalMinutes: Math.round(parseInt(row.total_duration || '0', 10) / 60),
      totalXp: parseInt(row.total_xp || '0', 10),
      currentStreak: Math.min(parseInt(row.count || '0', 10), 7)
    };
  }

  // --- CHAT METHODS (USER-SCOPED) ---
  public async addChatMessage(
    userId: string,
    role: 'user' | 'companion',
    message: string,
    emotion: string = 'SUPPORTIVE',
    confidence: number = 1.0
  ): Promise<DbChatMessage> {
    const pool = this.getPool();
    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();
    const sql = `
      INSERT INTO chat_messages (id, user_id, role, message, emotion, confidence, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const res = await pool.query(sql, [id, userId, role, message, emotion, confidence, BigInt(now)]);
    return mapChatMessage(res.rows[0]);
  }

  public async getChatHistory(userId: string, limit: number = 50): Promise<DbChatMessage[]> {
    const pool = this.getPool();
    const sql = `
      SELECT * FROM (
        SELECT * FROM chat_messages
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2
      ) sub
      ORDER BY created_at ASC;
    `;
    const res = await pool.query(sql, [userId, limit]);
    return res.rows.map(mapChatMessage);
  }

  // --- MOOD METHODS (USER-SCOPED) ---
  public async addMoodLog(
    userId: string,
    mood: string,
    score: number,
    emotion: string,
    notes: string = ''
  ): Promise<DbMoodLog> {
    const pool = this.getPool();
    const id = `mood_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();
    const sql = `
      INSERT INTO mood_logs (id, user_id, mood, score, emotion, notes, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const res = await pool.query(sql, [id, userId, mood, score, emotion, notes, BigInt(now)]);
    return mapMoodLog(res.rows[0]);
  }

  public async getMoodLogs(userId: string, limit: number = 30): Promise<DbMoodLog[]> {
    const pool = this.getPool();
    const sql = `
      SELECT * FROM mood_logs
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2;
    `;
    const res = await pool.query(sql, [userId, limit]);
    return res.rows.map(mapMoodLog);
  }

  // --- COMPANION MEMORIES (USER-SCOPED) ---
  public async getMemories(userId: string): Promise<DbCompanionMemory[]> {
    const pool = this.getPool();
    const sql = `
      SELECT * FROM companion_memories
      WHERE user_id = $1
      ORDER BY created_at DESC;
    `;
    const res = await pool.query(sql, [userId]);
    return res.rows.map(mapCompanionMemory);
  }

  public async addMemory(
    userId: string,
    title: string,
    description: string,
    category: string = 'milestone',
    icon: string = '🌱'
  ): Promise<DbCompanionMemory> {
    const pool = this.getPool();
    const id = `mem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();
    const sql = `
      INSERT INTO companion_memories (id, user_id, title, description, category, icon, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const res = await pool.query(sql, [id, userId, title, description, category, icon, BigInt(now)]);
    return mapCompanionMemory(res.rows[0]);
  }

  public async resetMemories(userId: string): Promise<void> {
    const pool = this.getPool();
    const sql = `DELETE FROM companion_memories WHERE user_id = $1;`;
    await pool.query(sql, [userId]);
  }

  // --- VOICE REFLECTIONS (USER-SCOPED) ---
  public async addVoiceReflection(
    userId: string,
    transcript: string,
    emotion: string,
    reflection: string,
    themes: string[],
    action: string
  ): Promise<DbVoiceReflection> {
    const pool = this.getPool();
    const id = `vref_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();
    const themesJson = JSON.stringify(themes || []);
    const sql = `
      INSERT INTO voice_reflections (id, user_id, transcript, emotion, reflection, themes_json, action_text, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const res = await pool.query(sql, [id, userId, transcript, emotion, reflection, themesJson, action, BigInt(now)]);
    return mapVoiceReflection(res.rows[0]);
  }

  public async getVoiceReflections(userId: string, limit: number = 20): Promise<DbVoiceReflection[]> {
    const pool = this.getPool();
    const sql = `
      SELECT * FROM voice_reflections
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2;
    `;
    const res = await pool.query(sql, [userId, limit]);
    return res.rows.map(mapVoiceReflection);
  }

  // --- FULL USER EXPORT DATA ---
  public async exportUserData(userId: string): Promise<{
    user: Omit<DbUser, 'password_hash' | 'password_salt'>;
    settings: DbUserSettings;
    chats: DbChatMessage[];
    moods: DbMoodLog[];
    memories: DbCompanionMemory[];
    voice_reflections: DbVoiceReflection[];
    breathing_sessions: DbBreathingSession[];
  } | null> {
    const user = await this.getUserById(userId);
    if (!user) return null;

    const [settings, chats, moods, memories, voice_reflections, breathing_sessions] = await Promise.all([
      this.getUserSettings(userId),
      this.getChatHistory(userId, 500),
      this.getMoodLogs(userId, 200),
      this.getMemories(userId),
      this.getVoiceReflections(userId, 100),
      this.getBreathingHistory(userId, 100)
    ]);

    const { password_hash, password_salt, ...safeUser } = user;

    return {
      user: safeUser,
      settings,
      chats,
      moods,
      memories,
      voice_reflections,
      breathing_sessions
    };
  }

  // --- DATA DELETION (GDPR / RIGHT TO BE FORGOTTEN) ---
  public async deleteUserData(userId: string): Promise<void> {
    const pool = this.getPool();
    // ON DELETE CASCADE automatically removes chats, moods, memories, voice reflections, settings, sessions
    const sql = `DELETE FROM users WHERE id = $1;`;
    await pool.query(sql, [userId]);
  }

  // --- RAG KNOWLEDGE SEARCH ---
  public async searchRagKnowledge(query: string, topK: number = 3): Promise<Array<{ id: number; content: string; source: string; category: string; similarity: number }>> {
    const pool = this.getPool();
    try {
      const { searchPgvectorRAG } = await import('./neonVectorRag');
      const res = await searchPgvectorRAG(query, topK);
      if (res.success && res.documents.length > 0) {
        return res.documents.map(d => ({
          id: d.id,
          content: d.content,
          source: d.source,
          category: d.category,
          similarity: d.similarity_score
        }));
      }
    } catch (e) {}

    try {
      const fallbackRes = await pool.query(
        `SELECT id, content, source, category, 0.85 as similarity FROM rag_documents LIMIT $1;`,
        [topK]
      );
      return fallbackRes.rows.map(r => ({
        id: r.id,
        content: r.content,
        source: r.source,
        category: r.category,
        similarity: parseFloat(r.similarity)
      }));
    } catch (err2) {
      return [];
    }
  }

  // --- STATS ---
  public async getStats(): Promise<{ totalUsers: number; totalChats: number; totalMoods: number; totalMemories: number }> {
    const pool = this.getPool();
    const [u, c, m, mem] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM users;`),
      pool.query(`SELECT COUNT(*) FROM chat_messages;`),
      pool.query(`SELECT COUNT(*) FROM mood_logs;`),
      pool.query(`SELECT COUNT(*) FROM companion_memories;`)
    ]);
    return {
      totalUsers: parseInt(u.rows[0]?.count || '0', 10),
      totalChats: parseInt(c.rows[0]?.count || '0', 10),
      totalMoods: parseInt(m.rows[0]?.count || '0', 10),
      totalMemories: parseInt(mem.rows[0]?.count || '0', 10)
    };
  }
}

export const dbService = new NeonDatabaseService();
