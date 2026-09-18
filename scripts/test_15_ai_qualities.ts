const TEST_PROMPTS = [
  { id: 1, category: "loneliness", lang: "Roman Marathi", text: "Mala khup ekat vatat aahe, koni bolayla nahiye." },
  { id: 2, category: "overthinking", lang: "Roman Marathi", text: "Ratrabhar vichar thambatch nahit, overthinking mule doka dukhayla lagla aahe." },
  { id: 3, category: "exam pressure", lang: "Roman Marathi", text: "Exam 2 diwsavar aaliye ani majha abhyas kahich jhala nahiye, khup tension yetoy." },
  { id: 4, category: "job stress", lang: "mixed Marathi-English", text: "Office madhe manager khup pressure taktoy, job sodun dyava asa vatat aahe." },
  { id: 5, category: "breakup", lang: "Roman Marathi", text: "3 varshancha relationship sampala, ti mala sodun geli, manat khup dukh hotay." },
  { id: 6, category: "family pressure", lang: "Roman Marathi", text: "Gharche satat lagna kar mhanun pressure det ahet, majha career ajun set nahiye." },
  { id: 7, category: "motivation", lang: "Roman Marathi", text: "Mala majha dream achieve karaycha aahe pan madhech himmat harun jato, kay karu?" },
  { id: 8, category: "sadness", lang: "Roman Marathi", text: "Aaj kahi karan nasunhi khup radayla yet aahe, khup udas vatat aahe." },
  { id: 9, category: "happiness", lang: "Roman Marathi", text: "Aaj majha interview clear jhala! Khup anand hoto aahe, yay!" },
  { id: 10, category: "casual conversation", lang: "Roman Marathi", text: "Hey Wolfie! Kasa ahes tu? Aaj cha diwas kasa gela?" },
  { id: 11, category: "follow-up conversation", lang: "Roman Marathi", text: "Kal tu sangitales te breathing try kela, thoda bara vatla pan ajunhi bechaini aahe." },
  { id: 12, category: "English", lang: "English", text: "I feel completely overwhelmed by all my responsibilities and I just want to pause." },
  { id: 13, category: "Hindi", lang: "Hindi", text: "Mujhe lagta hai ki main sab kuch galat kar raha hoon, koi meri baat nahi samajhta." },
  { id: 14, category: "Roman Marathi", lang: "Roman Marathi", text: "Swatahavarcha vishwas sampat chalalay, ashi feeling yete ki me kaych karu shakat nahi." },
  { id: 15, category: "mixed Marathi-English", lang: "mixed Marathi-English", text: "Life khup unpredictable aahe yaar, future cha vihar karun panic attack yetat." }
];

async function run15QualityTests() {
  const baseUrl = 'http://127.0.0.1:3000';

  console.log('===========================================================');
  console.log(' RUNNING 15 REALISTIC EVALUATIONS VIA /api/chat/send');
  console.log('===========================================================');

  // Register a dedicated evaluation test user
  const userRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Evaluation Friend',
      email: `eval_${Date.now()}@soultalk.app`,
      password: 'Pass123!Password',
      companion_name: 'Wolfie',
      companion_type: 'wolfie_guardian',
      personality_type: 'Gentle Friend',
      language: 'mr'
    })
  });
  const userData = await userRes.json();
  const token = userData.access_token;

  for (const item of TEST_PROMPTS) {
    try {
      const res = await fetch(`${baseUrl}/api/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: item.text,
          companion_name: 'Wolfie',
          user_name: 'Evaluation Friend'
        })
      });

      const data = await res.json();
      console.log(`\n-----------------------------------------------------------`);
      console.log(`Test #${item.id} [${item.category.toUpperCase()}] (${item.lang})`);
      console.log(`User: "${item.text}"`);
      console.log(`Engine: ${data.engine_used || 'UNKNOWN'} | Emotion: ${data.emotion}`);
      console.log(`SoulTalk Reply:\n"${data.reply || data.message}"`);
    } catch (e: any) {
      console.error(`Test #${item.id} failed:`, e.message);
    }
  }
}

run15QualityTests().catch(console.error);
