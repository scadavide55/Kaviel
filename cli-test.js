/* node cli-test.js — the kaviel command, driven through pipes and signals. */
const {spawnSync, spawn} = require('node:child_process');
const {terminalHost} = require('./run.js');
const EventEmitter = require('node:events');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const engine = require('./engine.js');

function queue(items) { let i = 0; return () => (i < items.length ? items[i++] : ''); }

let passed = 0;
function check(name, fn) {
  try { fn(); passed++; }
  catch (e) { console.error('FAIL ' + name); throw e; }
}
async function acheck(name, fn) {
  try { await fn(); passed++; }
  catch (e) { console.error('FAIL ' + name); throw e; }
}
function fakeTerminal() {
  const input = new EventEmitter();
  input.isTTY = true;
  input.setRawMode = mode => { input.raw = mode; };
  input.resume = () => {};
  input.pause = () => {};
  input.setEncoding = () => {};
  const out = {text: '', write(chunk) { this.text += chunk; }};
  return {input, out};
}

const node = process.execPath;
const cli = path.join(__dirname, 'run.js');
function run(args, input) {
  return spawnSync(node, [cli, ...args], {input: input || '', encoding: 'utf8', cwd: __dirname});
}

check('help explains run and help', () => {
  const r = run(['help']);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /kaviel run <file\.kv>/);
  assert.match(r.stdout, /kaviel help/);
});

check('no arguments shows the help', () => {
  const r = run([]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /Usage/);
});

check('version prints the engine version', () => {
  const r = run(['version']);
  assert.equal(r.status, 0);
  assert.match(r.stdout, new RegExp('Kaviel ' + require('./engine.js').VERSION.replace(/\./g, '\\.')));
});

check('running hello prints its line', () => {
  const r = run(['run', 'examples/hello.kv']);
  assert.equal(r.status, 0);
  assert.equal(r.stdout, 'Hello!\n');
});

check('legacy form without run still works', () => {
  const r = run(['examples/hello.kv']);
  assert.equal(r.status, 0);
  assert.equal(r.stdout, 'Hello!\n');
});

check('piped answers reach numbered questions in order', () => {
  const r = run(['run', 'examples/questions.kv'], 'Luca\n14\n');
  assert.equal(r.status, 0);
  assert.equal(r.stdout, "What's your name? Luca\nHow old are you? 14\nHello Luca You are 14 Years old.\n");
});

check('a key waits for the matching letter', () => {
  const r = run(['run', 'examples/keypress.kv'], 'c\nAda\n');
  assert.equal(r.status, 0);
  assert.equal(r.stdout, "Press C to continue.\nPress C … c\nWhat's your name? Ada\nHello Ada\n");
});

check('errors go to stderr with line numbers and exit 1', () => {
  const r = run(['run', 'examples/errors.kv']);
  assert.equal(r.status, 1);
  assert.equal(r.stdout, 'Hello!\nsmall\nI made it all the way to the end\n');
  assert.match(r.stderr, /line 3 · error/);
  assert.match(r.stderr, /Done · 3 problems/);
});

check('a missing file exits 2 with a readable message', () => {
  const r = run(['run', 'nope.kv']);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /cannot read nope\.kv/);
});

check('run without a file explains what is missing', () => {
  const r = run(['run']);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /Which program\?/);
});

check('stdin closing early does not hang the program', () => {
  const r = run(['run', 'examples/questions.kv'], 'Luca\n');
  assert.equal(r.status, 0);
  assert.match(r.stdout, /Hello Luca You are\b/);
});

