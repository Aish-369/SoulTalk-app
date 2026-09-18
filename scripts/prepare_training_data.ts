import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface UnifiedConversationTurn {
  from: 'human' | 'gpt';
  value: string;
}

interface NormalizedConversation {
  id: string;
  topic: string;
  emotion?: string;
  source: string;
  conversations: UnifiedConversationTurn[];
  language: 'roman_marathi';
}

interface InstructionSample {
  id: string;
  instruction: string;
  input: string;
  output: string;
  system: string;
  topic: string;
}

const SYSTEM_INSTRUCTION_ROMAN_MARATHI = 
  "You are SoulTalk's empathetic AI companion. Your goal is to provide active emotional listening, validation, and compassionate presence in fluent, warm Roman Marathi (Marathi in Latin script). Never pretend to be human or a medical doctor, avoid toxic positivity, and always keep responses warm, concise, and non-judgmental.";

function normalizeText(text: string): string {
  return (text || '').trim().replace(/\s+/g, ' ');
}

function computeHash(text: string): string {
  return crypto.createHash('md5').update(text.toLowerCase().replace(/[^a-z0-9]/g, '')).digest('hex');
}

function isHighQuality(userText: string, botText: string): boolean {
  if (userText.length < 3 || botText.length < 8) return false;
  
  // Check for excessive Devanagari (Must be Roman Marathi)
  const devanagariCount = (botText.match(/[\u0900-\u097F]/g) || []).length;
  if (devanagariCount > 10) return false;

  // Check for codependency
  const lower = botText.toLowerCase();
  if (lower.includes('you only need me') || lower.includes('fakt majhyavar depend raha')) {
    return false;
  }

  return true;
}

function parseJsonObjects(rawText: string): any[] {
  const cleaned = rawText.trim();
  if (!cleaned) return [];
  if (cleaned.startsWith('[')) {
    try {
      return JSON.parse(cleaned);
    } catch (e) {
      // continue to scanner
    }
  }

  const results: any[] = [];
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  let startIndex = -1;

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (!inString) {
      if (char === '{' || char === '[') {
        if (depth === 0) {
          startIndex = i;
        }
        depth++;
      } else if (char === '}' || char === ']') {
        depth--;
        if (depth === 0 && startIndex !== -1) {
          const objStr = cleaned.slice(startIndex, i + 1);
          try {
            const parsed = JSON.parse(objStr);
            if (Array.isArray(parsed)) {
              results.push(...parsed);
            } else {
              results.push(parsed);
            }
          } catch (err) {
            // Ignore corrupted chunk
          }
          startIndex = -1;
        }
      }
    }
  }

  return results;
}

