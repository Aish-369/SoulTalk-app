import fs from 'fs';
import path from 'path';

export interface Exemplar {
  id: string;
  topic: string;
  emotion?: string;
  user_text: string;
  bot_reply: string;
  language: 'roman_marathi' | 'english' | 'mixed';
}

export interface KnowledgeSnippet {
  id: string;
  topic: string;
  title: string;
  technique: string;
  content: string;
  steps?: string[];
}

export interface RagResult {
  exemplars: Exemplar[];
  knowledge: KnowledgeSnippet[];
  detectedTopic: string;
  detectedEmotion: string;
  isMarathi: boolean;
}

// Built-in non-diagnostic psychoeducation & emotional coping knowledge base
export const KNOWLEDGE_BASE: KnowledgeSnippet[] = [
  {
    id: 'kb_grounding_54321',
    topic: 'anxiety',
    title: '5-4-3-2-1 Sensory Grounding Technique',
    technique: 'Sensory grounding to detach from panic and reconnect to the immediate physical room.',
    content: 'Acknowledge 5 things you can see, 4 things you can physically touch, 3 sounds you can hear, 2 scents you can smell, and 1 taste. It gently halts the amygdala hijack.',
    steps: ['Name 5 visual objects', 'Feel 4 textures nearby', 'Listen for 3 distinct noises', 'Notice 2 ambient smells', 'Taste 1 sensation on your tongue']
  },
  {
    id: 'kb_box_breathing',
    topic: 'stress',
    title: '4-4-4-4 Box Breathing & Vagal Reset',
    technique: 'Diaphragmatic breathing to activate the parasympathetic nervous system.',
    content: 'Inhale through the nose for 4 counts, hold gently for 4 counts, exhale smoothly through the mouth for 4 counts, and hold the empty lung for 4 counts.',
    steps: ['Inhale 4s', 'Hold 4s', 'Exhale 4s', 'Hold 4s']
  },
  {
    id: 'kb_academic_burnout',
    topic: 'academic',
    title: 'Academic Overwhelm & Cognitive Chunking',
    technique: 'Break paralyzing syllabi into micro-commitments (Pomodoro / single-tasking).',
    content: 'Overwhelm happens when the brain treats the entire future workload as a simultaneous emergency. Narrowing focus to just the next 15 minutes restores executive control.',
    steps: ['Select 1 micro-task', 'Set a 15-minute timer', 'Permit all other subjects to wait', 'Celebrate completion of 1 step']
  },
  {
    id: 'kb_loneliness_validation',
    topic: 'loneliness',
    title: 'Validating Emotional Isolation',
    technique: 'Self-compassion without harsh self-blame during isolation.',
    content: 'Feeling lonely is not a defect or personal failure; it is an instinct signaling the human need for safe connection. Be as tender to yourself as you would to a wounded friend.',
    steps: ['Acknowledge the ache without shame', 'Engage in a warming physical ritual (tea, blanket)', 'Reach out with low-pressure check-in when ready']
  },
  {
    id: 'kb_sleep_anxiety',
    topic: 'sleep',
    title: 'Sleep Hygiene & Bedtime Worry Dumping',
    technique: 'Brain-dumping repetitive intrusive thoughts to clear cognitive load before bed.',
    content: 'Writing worry loops onto a notepad transfers them out of working memory, telling the subconscious that they are safely cataloged until tomorrow morning.',
    steps: ['Write thoughts on paper', 'Close the notebook', 'Dim blue-light devices', 'Take 5 gentle deep belly breaths']
  },
  {
    id: 'kb_relationship_grief',
    topic: 'relationships',
    title: 'Emotional Processing of Heartbreak & Distance',
    technique: 'Allowing grief waves without demanding immediate recovery.',
    content: 'Healing is non-linear. The pain of separation reflects the depth of care that existed. Give yourself permission to mourn at your own natural pace.',
    steps: ['Validate the sorrow', 'Avoid forcing instant optimism', 'Stay grounded in daily self-care basics']
  }
];

function parseJsonObjects(rawText: string): any[] {
  const cleaned = rawText.trim();
  if (!cleaned) return [];
  if (cleaned.startsWith('[')) {
    try {
      return JSON.parse(cleaned);
    } catch (e) {
      // continue to chunk parsing
    }
  }

  // Attempt wrapped commas
  try {
    const wrapped = '[' + cleaned.replace(/\}\s*\{/g, '},{') + ']';
    return JSON.parse(wrapped);
  } catch (e) {
    // continue to scanner
  }

  // Bracket-counting scanner fallback
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
      if (char === '{') {
        if (depth === 0) {
          startIndex = i;
        }
        depth++;
      } else if (char === '}') {
        depth--;
        if (depth === 0 && startIndex !== -1) {
          const objStr = cleaned.slice(startIndex, i + 1);
          try {
            results.push(JSON.parse(objStr));
          } catch (err) {
            // ignore bad chunk
          }
          startIndex = -1;
        }
      }
    }
  }
  return results;
}

