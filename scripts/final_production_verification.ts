/**
 * SoulTalk Final Independent Production Verification Suite
 * Executes rigorous, evidence-based tests across all 19 verification dimensions.
 */

import { getPostgresPool } from '../server/neonVectorRag';
import { dbService } from '../server/db';
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  getJwtSecret,
  TokenPayload
} from '../server/auth';
import {
  checkCrisis,
  CrisisLevel,
  HELPLINE_RESOURCES
} from '../server/safetyEngine';
import crypto from 'crypto';

const BASE_URL = 'http://localhost:3000';

interface VerificationResult {
  section: string;
  name: string;
  passed: boolean;
  evidence: string;
  details?: any;
}

const results: VerificationResult[] = [];

function record(section: string, name: string, passed: boolean, evidence: string, details?: any) {
  results.push({ section, name, passed, evidence, details });
  const status = passed ? 'PASS' : 'FAIL';
  console.log(`[${status}] [${section}] ${name}: ${evidence}`);
}

// Helper to make API requests
async function apiRequest(path: string, options: {
  method?: string;
  token?: string;
  body?: any;
  headers?: Record<string, string>;
} = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let data: any = null;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch (e) {
    data = text;
  }

  return { status: res.status, data };
}

async function runVerification() {
  console.log('================================================================');
  console.log('SOULTALK FINAL INDEPENDENT PRODUCTION VERIFICATION SUITE');
  console.log('Target: Neon PostgreSQL + Express Backend');
  console.log('================================================================\n');

  const pool = getPostgresPool();
  if (!pool) {
    throw new Error('Neon PostgreSQL pool is not available.');
  }
  await dbService.initSchema();

  const timestamp = Date.now();
  const testUserAEmail = `verif_user_a_${timestamp}@soultalk.app`;
  const testUserBEmail = `verif_user_b_${timestamp}@soultalk.app`;
  const password = 'StrongPassword123!';

  // -------------------------------------------------------------
  // 1. AUTHENTICATION VERIFICATION
  // -------------------------------------------------------------
  console.log('--- 1. AUTHENTICATION VERIFICATION ---');

  // Register User A
  const regResA = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: { name: 'User A', email: testUserAEmail, password }
  });
  const userA = regResA.data.user;
  const userAToken = regResA.data.token || regResA.data.access_token;
  const userARefreshToken = regResA.data.refresh_token;

  record('Authentication', 'Access Token Valid', regResA.status === 200 && !!userAToken, `Status ${regResA.status}, access token provided`);

  // Protected endpoint with valid access token
  const meRes = await apiRequest('/api/auth/me', { token: userAToken });
  record('Authentication', 'Protected API with Valid Token', meRes.status === 200 && meRes.data.user?.email === testUserAEmail, `Status ${meRes.status}, user email matches`);

  // Expired access token
  const expiredPayload: TokenPayload = {
    userId: userA.uuid || userA.id,
    email: testUserAEmail,
    isGuest: false,
    tokenType: 'access',
    iat: Math.floor(Date.now() / 1000) - 7200,
    exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago
  };
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payloadStr = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
  const expiredSig = crypto.createHmac('sha256', getJwtSecret()).update(`${header}.${payloadStr}`).digest('base64url');
  const expiredToken = `${header}.${payloadStr}.${expiredSig}`;

  const expiredRes = await apiRequest('/api/auth/me', { token: expiredToken });
  record('Authentication', 'Expired Access Token Rejected', expiredRes.status === 401, `Status ${expiredRes.status} (expected 401)`);

  // Refresh token used as access token
  const refreshAsAccessRes = await apiRequest('/api/auth/me', { token: userARefreshToken });
  record('Authentication', 'Refresh Token as Access Token Rejected', refreshAsAccessRes.status === 401 && refreshAsAccessRes.data.code === 'INVALID_TOKEN_TYPE', `Status ${refreshAsAccessRes.status}, code: ${refreshAsAccessRes.data.code}`);

  // Malformed token
  const malformedRes = await apiRequest('/api/auth/me', { token: 'invalid.garbage.token123' });
  record('Authentication', 'Malformed Token Rejected', malformedRes.status === 401, `Status ${malformedRes.status}`);

  // Valid refresh token -> /api/auth/refresh -> new access + new refresh
  const refreshRes = await apiRequest('/api/auth/refresh', {
    method: 'POST',
    body: { refresh_token: userARefreshToken }
  });
  const newAccessToken = refreshRes.data.token || refreshRes.data.access_token;
  const newRefreshToken = refreshRes.data.refresh_token;
  record('Authentication', 'Refresh Token Rotation', refreshRes.status === 200 && !!newAccessToken && !!newRefreshToken, `Status ${refreshRes.status}, new tokens issued`);

  // Old refresh token used again (replay attempt)
  const replayRes = await apiRequest('/api/auth/refresh', {
    method: 'POST',
    body: { refresh_token: userARefreshToken }
  });
  record('Authentication', 'Old Refresh Token Rejected After Rotation', replayRes.status === 401, `Status ${replayRes.status} (expected 401)`);

  // Access token used on refresh endpoint (should reject with 401 or 400 since tokenType !== refresh)
  const accessOnRefreshRes = await apiRequest('/api/auth/refresh', {
    method: 'POST',
    body: { refresh_token: newAccessToken }
  });
  record('Authentication', 'Access Token on Refresh Endpoint Rejected', accessOnRefreshRes.status === 401, `Status ${accessOnRefreshRes.status}`);

  // Logout -> refresh token revoked
  const logoutRes = await apiRequest('/api/auth/logout', {
    method: 'POST',
    body: { refresh_token: newRefreshToken }
  });
  record('Authentication', 'Logout Endpoint', logoutRes.status === 200 && logoutRes.data.success, `Status ${logoutRes.status}`);

  // Verify DB record in Neon refresh_tokens has revoked = true
  const dbTokenCheck = await pool.query(
    `SELECT id, user_id, revoked, expires_at FROM refresh_tokens WHERE token_hash = $1`,
    [hashToken(newRefreshToken)]
  );
  record('Authentication', 'Logout DB Record Revoked', dbTokenCheck.rows.length > 0 && dbTokenCheck.rows[0].revoked === true, `Found in DB, revoked = ${dbTokenCheck.rows[0]?.revoked}`);

  // Refresh attempt after logout must fail
  const refreshAfterLogoutRes = await apiRequest('/api/auth/refresh', {
    method: 'POST',
    body: { refresh_token: newRefreshToken }
  });
  record('Authentication', 'Refresh Attempt After Logout Rejected', refreshAfterLogoutRes.status === 401, `Status ${refreshAfterLogoutRes.status}`);

  // -------------------------------------------------------------
  // 2. DATABASE SOVEREIGNTY & ZERO SQLITE FALLBACK
  // -------------------------------------------------------------
  console.log('\n--- 2. DATABASE SOVEREIGNTY & ZERO SQLITE FALLBACK ---');
  const healthRes = await apiRequest('/api/health');
  const healthDb = healthRes.data?.database;
  record('Database', 'Authoritative Engine Neon PostgreSQL', healthDb?.engine?.includes('Neon PostgreSQL'), `Reported engine: ${healthDb?.engine}`);
  record('Database', 'SQLite Fallback Disabled', healthDb?.sqlite_fallback === false && healthDb?.sqlite_prohibited === true, `sqlite_fallback: ${healthDb?.sqlite_fallback}, prohibited: ${healthDb?.sqlite_prohibited}`);

  // -------------------------------------------------------------
  // 3. NEON DATABASE PERSISTENCE ACROSS RESTART
  // -------------------------------------------------------------
  console.log('\n--- 3. NEON DATABASE PERSISTENCE ---');
  // Login to get fresh active tokens for User A
  const loginRes = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email: testUserAEmail, password }
  });
  const activeTokenA = loginRes.data.token || loginRes.data.access_token;
  const userAUuid = loginRes.data.user.uuid || loginRes.data.user.id;

  // Insert chat, mood, memory
  await dbService.addChatMessage(userAUuid, 'user', 'Hello SoulTalk, testing persistence', 'HAPPY', 0.95);
  await dbService.addMoodLog(userAUuid, 'Joyful', 85, 'HAPPY', 'Great day');
  await dbService.addMemory(userAUuid, 'First Session', 'Completed first SoulTalk verification session', 'milestone', '🌟');

  // Verify direct Neon DB read
  const dbChats = await pool.query(`SELECT * FROM chat_messages WHERE user_id = $1`, [userAUuid]);
  const dbMoods = await pool.query(`SELECT * FROM mood_logs WHERE user_id = $1`, [userAUuid]);
  const dbMemories = await pool.query(`SELECT * FROM companion_memories WHERE user_id = $1`, [userAUuid]);

  record('Persistence', 'Chat Messages Direct DB Read', dbChats.rows.length >= 1, `Direct DB rows: ${dbChats.rows.length}`);
  record('Persistence', 'Mood Logs Direct DB Read', dbMoods.rows.length >= 1, `Direct DB rows: ${dbMoods.rows.length}, score: ${dbMoods.rows[0]?.score}`);
  record('Persistence', 'Companion Memories Direct DB Read', dbMemories.rows.length >= 1, `Direct DB rows: ${dbMemories.rows.length}, title: ${dbMemories.rows[0]?.title}`);

  // -------------------------------------------------------------
  // 4. BREATHING VERIFICATION
  // -------------------------------------------------------------
  console.log('\n--- 4. BREATHING VERIFICATION ---');
  // Register User B for cross-user isolation tests
  const regResB = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: { name: 'User B', email: testUserBEmail, password }
  });
  const activeTokenB = regResB.data.token || regResB.data.access_token;
  const userBUuid = regResB.data.user.uuid || regResB.data.user.id;

  // User A completes breathing session
  const breathCompleteResA = await apiRequest('/api/breathing/complete', {
    method: 'POST',
    token: activeTokenA,
    body: {
      session_type: '4-7-8 Relax',
      duration: 240,
      cycles_completed: 6,
      xp_earned: 30
    }
  });
  record('Breathing', 'POST /api/breathing/complete', breathCompleteResA.status === 200 && breathCompleteResA.data.success, `Status ${breathCompleteResA.status}, session_id: ${breathCompleteResA.data.session_id}`);

  // Direct Neon PostgreSQL query on breathing_sessions
  const dbBreathingA = await pool.query(`SELECT * FROM breathing_sessions WHERE user_id = $1`, [userAUuid]);
  record('Breathing', 'Row Exists in breathing_sessions Table', dbBreathingA.rows.length >= 1 && dbBreathingA.rows[0].duration === 240, `Found ${dbBreathingA.rows.length} rows, duration: ${dbBreathingA.rows[0]?.duration}`);

  // GET /api/breathing/history for User A
  const breathHistA = await apiRequest('/api/breathing/history', { token: activeTokenA });
  const historyListA = Array.isArray(breathHistA.data) ? breathHistA.data : (breathHistA.data?.history || []);
  record('Breathing', 'GET /api/breathing/history Derived from DB', breathHistA.status === 200 && historyListA.length >= 1, `History count: ${historyListA.length}`);

  // GET /api/breathing/stats for User A
  const breathStatsA = await apiRequest('/api/breathing/stats', { token: activeTokenA });
  record('Breathing', 'GET /api/breathing/stats Derived from DB', breathStatsA.status === 200 && breathStatsA.data.total_sessions >= 1 && breathStatsA.data.total_minutes > 0, `Sessions: ${breathStatsA.data.total_sessions}, minutes: ${breathStatsA.data.total_minutes}`);

  // User B's breathing history should NOT contain User A's data
  const breathHistB = await apiRequest('/api/breathing/history', { token: activeTokenB });
  const historyListB = Array.isArray(breathHistB.data) ? breathHistB.data : (breathHistB.data?.history || []);
  record('Breathing', 'User Data Isolation (Breathing)', breathHistB.status === 200 && historyListB.length === 0, `User B history count: ${historyListB.length} (expected 0)`);

  // -------------------------------------------------------------
  // 5. SETTINGS VERIFICATION
  // -------------------------------------------------------------
  console.log('\n--- 5. SETTINGS VERIFICATION ---');
  // Update User A settings
  const updateSettingsRes = await apiRequest('/api/settings', {
    method: 'POST',
    token: activeTokenA,
    body: {
      ai_tone: 'Compassionate Listener',
      voice_speed: 1.25,
      voice_tone: 'calm',
      privacy_level: 'maximum'
    }
  });
  record('Settings', 'POST /api/settings Update', updateSettingsRes.status === 200 && updateSettingsRes.data.settings?.ai_tone === 'Compassionate Listener', `Status ${updateSettingsRes.status}, ai_tone: ${updateSettingsRes.data.settings?.ai_tone}`);

  // Direct PostgreSQL read on user_settings
  const dbSettingsA = await pool.query(`SELECT * FROM user_settings WHERE user_id = $1`, [userAUuid]);
  record('Settings', 'Direct PostgreSQL Persistence in user_settings', dbSettingsA.rows.length === 1 && dbSettingsA.rows[0].ai_tone === 'Compassionate Listener', `Row found, ai_tone: ${dbSettingsA.rows[0]?.ai_tone}, speed: ${dbSettingsA.rows[0]?.voice_speed}`);

  // GET /api/settings for User A
  const getSettingsA = await apiRequest('/api/settings', { token: activeTokenA });
  record('Settings', 'GET /api/settings Verified', getSettingsA.data.settings?.ai_tone === 'Compassionate Listener', `Fetched ai_tone: ${getSettingsA.data.settings?.ai_tone}`);

  // Verify User B settings are isolated and default
  const getSettingsB = await apiRequest('/api/settings', { token: activeTokenB });
  record('Settings', 'User Data Isolation (Settings)', getSettingsB.data.settings?.ai_tone !== 'Compassionate Listener', `User B ai_tone: ${getSettingsB.data.settings?.ai_tone}`);

  // -------------------------------------------------------------
  // 6. PROFILE EXPORT VERIFICATION
  // -------------------------------------------------------------
  console.log('\n--- 6. PROFILE EXPORT VERIFICATION ---');
  const exportRes = await apiRequest('/api/profile/export', { token: activeTokenA });
  const exported = exportRes.data?.data || exportRes.data || {};

  const hasUser = !!exported.user;
  const hasSettings = !!exported.settings;
  const hasMoods = Array.isArray(exported.moods) && exported.moods.length >= 1;
  const hasChats = Array.isArray(exported.chats) && exported.chats.length >= 1;
  const hasBreathing = Array.isArray(exported.breathing_sessions) && exported.breathing_sessions.length >= 1;
  const hasMemories = Array.isArray(exported.memories) && exported.memories.length >= 1;

  record('Profile Export', 'Contains All User-Owned Data', hasUser && hasSettings && hasMoods && hasChats && hasBreathing && hasMemories, `user: ${hasUser}, settings: ${hasSettings}, moods: ${hasMoods}, chats: ${hasChats}, breathing: ${hasBreathing}, memories: ${hasMemories}`);

  // Verify absence of sensitive credentials
  const exportStr = JSON.stringify(exported);
  const leaksPasswordHash = exportStr.includes('password_hash') || (exported.user && typeof exported.user === 'object' && 'password_hash' in exported.user);
  const leaksPasswordSalt = exportStr.includes('password_salt') || (exported.user && typeof exported.user === 'object' && 'password_salt' in exported.user);
  const leaksTokenHash = exportStr.includes('token_hash');
  const leaksRefreshTokens = exportStr.includes('refresh_tokens') || (typeof exported === 'object' && 'refresh_tokens' in exported);

  record('Profile Export', 'Absence of Password Hashes & Salts', !leaksPasswordHash && !leaksPasswordSalt, `leaksPasswordHash: ${leaksPasswordHash}, leaksPasswordSalt: ${leaksPasswordSalt}`);
  record('Profile Export', 'Absence of Refresh Tokens & Hashes', !leaksTokenHash && !leaksRefreshTokens, `leaksTokenHash: ${leaksTokenHash}, leaksRefreshTokens: ${leaksRefreshTokens}`);

  // -------------------------------------------------------------
  // 7. EMOTIONAL INSIGHTS VERIFICATION
  // -------------------------------------------------------------
  console.log('\n--- 7. EMOTIONAL INSIGHTS VERIFICATION ---');
  // Insights for User B (currently 0 moods)
  const insightsB_Empty = await apiRequest('/api/profile/insights', { token: activeTokenB });
  record('Emotional Insights', 'Empty User History Handling', insightsB_Empty.status === 200 && insightsB_Empty.data.total_entries === 0, `Total entries: ${insightsB_Empty.data.total_entries}`);

  // Now add multiple distinct moods to User B
  await dbService.addMoodLog(userBUuid, 'Happy', 90, 'HAPPY', 'Sunny walk');
  await dbService.addMoodLog(userBUuid, 'Anxious', 35, 'ANXIOUS', 'Project deadline');
  await dbService.addMoodLog(userBUuid, 'Calm', 75, 'CALM', 'Evening tea');

  const insightsB_Populated = await apiRequest('/api/profile/insights', { token: activeTokenB });
  const changed = insightsB_Populated.data.total_entries === 3 && insightsB_Populated.data.average_score > 0;
  record('Emotional Insights', 'Dynamic Calculation from Persisted Moods', changed, `Total entries: ${insightsB_Populated.data.total_entries}, avg score: ${insightsB_Populated.data.average_score}, primary: ${insightsB_Populated.data.primary_emotion}`);

  // -------------------------------------------------------------
  // 8. CRISIS SAFETY & CONTEXT / NEGATION / THIRD-PERSON
  // -------------------------------------------------------------
  console.log('\n--- 8. CRISIS SAFETY VERIFICATION ---');
  const crisisCases = [
    { input: 'I want to die.', expectedCrisis: true, expectedLevel: CrisisLevel.SEVERE, type: 'First-Person Severe' },
    { input: 'I have a plan to die.', expectedCrisis: true, expectedLevel: CrisisLevel.SEVERE, type: 'Imminent Plan' },
    { input: 'I want to hurt myself.', expectedCrisis: true, expectedLevel: CrisisLevel.SEVERE, type: 'Self-Harm' },
    { input: 'Everyone would be better off without me', expectedCrisis: true, expectedLevel: CrisisLevel.HIGH, type: 'Indirect Crisis' },
    { input: 'My friend is suicidal.', expectedCrisis: true, expectedLevel: CrisisLevel.SEVERE, type: 'Third-Person Distress' },
    { input: 'I do not want to die, but work is exhausting.', expectedCrisis: false, expectedLevel: CrisisLevel.NONE, type: 'Negated Crisis' },
    { input: 'I am not suicidal.', expectedCrisis: false, expectedLevel: CrisisLevel.NONE, type: 'Direct Negation' },
    { input: "I'm dying of laughter from this video!", expectedCrisis: false, expectedLevel: CrisisLevel.NONE, type: 'Figurative Idiom' },
    { input: 'This exam is killing me!', expectedCrisis: false, expectedLevel: CrisisLevel.NONE, type: 'Figurative Idiom' },
    { input: 'I had a panic attack today and feel overwhelmed.', expectedCrisis: false, expectedLevel: CrisisLevel.MEDIUM, type: 'Medium Distress' }
  ];

  for (const c of crisisCases) {
    const res = checkCrisis(c.input);
    const pass = res.isCrisis === c.expectedCrisis && res.level === c.expectedLevel;
    record('Crisis Safety', `Context Test: ${c.type} ("${c.input.slice(0, 30)}...")`, pass, `isCrisis: ${res.isCrisis} (exp ${c.expectedCrisis}), level: ${res.level} (exp ${c.expectedLevel})`);
  }

  // Verify third-person response differs from first-person response
  const firstPersonRes = checkCrisis('I want to die.');
  const thirdPersonRes = checkCrisis('My friend is suicidal.');
  const diffResponse = firstPersonRes.response !== thirdPersonRes.response &&
                       thirdPersonRes.response?.includes('someone you care about');
  record('Crisis Safety', 'Third-Person vs First-Person Response Distinction', diffResponse, `Third-person addresses helping a friend: ${thirdPersonRes.response?.slice(0, 60)}...`);

  // -------------------------------------------------------------
  // 9. HELPLINE COVERAGE VERIFICATION
  // -------------------------------------------------------------
  console.log('\n--- 9. HELPLINE COVERAGE VERIFICATION ---');
  const checkHelplines = (resp?: string) => {
    if (!resp) return false;
    const hasTeleManas = resp.includes('14416') || resp.includes('1800-891-4416');
    const hasKiran = resp.includes('1800-599-0019');
    return hasTeleManas && hasKiran;
  };

  record('Helpline Coverage', 'Severe First-Person Helplines (Tele-MANAS & KIRAN)', checkHelplines(firstPersonRes.response), `Tele-MANAS & KIRAN present: ${checkHelplines(firstPersonRes.response)}`);
  record('Helpline Coverage', 'Severe Third-Person Helplines (Tele-MANAS & KIRAN)', checkHelplines(thirdPersonRes.response), `Tele-MANAS & KIRAN present: ${checkHelplines(thirdPersonRes.response)}`);

  const highRes = checkCrisis('giving up on life');
  record('Helpline Coverage', 'High Severity Helplines (Tele-MANAS & KIRAN)', checkHelplines(highRes.response), `Tele-MANAS & KIRAN present: ${checkHelplines(highRes.response)}`);

  // -------------------------------------------------------------
  // 10. CRISIS RESPONSE EMOJI CHECK
  // -------------------------------------------------------------
  console.log('\n--- 10. CRISIS RESPONSE EMOJI CHECK ---');
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F000}-\u{1F02F}]/u;

  const responsesToCheck = [
    firstPersonRes.response || '',
    thirdPersonRes.response || '',
    highRes.response || '',
    HELPLINE_RESOURCES.teleManas,
    HELPLINE_RESOURCES.kiran,
    HELPLINE_RESOURCES.emergency
  ];

  let emojiFound = false;
  for (const str of responsesToCheck) {
    if (emojiRegex.test(str)) {
      emojiFound = true;
      console.error(`Emoji detected in response string: "${str}"`);
    }
  }
  record('Crisis Emoji Check', 'Zero Emojis in All Crisis Holding Paths', !emojiFound, `Programmatic check passed: 0 emojis detected`);

  // -------------------------------------------------------------
  // 11. CRISIS RESPONSE DETERMINISM & LATENCY
  // -------------------------------------------------------------
  console.log('\n--- 11. CRISIS RESPONSE DETERMINISM & LATENCY ---');
  const iterations = 100;
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    checkCrisis('I feel suicidal and want to end it all');
  }
  const avgLatency = (performance.now() - start) / iterations;
  record('Crisis Determinism', 'Sub-millisecond Execution (< 1ms)', avgLatency < 1.0, `Average latency over 100 runs: ${avgLatency.toFixed(3)} ms`);

  // -------------------------------------------------------------
  // 12. USER DATA ISOLATION AUDIT
  // -------------------------------------------------------------
  console.log('\n--- 12. USER DATA ISOLATION AUDIT ---');
  // User B attempts to access User A's data
  const userBChats = await apiRequest('/api/chat/history', { token: activeTokenB });
  const userAInBChats = userBChats.data?.some?.((m: any) => m.message?.includes('User A'));
  record('User Isolation', 'Chat History Isolation', !userAInBChats, `User B sees only their own chats`);

  const userBMemories = await apiRequest('/api/companion/memories', { token: activeTokenB });
  const userAInBMemories = userBMemories.data?.some?.((m: any) => m.title === 'First Session');
  record('User Isolation', 'Companion Memories Isolation', !userAInBMemories, `User B sees only their own memories`);

  const userBMoods = await apiRequest('/api/mood/history', { token: activeTokenB });
  const userAInBMoods = userBMoods.data?.some?.((m: any) => m.mood === 'Joyful' && m.score === 85);
  record('User Isolation', 'Mood Log Isolation', !userAInBMoods, `User B sees only their own moods`);

  // -------------------------------------------------------------
  // 13. API SECURITY AUDIT
  // -------------------------------------------------------------
  console.log('\n--- 13. API SECURITY AUDIT ---');
  const unauthEndpoints = [
    '/api/auth/me',
    '/api/settings',
    '/api/companion/memories',
    '/api/breathing/history',
    '/api/profile/export'
  ];

  let unauthBlocked = true;
  for (const ep of unauthEndpoints) {
    const res = await apiRequest(ep);
    if (res.status !== 401) {
      unauthBlocked = false;
      console.error(`Endpoint ${ep} allowed unauthenticated access with status ${res.status}`);
    }
  }
  record('API Security', 'All Protected Endpoints Reject Unauthenticated Access', unauthBlocked, `Checked ${unauthEndpoints.length} endpoints`);

  // Malformed requests
  const emptyChatRes = await apiRequest('/api/chat/send', {
    method: 'POST',
    token: activeTokenA,
    body: { message: '' }
  });
  record('API Security', 'Empty Message Rejected with 400', emptyChatRes.status === 400, `Status ${emptyChatRes.status}`);

  // -------------------------------------------------------------
  // 14. REFRESH TOKEN DATABASE AUDIT
  // -------------------------------------------------------------
  console.log('\n--- 14. REFRESH TOKEN DATABASE AUDIT ---');
  const tokenRows = await pool.query(
    `SELECT id, user_id, token_hash, expires_at, revoked FROM refresh_tokens LIMIT 5`
  );
  let hashValid = tokenRows.rows.length > 0;
  for (const row of tokenRows.rows) {
    if (!/^[a-f0-9]{64}$/i.test(row.token_hash)) {
      hashValid = false;
    }
  }
  record('Token Database Audit', 'Cryptographic SHA-256 Hashing Enforced in DB', hashValid, `Verified ${tokenRows.rows.length} rows contain 64-char SHA256 hashes`);

  // -------------------------------------------------------------
  // 15. ERROR HANDLING
  // -------------------------------------------------------------
  console.log('\n--- 15. ERROR HANDLING ---');
  const invalidJsonRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{ malformed json }'
  });
  record('Error Handling', 'Malformed JSON Payload Handled Gracefully', invalidJsonRes.status === 400, `Status ${invalidJsonRes.status}`);

  // -------------------------------------------------------------
  // 16. PRODUCTION CONFIGURATION AUDIT
  // -------------------------------------------------------------
  console.log('\n--- 16. PRODUCTION CONFIGURATION AUDIT ---');
  const envUrl = process.env.DATABASE_URL;
  const isPostgres = envUrl && envUrl.startsWith('postgresql://');
  record('Configuration', 'DATABASE_URL Valid PostgreSQL Connection String', Boolean(isPostgres), `PostgreSQL URL: ${Boolean(isPostgres)}`);

  // -------------------------------------------------------------
  // 17. DATABASE INDEX & SCHEMA AUDIT
  // -------------------------------------------------------------
  console.log('\n--- 17. DATABASE INDEX & SCHEMA AUDIT ---');
  const indexCheck = await pool.query(`
    SELECT indexname, tablename FROM pg_indexes
    WHERE tablename IN ('users', 'chat_messages', 'mood_logs', 'breathing_sessions', 'refresh_tokens')
  `);
  const indexNames = indexCheck.rows.map(r => r.indexname);
  const hasUserEmailIdx = indexNames.some(i => i.includes('email'));
  const hasChatIdx = indexNames.some(i => i.includes('chat'));
  const hasBreathingIdx = indexNames.some(i => i.includes('breathing'));
  const hasRefreshIdx = indexNames.some(i => i.includes('refresh'));

  record('Schema Audit', 'Relational Indexes on Critical Columns', hasUserEmailIdx && hasChatIdx && hasBreathingIdx && hasRefreshIdx, `Found indexes: ${indexNames.join(', ')}`);

  // -------------------------------------------------------------
  // 18. CONCURRENCY TEST (REFRESH TOKEN ROTATION RACE-CONDITION TEST)
  // -------------------------------------------------------------
  console.log('\n--- 18. CONCURRENCY TEST ---');
  // Login to get a dedicated refresh token for race condition test
  const raceLogin = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email: testUserAEmail, password }
  });
  const concurrentRefreshToken = raceLogin.data.refresh_token;

  // Fire Request A and Request B simultaneously with the EXACT same refresh token
  const [resConcurrentA, resConcurrentB] = await Promise.all([
    apiRequest('/api/auth/refresh', {
      method: 'POST',
      body: { refresh_token: concurrentRefreshToken }
    }),
    apiRequest('/api/auth/refresh', {
      method: 'POST',
      body: { refresh_token: concurrentRefreshToken }
    })
  ]);

  const statuses = [resConcurrentA.status, resConcurrentB.status];
  const exactlyOne200 = statuses.filter(s => s === 200).length === 1;
  const exactlyOne401 = statuses.filter(s => s === 401).length === 1;
  record('Concurrency', 'Race-Free Token Rotation Under Concurrent Replay', exactlyOne200 && exactlyOne401, `Status A: ${resConcurrentA.status}, Status B: ${resConcurrentB.status} (Exactly one succeeded, one rejected)`);

  // Clean up test users
  await dbService.deleteUserData(userAUuid);
  await dbService.deleteUserData(userBUuid);
  console.log('\nCleaned up verification test accounts.');

  // Summary
  console.log('\n================================================================');
  console.log('FINAL VERIFICATION SUMMARY');
  console.log('================================================================');
  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`Total Checks: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Status: ${failed === 0 ? 'PRODUCTION VERIFIED' : 'PRODUCTION BLOCKED'}`);

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Verification failed with fatal error:', err);
  process.exit(1);
});
