import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const html = readFileSync('site/index.html', 'utf8');
assert.match(html, /id="task-form"/);
assert.match(html, /id="task-list"/);
assert.match(html, /script src="app.js"/);
assert.match(readFileSync('site/app.js','utf8'), /localStorage\.setItem/);
console.log('Estrutura básica da aplicação: OK');
