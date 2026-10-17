import { insist, list } from './lib/validation.mjs';
function rgb(hex) { insist(/^#[0-9a-f]{6}$/i.test(hex), `Unsupported opaque sRGB color: ${hex}`); return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)); }
export function luminance(hex) { return rgb(hex).map(n => n / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4).reduce((s, n, i) => s + n * [.2126, .7152, .0722][i], 0); }
export function contrast(a, b) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
export function checkPairs(tokens, pairs) {
  return pairs.map((p, i) => {
    const target = p.textClass === 'large' ? 3 : 4.5;
    insist(['normal', 'large'].includes(p.textClass), 'Declare normal or large text class');
    try { const ratio = contrast(tokens[p.foreground], tokens[p.background]); return { ...p, id: p.id || String(i), ratio, target, pass: ratio >= target, status: ratio >= target ? 'pass' : 'fail' }; }
    catch { return { ...p, id: p.id || String(i), status: 'unchecked', reason: 'unknown-token-or-unsupported-color' }; }
  });
}
export function repairPalette(tokens, pairs, locked = []) {
  insist(tokens && !Array.isArray(tokens) && typeof tokens === 'object' && Object.keys(tokens).length <= 200, 'At most 200 tokens'); list(pairs, 'pairs', 500); list(locked, 'locked', 200);
  insist(locked.every(k => Object.hasOwn(tokens, k)), 'Unknown locked token');
  let working = { ...tokens }; const changes = [], initial = checkPairs(tokens, pairs);
  let evaluated = 0; const budget = 2048;
  const failures = results => results.filter(p => p.status === 'fail').length;
  for (let round = 0; round < 10; round++) {
    const before = checkPairs(working, pairs), count = failures(before); if (!count) break;
    let best;
    const ids = [...new Set(before.filter(p => p.status === 'fail').flatMap(p => [p.foreground, p.background]))].filter(id => !locked.includes(id));
    search: for (const id of ids) {
      let original; try { original = rgb(working[id]); } catch { continue; }
      for (const dest of [0, 255]) for (let step = 1; step <= 32; step++) {
        if (evaluated >= budget) break search;
        evaluated++;
        const channels = original.map(c => Math.round(c + (dest - c) * step / 32));
        const value = `#${channels.map(c => c.toString(16).padStart(2, '0')).join('')}`, candidate = { ...working, [id]: value }, results = checkPairs(candidate, pairs);
        if (before.some((p, i) => p.status === 'pass' && results[i].status !== 'pass')) continue;
        const remaining = failures(results), cost = channels.reduce((s, c, i) => s + Math.abs(c - original[i]), 0);
        if (remaining >= count) continue;
        if (!best || remaining < best.remaining || (remaining === best.remaining && cost < best.cost)) best = { id, value, remaining, cost };
      }
    }
    if (!best) break;
    changes.push({ token: best.id, before: working[best.id], after: best.value }); working[best.id] = best.value;
  }
  return { before: initial, tokens: working, changes, pairs: checkPairs(working, pairs), locked, optimal: false, search: { evaluated, budget, budgetExhausted: evaluated >= budget } };
}
export function run(x) { return repairPalette(x.tokens, x.pairs, x.locked); }
export function validate(x) { run(x); }