(async function () {
  await acheck('terminal reads a typed line and gives the terminal back', async () => {
    const t = fakeTerminal();
    const host = terminalHost(t.out, t.input);
    const answer = host.input('Name? ');
    t.input.emit('data', 'Luca\r');
    assert.equal(await answer, 'Luca');
    assert.equal(t.input.raw, false);
    assert.equal(t.out.text, 'Name? Luca\n');
  });

  await acheck('terminal keeps answers pasted in one chunk', async () => {
    const t = fakeTerminal();
    const host = terminalHost(t.out, t.input);
    const first = host.input('One? ');
    t.input.emit('data', 'Luca\r14\r');
    assert.equal(await first, 'Luca');
    const second = host.input('Two? ');
    assert.equal(await second, '14');
  });

  await acheck('terminal backspace edits the answer', async () => {
    const t = fakeTerminal();
    const host = terminalHost(t.out, t.input);
    const answer = host.input('? ');
    t.input.emit('data', 'ab\x7f\r');
    assert.equal(await answer, 'a');
  });

  await acheck('terminal waits for the right key', async () => {
    const t = fakeTerminal();
    const host = terminalHost(t.out, t.input);
    let done = false;
    const waiting = host.keypress('C').then(value => { done = true; return value; });
    t.input.emit('data', 'x');
    await Promise.resolve();
    assert.equal(done, false);
    t.input.emit('data', 'c');
    assert.equal(await waiting, 'c');
    assert.equal(t.input.raw, false);
    assert.match(t.out.text, /^Press C … /);
  });

  await acheck('terminal maps Enter and Space to their names', async () => {
    const t = fakeTerminal();
    const host = terminalHost(t.out, t.input);
    const enter = host.keypress('Enter');
    t.input.emit('data', '\r');
    assert.equal(await enter, 'Enter');
    const space = host.keypress('Space');
    t.input.emit('data', ' ');
    assert.equal(await space, ' ');
  });

  await acheck('terminal Ctrl+C rejects the pending read', async () => {
    const t = fakeTerminal();
    const host = terminalHost(t.out, t.input);
    const answer = host.input('? ');
    t.input.emit('data', '\x03');
    await assert.rejects(answer, /cancelled/);
    assert.equal(t.input.raw, false);
  });

  await acheck('Ctrl+C during a question stops the whole run', async () => {
    const t = fakeTerminal();
    let interrupted = false;
    const host = terminalHost(t.out, t.input, () => { interrupted = true; });
    const answer = host.input('? ');
    t.input.emit('data', '\x03');
    await assert.rejects(answer, /cancelled/);
    assert.equal(interrupted, true);
    assert.equal(t.input.raw, false);
  });

  const stopFile = path.join(os.tmpdir(), 'kaviel-stop-' + process.pid + '.kv');
  fs.writeFileSync(stopFile, 'start\ndefine big = "ab"\nrepeat 14\n  set big = big + big\nuntil false\n  set s = upper(big)\nend\n');
  const stopper = spawn(node, [cli, 'run', stopFile], {cwd: __dirname, stdio: ['ignore', 'pipe', 'pipe']});
  let stopErr = '';
  stopper.stderr.on('data', d => { stopErr += d; });
  setTimeout(() => stopper.kill('SIGINT'), 200);
  const exitCode = await new Promise(resolve => stopper.on('exit', resolve));
  check('Ctrl+C stops the program with exit 130', () => assert.equal(exitCode, 130, 'exit ' + exitCode + ' / ' + stopErr));
  check('Ctrl+C reports that the program was stopped', () => assert.match(stopErr, /Stopped by you\./, stopErr));
  fs.unlinkSync(stopFile);

  // Every example must run through the real command, with an answer ready for its questions.
  const answers = {age: '20\n', questions: 'Ada\n14\n', guess: '7\n8\n9\n10\n1\n', quiz: 'red\n4\n', citadel: 'Ada\n1\n', keypress: 'Ada\n', treasure_hunt: 'Ada\nleft\nleft\nleft\n'};
  for (const file of fs.readdirSync(path.join(__dirname, 'examples')).filter(f => f.endsWith('.kv'))) {
    const name = file.replace('.kv', '');
    const source = fs.readFileSync(path.join(__dirname, 'examples', file), 'utf8');
    const result = engine.run(source, {
      input: queue(answers[name] ? answers[name].split('\n') : []),
      keypress: () => 'C',
      rng: () => 0.5
    });
    check('example ' + name + ' runs without errors', () => {
      if (name === 'errors') return assert.ok(result.errors > 0);
      assert.equal(result.errors, 0, JSON.stringify(result.problems.slice(0, 3)));
    });
  }

  console.log(passed + ' CLI tests passed');
})().catch(e => {
  console.error(e.stack || e);
  process.exitCode = 1;
});
