async function testRagChat() {
  const baseUrl = 'http://127.0.0.1:3000';
  
  // Register user
  const userRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'RAG Test User',
      email: `rag_chat_${Date.now()}@soultalk.app`,
      password: 'Password123!',
      companion_name: 'Wolfie',
      companion_type: 'wolfie_guardian',
      personality_type: 'Gentle Friend',
      language: 'mr'
    })
  });
  const userData = await userRes.json();
  const token = userData.access_token;

  console.log('Testing Chat Request with Knowledge Trigger ("breathing exercise")...');
  const chatRes = await fetch(`${baseUrl}/api/chat/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      message: 'Mala anxiety kami karayla kahi breathing exercise sangshil ka?',
      companion_name: 'Wolfie',
      user_name: 'RAG Test User'
    })
  });

  const chatData = await chatRes.json();
  console.log('\nResponse Status:', chatRes.status);
  console.log('Mode:', chatData.mode);
  console.log('Knowledge Retrieved:', chatData.knowledge_retrieved);
  console.log('Engine Used:', chatData.engine_used);
  console.log('Reply:\n', chatData.reply || chatData.message);
}

testRagChat().catch(console.error);
