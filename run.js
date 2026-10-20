#!/usr/bin/env node
/* Kaviel CLI.
   kaviel run program.kv
   kaviel help
   node run.js program.kv   (same as run, for older habits)  */

'use strict';

const path = require('path');
const {readFile} = require('fs/promises');
const {runAsync, VERSION} = require('./engine.js');

const HELP = `Kaviel ${VERSION} — a small language that reads like you think.

Usage
  kaviel run <file.kv>   Run a program
  kaviel help            Show this help
  kaviel version         Show the version

While a program runs
  Answers to a question are typed and confirmed with Enter.
  keypress waits for the exact key the program expects.
  Ctrl+C stops the program and keeps your terminal usable.

Exit codes
  0  the program finished, with or without warnings
  1  the program reported at least one error
  2  the file could not be read or the command is incomplete
  130 stopped with Ctrl+C
`;

function fail(message) {
  process.stderr.write(message + '\n');
  process.exitCode = 2;
}

function parseArgs(argv) {
  const first = argv[0];
  if (!first) return {command: 'help'};
  if (first === 'help' || first === '-h' || first === '--help') return {command: 'help'};
  if (first === 'version' || '-v' === first || '--version' === first) return {command: 'version'};
  if (first === 'run') return {command: 'run', file: argv[1]};
  return {command: 'run', file: first};
}

/* A terminal keeps raw mode only while it waits, and gives it back on every
   path out: answer, key, Ctrl+C or an exception. Characters that arrive early
   stay in `pending`, so pasted lines and fast typists lose nothing. */
const ARROWS = {'\x1b[A': 'ArrowUp', '\x1b[B': 'ArrowDown', '\x1b[C': 'ArrowRight', '\x1b[D': 'ArrowLeft'};

function printKey(key) {
  return key === ' ' ? 'Space' : key;
}

function sameKey(received, expected) {
  if (expected === 'Space') expected = ' ';
  return expected.length === 1 ? received.toLowerCase() === expected.toLowerCase() : received === expected;
}

function terminalHost(stdout, stdin, onInterrupt) {
  let waiter = null, pending = '', line = '';

  function begin(kind, resolve, reject, expected) {
    waiter = {kind, resolve, reject, expected};
    line = '';
    stdin.setRawMode(true);
    stdin.resume();
    drain();
  }

  function end() {
    waiter = null;
    line = '';
    if (stdin.isTTY && stdin.setRawMode) stdin.setRawMode(false);
    stdin.pause();
  }

  function finish(value) {
    const current = waiter;
    end();
    if (current) current.resolve(value);
  }

  function failWith(reason) {
    const current = waiter;
    end();
    if (current) current.reject(new Error(reason));
  }

  function drain() {
    while (waiter && pending.length) {
      if (waiter.kind === 'line') {
        const ch = Array.from(pending)[0];
        pending = pending.slice(ch.length);
        if (ch === '\r' || ch === '\n') {
          if (ch === '\r' && pending[0] === '\n') pending = pending.slice(1);
          stdout.write('\n');
          finish(line);
          continue;
        }
        if (ch === '\x7f' || ch === '\b') {
          if (line.length) { line = Array.from(line).slice(0, -1).join(''); stdout.write('\b \b'); }
          continue;
        }
        if (ch === '\x04') { stdout.write('\n'); finish(line); continue; }
        if (ch === '\x03') { stdout.write('\n'); failWith('cancelled'); if (onInterrupt) onInterrupt(); continue; }
        if (ch === '\x1b' || ch < ' ') continue;
        line += ch;
        stdout.write(ch);
        continue;
      }

      let name;
      if (pending === '\x1b' && waiter.expected === 'Escape') {
        pending = '';
        name = 'Escape';
      } else if (pending.startsWith('\x1b[')) {
        if (pending.length < 3) return;
        const sequence = pending.slice(0, 3);
        pending = pending.slice(3);
        name = ARROWS[sequence] || '';
        if (!name) continue;
      } else {
        const ch = Array.from(pending)[0];
        pending = pending.slice(ch.length);
        if (ch === '\x03') { stdout.write('\n'); failWith('cancelled'); if (onInterrupt) onInterrupt(); return; }
        name = ch === '\r' || ch === '\n' ? 'Enter' : ch;
      }
      if (sameKey(name, waiter.expected)) {
        stdout.write('\n');
        finish(name);
      } else if (name.length === 1 && name >= ' ') {
        stdout.write('\b \b');
      }
    }
  }

  stdin.setEncoding('utf8');
  const onData = chunk => { pending += chunk; drain(); };
  // A program that never reads input would otherwise die at once: Node ends
  // the process when an empty stdin closes.
  stdin.on('end', () => { while (waiter) failWith('the terminal closed'); });
  stdin.on('error', () => { while (waiter) failWith('the terminal closed'); });
  stdin.on('data', onData);
  // Keep the terminal open for the whole run, so it belongs to the program
  // and not to Node's read loop.
  stdin.resume();

  return {
    input(question) {
      stdout.write(question || 'Answer: ');
      return new Promise((resolve, reject) => begin('line', resolve, reject));
    },
    keypress(expected) {
      stdout.write('Press ' + printKey(expected) + ' … ');
      return new Promise((resolve, reject) => begin('key', resolve, reject, expected));
    },
    stop(reason) {
      stdin.removeListener('data', onData);
      failWith(reason || 'cancelled');
    }
  };
}