class RagEngine {
  private exemplars: Exemplar[] = [];
  private isLoaded = false;
  private termIndex: Map<string, number[]> = new Map();

  constructor() {
    this.loadDatasets();
  }

  private tokenize(text: string): string[] {
    const stopwords = new Set([
      'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'for',
      'of', 'or', 'by', 'with', 'from', 'this', 'that', 'it', 'are', 'was',
      'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'but', 'if', 'so', 'me', 'my', 'myself', 'we', 'our', 'you', 'your',
      'he', 'him', 'she', 'her', 'they', 'them', 'what', 'who', 'how', 'when',
      'where', 'why', 'can', 'could', 'will', 'would', 'should', 'all', 'any',
      'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
      'nor', 'not', 'only', 'own', 'same', 'than', 'too', 'very', 'just',
      // roman marathi high frequency grammatical particles
      'pan', 'mag', 'ani', 'tar', 'ata', 'te', 'tya', 'ha', 'hi', 'he', 'to',
      'ti', 'jo', 'ji', 'je', 'kahi', 'sagla', 'sagale', 'karan'
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 2 && !stopwords.has(w));
  }

  private detectLanguage(text: string): boolean {
    const marathiKeywords = [
      'ahe', 'aahe', 'mala', 'tula', 'majha', 'tujha', 'kasa', 'kay', 'zala',
      'vatat', 'vatatay', 'bhandan', 'hotay', 'ghari', 'abhyas', 'mitra',
      'sobat', 'aaji', 'shikvte', 'karto', 'kartes', 'karu', 'pan', 'mag',
      'divas', 'khup', 'changla', 'vait', 'bhiti', 'gela', 'sagle', 'nahi',
      'ata', 'sadhyas', 'kadhich', 'rahila', 'jast', 'kami', 'bol', 'aik'
    ];
    const tokens = this.tokenize(text);
    const count = tokens.filter(t => marathiKeywords.includes(t)).length;
    return count >= 1;
  }

  public loadDatasets() {
    if (this.isLoaded) return;
    const baseDir = process.cwd();
    const datasetDir = path.join(baseDir, 'backend', 'dataset');

    try {
      // 1. Load soultalk_dataset.json (Wolfie Roman Marathi dataset)
      const stPath = path.join(datasetDir, 'soultalk_dataset.json');
      if (fs.existsSync(stPath)) {
        const raw = fs.readFileSync(stPath, 'utf8');
        const lines = raw.split('\n').filter(l => l.trim().length > 0);
        for (const line of lines) {
          try {
            const item = JSON.parse(line);
            const messages = item.messages || [];
            for (let i = 0; i < messages.length - 1; i += 2) {
              const uMsg = messages[i]?.content;
              const bMsg = messages[i + 1]?.content;
              if (uMsg && bMsg) {
                this.exemplars.push({
                  id: `${item.id}_${i}`,
                  topic: item.topic || 'General',
                  user_text: uMsg,
                  bot_reply: bMsg,
                  language: 'roman_marathi'
                });
              }
            }
          } catch (e) {
            // ignore malformed line
          }
        }
      }

      // 2. Load conversations.json (Categorized dialogue pairs)
      const convPath = path.join(datasetDir, 'conversations.json');
      if (fs.existsSync(convPath)) {
        const raw = fs.readFileSync(convPath, 'utf8');
        try {
          // Robust parsing handling concatenated JSON arrays or objects
          const list = parseJsonObjects(raw);
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            // If item itself is an array of conversation pairs
            if (Array.isArray(item)) {
              for (let k = 0; k < item.length; k++) {
                const subItem = item[k];
                if (subItem && subItem.user && subItem.bot) {
                  this.exemplars.push({
                    id: `conv_${i}_${k}`,
                    topic: subItem.category || 'General',
                    emotion: subItem.emotion,
                    user_text: subItem.user,
                    bot_reply: subItem.bot,
                    language: this.detectLanguage(subItem.user) ? 'roman_marathi' : 'english'
                  });
                }
              }
            } else if (item && item.user && item.bot) {
              this.exemplars.push({
                id: `conv_${i}`,
                topic: item.category || 'General',
                emotion: item.emotion,
                user_text: item.user,
                bot_reply: item.bot,
                language: this.detectLanguage(item.user) ? 'roman_marathi' : 'english'
              });
            }
          }
        } catch (e) {
          console.warn('[RAG Engine] Notice reading conversations.json:', e);
        }
      }

      // 3. Load conversation_chains.json
      const chainsPath = path.join(datasetDir, 'conversation_chains.json');
      if (fs.existsSync(chainsPath)) {
        const raw = fs.readFileSync(chainsPath, 'utf8');
        try {
          const chains = parseJsonObjects(raw);
          for (const ch of chains) {
            const turns = ch.turns || [];
            for (let j = 0; j < turns.length; j++) {
              const turn = turns[j];
              if (turn.user && turn.bot) {
                this.exemplars.push({
                  id: `chain_${ch.chain_id || 1}_${j}`,
                  topic: ch.topic || 'loneliness',
                  user_text: turn.user,
                  bot_reply: turn.bot,
                  language: 'roman_marathi'
                });
              }
            }
          }
        } catch (e) {
          console.warn('[RAG Engine] Notice reading conversation_chains.json:', e);
        }
      }

      // Build inverted index for fast keyword/TF-IDF lookup
      for (let i = 0; i < this.exemplars.length; i++) {
        const ex = this.exemplars[i];
        const tokens = this.tokenize(`${ex.user_text} ${ex.topic} ${ex.emotion || ''}`);
        const uniqueTokens = new Set(tokens);
        uniqueTokens.forEach(tok => {
          if (!this.termIndex.has(tok)) {
            this.termIndex.set(tok, []);
          }
          this.termIndex.get(tok)!.push(i);
        });
      }

      this.isLoaded = true;
      console.log(`[RAG Engine] Successfully loaded and indexed ${this.exemplars.length} dialogue exemplars.`);
    } catch (err) {
      console.error('[RAG Engine] Error loading datasets:', err);
    }
  }

