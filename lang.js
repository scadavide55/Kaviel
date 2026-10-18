#!/usr/bin/env node
/* lang.js — esegue un file .lang dal terminale.
   node lang.js programma.lang
   Le risposte ad `ask` arrivano da stdin, una riga per domanda.  */

const fs = require('fs');
const { run } = require('./motore.js');

const file = process.argv[2];
if (!file) {
  console.error('Uso: node lang.js programma.lang');
  process.exit(2);
}

let src;
try {
  src = fs.readFileSync(file, 'utf8');
} catch (e) {
  console.error('Non riesco a leggere ' + file);
  process.exit(2);
}

let lines = [];
let cursor = 0;
let hasStdin = false;
if (!process.stdin.isTTY) {
  lines = fs.readFileSync(0, 'utf8').split('\n');
  hasStdin = true;
}

const input = (question) => {
  process.stdout.write(question);
  if (!hasStdin) return undefined;
  const answer = cursor < lines.length ? lines[cursor++] : '';
  process.stdout.write(answer + '\n');
  return answer;
};

const result = run(src, { input });

for (const line of result.output) console.log(line);

if (result.problems.length) {
  console.error('');
  for (const p of result.problems) {
    const label = p.kind === 'error' ? 'errore' : p.kind === 'warning' ? 'avviso' : 'suggerimento';
    console.error('riga ' + p.line + ' · ' + label + ' · ' + p.message);
    if (p.hint) console.error('   ' + p.hint);
  }
  console.error('');
  console.error(result.summary);
}

process.exit(result.errors ? 1 : 0);
