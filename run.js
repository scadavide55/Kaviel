#!/usr/bin/env node
/* run.js — runs a .kaviel file from the terminal.
   node run.js hello.kaviel
   Answers to `ask` come from stdin, one line per question.   */

const fs = require('fs');
const { run } = require('./engine.js');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node run.js program.kaviel');
  process.exit(2);
}

let src;
try {
  src = fs.readFileSync(file, 'utf8');
} catch (e) {
  console.error('I cannot read ' + file);
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
    const label = p.kind === 'error' ? 'error' : p.kind === 'warning' ? 'warning' : 'hint';
    console.error('line ' + p.line + ' · ' + label + ' · ' + p.message);
    if (p.hint) console.error('   ' + p.hint);
  }
  console.error('');
  console.error(result.summary);
}

process.exit(result.errors ? 1 : 0);
