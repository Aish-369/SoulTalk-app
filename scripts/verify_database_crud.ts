import { dbService } from '../server/db';

async function testAppCrud() {
  console.log('Testing App-Level Database CRUD via dbService...');
  const testEmail = 'verify_' + Date.now() + '@soultalk.app';
  const testUserId = 'usr_test_' + Date.now();

  try {
    // 1. User Creation
    const createdUser = await dbService.createUser({
      id: testUserId,
      name: 'Verify User',
      email: testEmail,
      password_hash: 'hash123',
      password_salt: 'salt123',
      companion_name: 'Wolfie',
      companion_type: 'wolfie_guardian',
      personality_type: 'Gentle Friend',
      language: 'mr',
      is_guest: false
    });
    console.log('1. User Creation:', createdUser ? 'SUCCESS' : 'FAILED', createdUser.id, createdUser.email);

    // 2. User Retrieval
    const retrievedUser = await dbService.getUserByEmail(testEmail);
    console.log('2. User Retrieval by Email:', retrievedUser && retrievedUser.id === testUserId ? 'SUCCESS' : 'FAILED');

    const retrievedById = await dbService.getUserById(testUserId);
    console.log('2b. User Retrieval by ID:', retrievedById && retrievedById.email === testEmail ? 'SUCCESS' : 'FAILED');

    // 3. Chat Message INSERT
    const chatMsg = await dbService.addChatMessage(
      testUserId,
      'user',
      'Mala khup overthinking hot aahe',
      'anxious',
      0.96
    );
    console.log('3. Chat Message INSERT:', chatMsg ? 'SUCCESS' : 'FAILED', chatMsg.id);

    // 4. Chat Message READ
    const chatHistory = await dbService.getChatHistory(testUserId, 10);
    console.log('4. Chat Message READ:', chatHistory.length === 1 && chatHistory[0].message === 'Mala khup overthinking hot aahe' ? 'SUCCESS' : 'FAILED', 'Read Count:', chatHistory.length);

    // 5. Mood INSERT
    const moodLog = await dbService.addMoodLog(
      testUserId,
      'exhausted',
      3,
      'Stressed',
      'Exam and work fatigue'
    );
    console.log('5. Mood INSERT:', moodLog ? 'SUCCESS' : 'FAILED', moodLog.id);

    // 6. Mood READ
    const moodLogs = await dbService.getMoodLogs(testUserId, 10);
    console.log('6. Mood READ:', moodLogs.length === 1 && moodLogs[0].notes === 'Exam and work fatigue' ? 'SUCCESS' : 'FAILED', 'Read Count:', moodLogs.length);

    // 7. Companion Memory INSERT
    const memory = await dbService.addMemory(
      testUserId,
      'Semester Exam',
      'User is stressed about upcoming semester examinations',
      'academic',
      '📚'
    );
    console.log('7. Companion Memory INSERT:', memory ? 'SUCCESS' : 'FAILED', memory.id);

    // 8. Companion Memory READ
    const memories = await dbService.getMemories(testUserId);
    console.log('8. Companion Memory READ:', memories.length === 1 && memories[0].title === 'Semester Exam' ? 'SUCCESS' : 'FAILED', 'Read Count:', memories.length);

    // 9. RAG Document READ
    const ragDocs = await dbService.searchRagKnowledge('overthinking anxiety breathwork', 3);
    console.log('9. RAG Document READ (pgvector cosine search):', ragDocs.length > 0 ? 'SUCCESS' : 'FAILED', 'Found:', ragDocs.length, ragDocs.map(d => ({ id: d.id, category: d.category, sim: d.similarity })));

    // 10. Clean up test records
    await dbService.deleteUserData(testUserId);
    const verifyCleaned = await dbService.getUserById(testUserId);
    console.log('10. User Deletion & Cleanup:', verifyCleaned === null ? 'SUCCESS' : 'FAILED');

  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

testAppCrud();
