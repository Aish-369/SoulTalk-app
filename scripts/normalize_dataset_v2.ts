import fs from 'fs';
import path from 'path';

export interface CanonicalMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CanonicalConversation {
  id: string;
  topic: string;
  crisis_tag: 'CRISIS_NONE' | 'CRISIS_LOW' | 'CRISIS_MEDIUM' | 'CRISIS_HIGH';
  context_reference: string | null;
  messages: CanonicalMessage[];
}

function normalizeDataset() {
  console.log('--- STARTING SOULTALK DATASET V2 NORMALIZATION & CURATION ---');

  const rawPath = path.join(process.cwd(), 'backend/dataset/soultalk_dataset.json');
  if (!fs.existsSync(rawPath)) {
    throw new Error(`File not found: ${rawPath}`);
  }

  const rawLines = fs.readFileSync(rawPath, 'utf8').trim().split('\n');
  const parsedRecords: any[] = rawLines.map(l => {
    try { return JSON.parse(l); } catch { return null; }
  }).filter(Boolean);

  console.log(`Initial raw records parsed: ${parsedRecords.length}`);

  const bannedPhrases = [
    'according to psychology',
    'you have been diagnosed',
    'clinical diagnosis',
    'as a therapist',
    'as a licensed medical',
    'i prescribe'
  ];

  const seenOpeners = new Set<string>();
  const seenAssistantReplies = new Map<string, number>();
  const curatedChains: CanonicalConversation[] = [];

  for (const record of parsedRecords) {
    if (!record.messages || !Array.isArray(record.messages) || record.messages.length < 2) {
      continue;
    }

    // Clean messages
    const cleanedMessages: CanonicalMessage[] = [];
    let isBanned = false;

    for (const msg of record.messages) {
      const content = (msg.content || msg.text || '').trim();
      const role = (msg.role === 'human' || msg.role === 'user') ? 'user' : 'assistant';
      if (!content) continue;

      const lower = content.toLowerCase();
      if (bannedPhrases.some(bp => lower.includes(bp))) {
        isBanned = true;
        break;
      }

      cleanedMessages.push({ role, content });
    }

    if (isBanned || cleanedMessages.length < 2) continue;

    // Quality gate: 1st turn must be user
    const firstUser = cleanedMessages.find(m => m.role === 'user');
    if (!firstUser) continue;

    const openerKey = firstUser.content.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seenOpeners.has(openerKey)) {
      continue; // Skip exact duplicate opening prompt
    }
    seenOpeners.add(openerKey);

    // Limit repetition of identical assistant responses
    let hasRepetitiveAssistant = false;
    for (const m of cleanedMessages) {
      if (m.role === 'assistant') {
        const key = m.content.toLowerCase().slice(0, 50);
        const count = seenAssistantReplies.get(key) || 0;
        if (count >= 2) {
          hasRepetitiveAssistant = true;
          break;
        }
      }
    }
    if (hasRepetitiveAssistant) continue;

    // Record usage
    for (const m of cleanedMessages) {
      if (m.role === 'assistant') {
        const key = m.content.toLowerCase().slice(0, 50);
        seenAssistantReplies.set(key, (seenAssistantReplies.get(key) || 0) + 1);
      }
    }

    curatedChains.push({
      id: record.id || `st_v2_${curatedChains.length + 1}`,
      topic: record.topic || 'General Support',
      crisis_tag: record.crisis_tag || 'CRISIS_NONE',
      context_reference: record.context_reference || null,
      messages: cleanedMessages
    });

    // Target between 350-400 genuinely diverse high quality chains
    if (curatedChains.length >= 380) {
      break;
    }
  }

  console.log(`Curated clean chains: ${curatedChains.length}`);

  // Deterministic 80/10/10 split
  // Shuffle deterministically using seeded index
  const trainSplit: CanonicalConversation[] = [];
  const valSplit: CanonicalConversation[] = [];
  const testSplit: CanonicalConversation[] = [];

  curatedChains.forEach((chain, idx) => {
    const mod = idx % 10;
    if (mod === 8) {
      valSplit.push(chain);
    } else if (mod === 9) {
      testSplit.push(chain);
    } else {
      trainSplit.push(chain);
    }
  });

  console.log(`Split distribution:`);
  console.log(`  Train (80%): ${trainSplit.length} chains`);
  console.log(`  Validation (10%): ${valSplit.length} chains`);
  console.log(`  Test (10%): ${testSplit.length} chains`);

  // Calculate total turns
  const totalTurns = curatedChains.reduce((acc, c) => acc + c.messages.length, 0);
  console.log(`Total conversational turns in V2 dataset: ${totalTurns}`);

  // Save to backend/dataset
  fs.writeFileSync(
    path.join(process.cwd(), 'backend/dataset/train.jsonl'),
    trainSplit.map(c => JSON.stringify(c)).join('\n') + '\n'
  );
  fs.writeFileSync(
    path.join(process.cwd(), 'backend/dataset/validation.jsonl'),
    valSplit.map(c => JSON.stringify(c)).join('\n') + '\n'
  );
  fs.writeFileSync(
    path.join(process.cwd(), 'backend/dataset/test.jsonl'),
    testSplit.map(c => JSON.stringify(c)).join('\n') + '\n'
  );

  console.log('Successfully written train.jsonl, validation.jsonl, and test.jsonl');
}

normalizeDataset();
