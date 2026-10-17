import test from 'node:test'; import assert from 'node:assert/strict'; import { contrast, checkPairs, repairPalette } from './core.mjs';
test('reference contrast vectors', () => { assert.equal(contrast('#000000', '#ffffff'), 21); assert.equal(contrast('#777777', '#777777'), 1); assert.ok(contrast('#777777', '#ffffff') < 4.5); });
test('large text and ordinary text use different thresholds without rounding', () => {
  const pairs = checkPairs({ text: '#777777', bg: '#ffffff' }, [{ foreground: 'text', background: 'bg', textClass: 'normal' }, { foreground: 'text', background: 'bg', textClass: 'large' }]); assert.equal(pairs[0].pass, false); assert.equal(pairs[1].pass, true);
});
test('locks preserve brand; token patch revalidates all uses', () => {
  const pairs = [{ foreground: 'text', background: 'bg', textClass: 'normal' }, { foreground: 'brand', background: 'bg', textClass: 'normal' }];
  const r = repairPalette({ brand: '#000000', text: '#777777', bg: '#ffffff' }, pairs, ['brand']); assert.equal(r.tokens.brand, '#000000'); assert.ok(r.pairs.every(p => p.pass)); assert.deepEqual(checkPairs(r.tokens, pairs), r.pairs);
});
test('unknown and transparent colors are unchecked; impossible locks remain failures', () => {
  assert.equal(checkPairs({ a: '#00000000' }, [{ foreground: 'a', background: 'unknown', textClass: 'normal' }])[0].status, 'unchecked');
  const r = repairPalette({ a: '#777777', b: '#ffffff' }, [{ foreground: 'a', background: 'b', textClass: 'normal' }], ['a', 'b']); assert.equal(r.pairs[0].pass, false); assert.equal(r.changes.length, 0);
});