export function runDataPipeline() {
  console.log('=== Starting SoulTalk Generative Training Data Preparation Pipeline ===\n');

  const datasetDir = path.join(process.cwd(), 'backend', 'dataset');
  const outputDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const seenHashes = new Set<string>();
  const normalizedConversations: NormalizedConversation[] = [];
  const instructionSamples: InstructionSample[] = [];
  const knowledgeCorpus: any[] = [];

  let totalRawEntries = 0;
  let duplicatesFiltered = 0;
  let lowQualityFiltered = 0;

  // 1. Process soultalk_dataset.json (JSONL multi-turn)
  const soultalkPath = path.join(datasetDir, 'soultalk_dataset.json');
  if (fs.existsSync(soultalkPath)) {
    const rawContent = fs.readFileSync(soultalkPath, 'utf8');
    const lines = rawContent.split('\n').filter(l => l.trim().length > 0);
    console.log(`Loaded ${lines.length} entries from soultalk_dataset.json`);

    for (let i = 0; i < lines.length; i++) {
      totalRawEntries++;
      try {
        const item = JSON.parse(lines[i]);
        const messages = item.messages || [];
        if (messages.length < 2) continue;

        const turns: UnifiedConversationTurn[] = [];
        let valid = true;

        for (const msg of messages) {
          const role = msg.role === 'user' ? 'human' : 'gpt';
          const content = normalizeText(msg.content);
          if (!content) {
            valid = false;
            break;
          }
          turns.push({ from: role, value: content });
        }

        if (!valid || turns.length < 2) continue;

        const hash = computeHash(turns[0].value + turns[1].value);
        if (seenHashes.has(hash)) {
          duplicatesFiltered++;
          continue;
        }
        seenHashes.add(hash);

        normalizedConversations.push({
          id: item.id || `st_conv_${i + 1}`,
          topic: item.topic || 'general',
          source: 'soultalk_dataset_jsonl',
          conversations: turns,
          language: 'roman_marathi'
        });

        // Add to instruction format
        for (let t = 0; t < turns.length - 1; t += 2) {
          if (turns[t].from === 'human' && turns[t + 1]?.from === 'gpt') {
            instructionSamples.push({
              id: `${item.id || 'st'}_turn_${t}`,
              system: SYSTEM_INSTRUCTION_ROMAN_MARATHI,
              instruction: "Respond with warmth, active listening, and empathy in Roman Marathi.",
              input: turns[t].value,
              output: turns[t + 1].value,
              topic: item.topic || 'general'
            });
          }
        }
      } catch (err) {
        lowQualityFiltered++;
      }
    }
  }

  // 2. Process conversations.json (single-turn array or multiple objects)
  const convPath = path.join(datasetDir, 'conversations.json');
  if (fs.existsSync(convPath)) {
    const rawConvText = fs.readFileSync(convPath, 'utf8');
    const rawConv = parseJsonObjects(rawConvText);
    console.log(`Loaded ${rawConv.length} single-turn objects from conversations.json`);

    for (let i = 0; i < rawConv.length; i++) {
      totalRawEntries++;
      const item = rawConv[i];
      if (!item || !item.user || !item.bot) continue;

      const userText = normalizeText(item.user);
      const botText = normalizeText(item.bot);

      if (!isHighQuality(userText, botText)) {
        lowQualityFiltered++;
        continue;
      }

      const hash = computeHash(userText + botText);
      if (seenHashes.has(hash)) {
        duplicatesFiltered++;
        continue;
      }
      seenHashes.add(hash);

      normalizedConversations.push({
        id: `conv_pair_${i + 1}`,
        topic: item.category || 'general',
        emotion: item.emotion || 'supportive',
        source: 'conversations_json',
        conversations: [
          { from: 'human', value: userText },
          { from: 'gpt', value: botText }
        ],
        language: 'roman_marathi'
      });

      instructionSamples.push({
        id: `alpaca_conv_${i + 1}`,
        system: SYSTEM_INSTRUCTION_ROMAN_MARATHI,
        instruction: "Listen with empathy, validate the emotion, and respond in Roman Marathi.",
        input: userText,
        output: botText,
        topic: item.category || 'general'
      });
    }
  }

  // 3. Process conversation_chains.json (multi-turn chains)
  const chainsPath = path.join(datasetDir, 'conversation_chains.json');
  if (fs.existsSync(chainsPath)) {
    try {
      const rawText = fs.readFileSync(chainsPath, 'utf8');
      const chains = parseJsonObjects(rawText);

      console.log(`Loaded ${chains.length} chains from conversation_chains.json`);
      for (let c = 0; c < chains.length; c++) {
        const chain = chains[c];
        const turns = chain.turns || [];
        if (!turns.length) continue;

        const convTurns: UnifiedConversationTurn[] = [];
        for (const turn of turns) {
          if (turn && turn.user && turn.bot) {
            convTurns.push({ from: 'human', value: normalizeText(turn.user) });
            convTurns.push({ from: 'gpt', value: normalizeText(turn.bot) });
          }
        }

        if (convTurns.length >= 2) {
          normalizedConversations.push({
            id: `chain_${chain.chain_id || c + 1}`,
            topic: chain.topic || 'loneliness',
            source: 'conversation_chains_json',
            conversations: convTurns,
            language: 'roman_marathi'
          });
        }
      }
    } catch (e) {
      console.warn('Could not parse conversation_chains.json completely:', e);
    }
  }

  // 4. Extract factual emergency & psychoeducation resources into knowledge corpus
  const emergencyPath = path.join(datasetDir, 'emergency_resources.json');
  if (fs.existsSync(emergencyPath)) {
    try {
      const res = JSON.parse(fs.readFileSync(emergencyPath, 'utf8'));
      knowledgeCorpus.push({
        type: 'EMERGENCY_RESOURCES',
        title: 'National & Local Crisis Helplines',
        data: res
      });
    } catch (e) {}
  }

  // 5. Save outputs
  const sharegptPath = path.join(outputDir, 'train_conversations_sharegpt.jsonl');
  const sharegptContent = normalizedConversations.map(c => JSON.stringify(c)).join('\n');
  fs.writeFileSync(sharegptPath, sharegptContent, 'utf8');

  const alpacaPath = path.join(outputDir, 'train_instructions_alpaca.json');
  fs.writeFileSync(alpacaPath, JSON.stringify(instructionSamples.slice(0, 3000), null, 2), 'utf8');

  const knowledgePath = path.join(outputDir, 'knowledge_grounding_corpus.json');
  fs.writeFileSync(knowledgePath, JSON.stringify(knowledgeCorpus, null, 2), 'utf8');

  console.log('\n=== Training Data Pipeline Complete ===');
  console.log(`- Total Ingested Raw Entries: ${totalRawEntries}`);
  console.log(`- Duplicates Filtered: ${duplicatesFiltered}`);
  console.log(`- Low Quality Filtered: ${lowQualityFiltered}`);
  console.log(`- Normalized Multi-Turn Conversations (ShareGPT): ${normalizedConversations.length} saved to data/train_conversations_sharegpt.jsonl`);
  console.log(`- Normalized Instruction Pairs (Alpaca): ${instructionSamples.length} (sample saved to data/train_instructions_alpaca.json)`);
  console.log(`- Verified Factual Knowledge Records: ${knowledgeCorpus.length} saved to data/knowledge_grounding_corpus.json`);
}

if (process.argv[1] && process.argv[1].includes('prepare_training_data')) {
  runDataPipeline();
}
