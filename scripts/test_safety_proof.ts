import { checkCrisis, CrisisLevel } from '../server/safetyEngine';

const CRISIS_TESTS = [
  "I want to die.",
  "I have a plan to die.",
  "I want to hurt myself.",
  "I don't want to live anymore.",
  "I want to sleep forever."
];

console.log('===========================================================');
console.log(' CRISIS DETECTION ENGINE DIRECT VERIFICATION');
console.log('===========================================================');

for (const phrase of CRISIS_TESTS) {
  const start = performance.now();
  const res = checkCrisis(phrase);
  const latency = (performance.now() - start).toFixed(3);

  console.log(`\nInput: "${phrase}"`);
  console.log(` - isCrisis: ${res.isCrisis}`);
  console.log(` - level: ${res.level}`);
  console.log(` - confidence: ${res.confidence}`);
  console.log(` - latencyMs: ${latency} ms (Immediate/Zero-Latency)`);
  console.log(` - deterministic response provided: ${Boolean(res.response)}`);
  console.log(` - teleManas included: ${res.response?.includes('14416')}`);
  console.log(` - kiran included: ${res.response?.includes('1800-599-0019')}`);
  console.log(` - Response excerpt:\n   "${res.response?.slice(0, 150)}..."`);
}
