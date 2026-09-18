import { searchPgvectorRAG } from '../server/neonVectorRag';
import { routeConversation } from '../server/conversationRouter';
import { analyzeEmotionalState } from '../server/emotionalStateEngine';
import { checkCrisis } from '../server/safetyEngine';
import { generateCompanionResponse } from '../server/modelAdapter';
import { buildSoulTalkSystemPrompt } from '../server/responsePolicy';
import { validateAndSanitizeResponse } from '../server/qualityGuard';

const TEST_QUERIES = [
  "Mala khup overthinking hot aahe.",
  "Exam mule mala khup pressure yetoy.",
  "Mala breakup nantar khup lonely vatat aahe.",
  "Job nahi milat mhanun tension aahe."
];

async function runRagProof() {
  console.log('===========================================================');
  console.log(' RAG PIPELINE PROOF TEST ACROSS 4 CORE QUERIES');
  console.log('===========================================================');

  for (let i = 0; i < TEST_QUERIES.length; i++) {
    const q = TEST_QUERIES[i];
    console.log(`\n--- QUERY ${i + 1}: "${q}" ---`);

    // 1. Check Routing Decision in actual application
    const crisisCheck = checkCrisis(q);
    const emotionalState = analyzeEmotionalState(q, crisisCheck.level);
    const routing = routeConversation(q, emotionalState, crisisCheck, 0);

    console.log(`Application Router -> Mode: ${routing.mode}, retrieveKnowledge: ${routing.retrieveKnowledge}, Reason: ${routing.reason}`);

    // 2. Perform actual pgvector similarity search on rag_documents in Neon
    const ragResult = await searchPgvectorRAG(q, 3, 0.50);

    console.log(`pgvector Search Result:`);
    console.log(` - Success: ${ragResult.success}`);
    console.log(` - Retrieved Count: ${ragResult.retrieved_count}`);
    console.log(` - Retrieved IDs: ${JSON.stringify(ragResult.retrieved_ids)}`);
    console.log(` - Retrieved Scores (Cosine Sim): ${JSON.stringify(ragResult.retrieved_scores)}`);
    console.log(` - Retrieved Topics: ${JSON.stringify(ragResult.retrieved_topics)}`);

    if (ragResult.documents.length > 0) {
      console.log(` - Sample Chunk Preview:`);
      ragResult.documents.forEach((doc, idx) => {
        console.log(`   [Chunk #${doc.id} | Sim: ${doc.similarity_score.toFixed(4)} | Cat: ${doc.category}]: "${doc.content.slice(0, 100)}..."`);
      });
    }

    // 3. Check whether retrieved context was passed to AI prompt in actual application
    // In server.ts, if routing.retrieveKnowledge is false, knowledgeSnippets = []!
    const actuallyPassedToAi = routing.retrieveKnowledge && ragResult.documents.length > 0;
    console.log(` - Was pgvector retrieved context actually passed to AI prompt in standard chat?: ${actuallyPassedToAi ? 'YES' : 'NO'}`);

    // 4. Now generate final response with and without pgvector context to inspect output
    const knowledgeSnippetsForPrompt = ragResult.documents.map(d => ({
      id: `pg_${d.id}`,
      topic: d.category,
      title: `${d.category} Coping Support`,
      technique: 'Supportive Validation',
      content: d.content
    }));

    const systemPrompt = buildSoulTalkSystemPrompt({
      userName: 'Friend',
      companionName: 'Wolfie',
      companionType: 'wolfie_guardian',
      personalityType: 'Gentle Friend',
      emotionalState,
      recentContextSummary: '',
      persistentMemories: [],
      knowledgeSnippets: actuallyPassedToAi ? knowledgeSnippetsForPrompt : []
    });

    const gen = await generateCompanionResponse({
      systemPrompt,
      userMessage: q,
      chatHistory: [],
      emotionalState,
      userName: 'Friend',
      companionName: 'Wolfie',
      generationMode: routing.mode,
      contextUsed: actuallyPassedToAi,
      knowledgeRetrieved: actuallyPassedToAi
    });

    const sanitized = validateAndSanitizeResponse(gen.replyText, emotionalState, 'Friend');
    console.log(` - Engine Used: ${gen.engineUsed}`);
    console.log(` - Final Companion Response:\n   "${sanitized.sanitizedText}"`);
  }
}

runRagProof().catch(console.error);
