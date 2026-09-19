import { generateCompanionResponse } from '../server/modelAdapter';
import { analyzeEmotionalState } from '../server/emotionalStateEngine';
import { checkCrisis } from '../server/safetyEngine';
import { buildSoulTalkSystemPrompt } from '../server/responsePolicy';
import { geminiLLM } from '../server/llm/geminiProvider';

async function runFallbackVerification() {
  console.log('\n======================================================');
  console.log('TEST 6: FALLBACK PATH VERIFICATION');
  console.log('======================================================\n');

  // --- Test A: Normal Model Success ---
  console.log('--- TEST A: NORMAL MODEL SUCCESS ---');
  const normalMsg = "interview mule nervous vatat aahe";
  const crisisA = checkCrisis(normalMsg);
  const stateA = analyzeEmotionalState(normalMsg, crisisA.level);
  const promptA = buildSoulTalkSystemPrompt({
    userName: 'Aishwarya',
    companionName: 'Wolfie',
    emotionalState: stateA
  });

  const resA = await generateCompanionResponse({
    systemPrompt: promptA,
    userMessage: normalMsg,
    chatHistory: [],
    emotionalState: stateA,
    userName: 'Aishwarya',
    companionName: 'Wolfie',
    generationMode: 'GENERATIVE',
    contextUsed: false,
    knowledgeRetrieved: false
  });

  console.log(`Test A Result:`);
  console.log(`  Model Used: ${resA.modelUsed}`);
  console.log(`  Engine Used: ${resA.engineUsed}`);
  console.log(`  Fallback Used: ${resA.fallbackUsed} (Expected: false)`);
  console.log(`  Reply: "${resA.replyText}"\n`);

  // --- Test B: Primary Model Returns 429 (Candidate Failover) ---
  console.log('--- TEST B: PRIMARY MODEL RETURNS 429 SIMULATED FAILOVER ---');
  // Temporarily simulate first candidate failing with 429
  const originalGenerate = (geminiLLM as any).candidateModels;
  try {
    // Put an invalid model first that will fail or trigger error
    (geminiLLM as any).candidateModels = [
      'gemini-nonexistent-model-429-test',
      'gemini-3.1-flash-lite-preview',
      'gemini-3-flash-preview'
    ];

    const resB = await generateCompanionResponse({
      systemPrompt: promptA,
      userMessage: "future career baddal confusion aahe",
      chatHistory: [],
      emotionalState: stateA,
      userName: 'Aishwarya',
      companionName: 'Wolfie',
      generationMode: 'GENERATIVE',
      contextUsed: false,
      knowledgeRetrieved: false
    });

    console.log(`Test B Result:`);
    console.log(`  Model Used: ${resB.modelUsed} (Succeeded via candidate failover)`);
    console.log(`  Engine Used: ${resB.engineUsed}`);
    console.log(`  Fallback Used: ${resB.fallbackUsed}`);
    console.log(`  Reply: "${resB.replyText}"\n`);
  } finally {
    (geminiLLM as any).candidateModels = originalGenerate;
  }

  // --- Test C: Primary Model Returns 503 (Candidate Failover) ---
  console.log('--- TEST C: PRIMARY MODEL RETURNS 503 SIMULATED FAILOVER ---');
  try {
    (geminiLLM as any).candidateModels = [
      'gemini-unavailable-503-simulator',
      'gemini-3-flash-preview',
      'gemini-3.1-flash-lite-preview'
    ];

    const resC = await generateCompanionResponse({
      systemPrompt: promptA,
      userMessage: "majha confidence kami zala aahe",
      chatHistory: [],
      emotionalState: stateA,
      userName: 'Aishwarya',
      companionName: 'Wolfie',
      generationMode: 'GENERATIVE',
      contextUsed: false,
      knowledgeRetrieved: false
    });

    console.log(`Test C Result:`);
    console.log(`  Model Used: ${resC.modelUsed} (Failover preserved live generation)`);
    console.log(`  Engine Used: ${resC.engineUsed}`);
    console.log(`  Fallback Used: ${resC.fallbackUsed}`);
    console.log(`  Reply: "${resC.replyText}"\n`);
  } finally {
    (geminiLLM as any).candidateModels = originalGenerate;
  }

  // --- Test D: All Model Providers Fail (Graceful Contextual Fallback) ---
  console.log('--- TEST D: ALL MODEL PROVIDERS FAIL (GRACEFUL CONTEXTUAL FALLBACK) ---');
  // Temporarily disable candidate models to simulate total network outage
  const topicsToTest = [
    { topic: "College stress", msg: "college cha khup stress zala aahe" },
    { topic: "Job tension", msg: "mala job cha tension yetoy" },
    { topic: "Family conflict", msg: "aaj ghari mummy sobat vad zala" },
    { topic: "Loneliness", msg: "aaj khup lonely vatatay" },
    { topic: "Relationship issue", msg: "relationship madhye khup misunderstanding zali aahe" },
    { topic: "Overthinking", msg: "mala satat overthinking hotay" }
  ];

  try {
    (geminiLLM as any).candidateModels = ['offline-mock-1', 'offline-mock-2'];

    const fallbackReplies: string[] = [];

    for (const item of topicsToTest) {
      const crisis = checkCrisis(item.msg);
      const state = analyzeEmotionalState(item.msg, crisis.level);
      const prompt = buildSoulTalkSystemPrompt({
        userName: 'Aishwarya',
        companionName: 'Wolfie',
        emotionalState: state
      });

      const resD = await generateCompanionResponse({
        systemPrompt: prompt,
        userMessage: item.msg,
        chatHistory: [],
        emotionalState: state,
        userName: 'Aishwarya',
        companionName: 'Wolfie',
        generationMode: 'GENERATIVE',
        contextUsed: false,
        knowledgeRetrieved: false
      });

      fallbackReplies.push(resD.replyText);

      console.log(`[TOPIC: ${item.topic}] Message: "${item.msg}"`);
      console.log(`  Model: ${resD.modelUsed}`);
      console.log(`  Engine: ${resD.engineUsed}`);
      console.log(`  Fallback Used: ${resD.fallbackUsed} (Expected: true)`);
      console.log(`  Reply: "${resD.replyText}"\n`);
    }

    const uniqueFallbackCount = new Set(fallbackReplies).size;
    console.log(`>>> Fallback uniqueness across 6 topics: ${uniqueFallbackCount} / ${topicsToTest.length} unique replies.`);
  } finally {
    (geminiLLM as any).candidateModels = originalGenerate;
  }
}

runFallbackVerification().catch(err => {
  console.error('Error verifying fallback paths:', err);
  process.exit(1);
});