/* Piped input: one line per answer, streamed with readline so output still
   appears while the pipe is open. A key comes as the first letter of a line. */
function pipeHost(stdin, stdout) {
  const readline = require('readline');
  const reader = readline.createInterface({input: stdin, crlfDelay: Infinity});
  const lines = reader[Symbol.asyncIterator]();
  let closed = false;
  async function next() {
    const {value, done} = await lines.next();
    if (done) { closed = true; return null; }
    return value;
  }
  return {
    async input(question) {
      stdout.write(question || 'Answer: ');
      const line = await next();
      if (line === null) return '';
      stdout.write(line + '\n');
      return line;
    },
    async keypress(expected) {
      stdout.write('Press ' + printKey(expected) + ' … ');
      while (!closed) {
        const line = await next();
        if (line === null) return undefined;
        const key = line.length ? line.trim().slice(0, 1) : 'Enter';
        stdout.write(key === 'Enter' ? 'Enter\n' : key + '\n');
        const wanted = expected === 'Space' ? ' ' : expected;
        if (wanted.length === 1 ? key.toLowerCase() === wanted.toLowerCase() : key === wanted) return key;
      }
      return undefined;
    },
    // Stop listening: a program that never asked must not keep the command waiting on an open pipe.
    stop() { closed = true; reader.close(); stdin.pause(); }
  };
}

function printProblems(result) {
  if (!result.problems.length) return;
  const error = process.stderr;
  error.write('\n');
  for (const p of result.problems) {
    const label = p.kind === 'error' ? 'error' : p.kind === 'warning' ? 'warning' : 'hint';
    error.write('line ' + p.line + ' · ' + label + ' · ' + p.message + (p.count > 1 ? ' (×' + p.count + ')' : '') + '\n');
    if (p.hint) error.write('   ' + p.hint + '\n');
  }
  error.write('\n' + result.summary + '\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.command === 'help') { process.stdout.write(HELP); return 0; }
  if (args.command === 'version') { process.stdout.write('Kaviel ' + VERSION + '\n'); return 0; }
  if (!args.file) { fail('Which program? Write it after run: kaviel run hello.kv'); return 2; }

  let source;
  try { source = await readFile(args.file, 'utf8'); }
  catch (e) {
    fail('I cannot read ' + args.file + '. Check the name and that the file exists.');
    return 2;
  }
  if (!/\.kv$/i.test(args.file)) {
    process.stderr.write('A Kaviel program is a .kv file; running ' + path.basename(args.file) + ' anyway.\n');
  }

  const controller = new AbortController();
  const interactive = Boolean(process.stdin.isTTY);
  const host = interactive ? terminalHost(process.stdout, process.stdin, () => controller.abort()) : pipeHost(process.stdin, process.stdout);

  const onSignal = () => {
    controller.abort();
    host.stop('cancelled');
  };
  process.on('SIGINT', onSignal);

  let result;
  try {
    result = await runAsync(source, {
      signal: controller.signal,
      onOutput: (text) => process.stdout.write(text + '\n'),
      input: (question) => host.input(question),
      keypress: (key) => host.keypress(key)
    });
  } catch (e) {
    process.removeListener('SIGINT', onSignal);
    fail('The program stopped because of an internal error. Your file is unchanged.');
    return 1;
  }
  process.removeListener('SIGINT', onSignal);
  host.stop('finished');

  printProblems(result);
  if (result.cancelled) {
    if (!result.problems.length) process.stderr.write('Stopped by you.\n');
    return 130;
  }
  return result.errors ? 1 : 0;
}

if (require.main === module) {
  main().then(code => { process.exitCode = code; }).catch(() => {
    fail('Unexpected failure in the Kaviel command.');
    process.exitCode = 1;
  });
}

module.exports = {terminalHost, pipeHost, printKey, sameKey};
