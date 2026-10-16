import assert from 'node:assert/strict';
import { contrast, checkPairs, repairPalette } from './app.mjs';
assert.equal(Number(contrast('#000000', '#ffffff').toFixed(2)), 21);
assert.equal(checkPairs({ a: '#777777', b: '#ffffff' }, [{ foreground: 'a', background: 'b' }], 4.5)[0].pass, false);
const result = repairPalette({ brand: '#6B3F8D', text: '#777777', surface: '#ffffff' }, [{ foreground: 'text', background: 'surface' }], ['brand']);
assert.equal(result.tokens.brand, '#6B3F8D');
assert.ok(result.pairs[0].pass);
console.log('colorbridge: ok');