  public retrieve(query: string, emotion?: string, topK: number = 3): RagResult {
    this.loadDatasets();
    const queryTokens = this.tokenize(query);
    const isMarathi = this.detectLanguage(query);

    // Score all candidate exemplars using BM25-style frequency scoring
    const scores = new Map<number, number>();

    queryTokens.forEach(tok => {
      const matchIndices = this.termIndex.get(tok);
      if (matchIndices) {
        // IDF weighting: rarer tokens get higher weight
        const idf = Math.log(1 + (this.exemplars.length / matchIndices.length));
        matchIndices.forEach(idx => {
          scores.set(idx, (scores.get(idx) || 0) + idf);
        });
      }
    });

    // Language and emotion alignment boost
    for (const [idx, score] of scores.entries()) {
      const ex = this.exemplars[idx];
      let finalScore = score;
      if (isMarathi && ex.language === 'roman_marathi') {
        finalScore *= 1.35;
      }
      if (emotion && ex.emotion && ex.emotion.toLowerCase() === emotion.toLowerCase()) {
        finalScore *= 1.25;
      }
      scores.set(idx, finalScore);
    }

    // Sort by descending score
    const sortedIndices = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK)
      .map(entry => entry[0]);

    let matchedExemplars: Exemplar[] = sortedIndices.map(idx => this.exemplars[idx]);

    // Fallback if no specific keyword match
    if (matchedExemplars.length === 0 && this.exemplars.length > 0) {
      matchedExemplars = this.exemplars.slice(0, topK);
    }

    // Determine matched topic
    const detectedTopic = matchedExemplars[0]?.topic || 'Daily Life';

    // Retrieve corresponding psychoeducation knowledge snippet
    const qLower = query.toLowerCase();
    let matchedKnowledge = KNOWLEDGE_BASE.filter(k => {
      if (qLower.includes('anxi') || qLower.includes('panic') || qLower.includes('bhiti') || qLower.includes('ghabar')) {
        return k.topic === 'anxiety';
      }
      if (qLower.includes('stress') || qLower.includes('overwhelm') || qLower.includes('tension')) {
        return k.topic === 'stress';
      }
      if (qLower.includes('lonely') || qLower.includes('alone') || qLower.includes('ekta')) {
        return k.topic === 'loneliness';
      }
      if (qLower.includes('exam') || qLower.includes('abhyas') || qLower.includes('college') || qLower.includes('work')) {
        return k.topic === 'academic';
      }
      if (qLower.includes('sleep') || qLower.includes('zop') || qLower.includes('tired')) {
        return k.topic === 'sleep';
      }
      if (qLower.includes('breakup') || qLower.includes('friend') || qLower.includes('bhandan') || qLower.includes('relationship')) {
        return k.topic === 'relationships';
      }
      return false;
    });

    if (matchedKnowledge.length === 0) {
      matchedKnowledge = [KNOWLEDGE_BASE[0], KNOWLEDGE_BASE[1]];
    }

    return {
      exemplars: matchedExemplars,
      knowledge: matchedKnowledge,
      detectedTopic,
      detectedEmotion: emotion || 'supportive',
      isMarathi
    };
  }

  public getStats() {
    this.loadDatasets();
    return {
      totalExemplars: this.exemplars.length,
      totalKnowledgeNotes: KNOWLEDGE_BASE.length,
      indexedVocabulary: this.termIndex.size,
      status: 'operational'
    };
  }
}

export const ragEngine = new RagEngine();
