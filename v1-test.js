/* node v1-test.js — v1 features, asynchronous hosts and bounded execution. */
const assert = require('node:assert/strict');
const {run, runAsync} = require('./engine.js');
let passed = 0;
function check(name, source, expected = {}) {
  const inputs = (expected.input || []).slice(), keys = (expected.keys || []).slice();
  const result = run(source, {input: () => inputs.shift(), keypress: () => keys.shift(), limit: expected.limit, rng: () => 0});
  try {
    if (expected.output) assert.deepEqual(result.output, expected.output);
    assert.equal(result.errors, expected.errors || 0);
    if (expected.warnings !== undefined) assert.equal(result.warnings, expected.warnings);
    if (expected.contains) assert(result.problems.some(p => (p.message + p.hint).includes(expected.contains)));
    if (expected.stopped !== undefined) assert.equal(result.stopped, expected.stopped);
    passed++;
  } catch (e) { console.error('FAIL ' + name, result); throw e; }
}
const program = body => 'start\n' + body + '\nend';
for (const [age, label] of [['17', 'young'], ['18', 'exactly'], ['19', 'adult']]) {
  check('threshold ' + age, program('define ask{1} = ("Age?")\nask{1}\nif answer{1} = under 18 = print ("young")\nif answer{1} = "18" = print ("exactly")\nif answer{1} = over 18 = print ("adult")'), {input: [age], output: [label]});
}
check('thresholds read numbers out of padded text', program('define ask{1} = ("Age?")\nask{1}\nif answer{1} = under 19 = print "young"\nif answer{1} = over 17 = print "adult"'), {input: [' 18 '], output: ['young', 'adult']});
for (const input of ['hello', '', '0x12', 'Infinity']) check('invalid numeric input ' + input,
  program('define ask{1} = ("Age?")\nask{1}\nif answer{1} = over 18 = print "wrong"\nprint "alive"'), {input: [input], output: ['alive'], errors: 1, contains: 'not a number'});
for (const [written, says] of [['18', 'yes'], [' 18 ', 'yes'], ['18.0', 'yes'], ['17', 'no'], ['19', 'no']]) {
  check('is reads a number from the answer: ' + written, program('define ask{1} = ("Age?")\nask{1}\nif answer{1} = is 18 = print "yes"'), {input: [written], output: says === 'yes' ? ['yes'] : []});
}
check('is works on plain numbers and on text', program('print 18 = is 18\nprint "18" = is 18\nprint "18" = 18'), {output: ['true', 'true', 'true'], errors: 0, warnings: 0});
check('equals reads a number out of text', program('print 5 = "5"\nprint " 7 " = 7\nprint "7.0" = 7\nprint "rock" = 1'), {output: ['true', 'true', 'true', 'false'], errors: 0, warnings: 1});
check('is refuses text that is not a number', program('print "ciao" = is 18\nprint "alive"'), {output: ['alive'], errors: 1, contains: 'not a number'});
check('inline equality', program('define x = 2\nif x = 2 = print "yes"\nif x = 3 = print "no"'), {output: ['yes']});
check('inline set and numbered question', program('define ask{1} = ("Name?")\ndefine x = 0\nif true = set x = 2\nif x = 2 = ask{1}\nprint answer{1} x'), {input: ['Ada'], output: ['Ada 2']});
check('legacy comparison to ask call', program('if "yes" = ask("?")\n  print "same"'), {input: ['yes'], output: ['same']});
check('boolean precedence', program('if not false and false or true = print "yes"\nif false and missing = print "no"\nif true or missing = print "ok"'), {output: ['yes', 'ok']});
check('function parameters and return', program('define add(a, b)\n  return a + b\nprint add(2, 3)'), {output: ['5']});
check('return through loops and inline if', program('define first()\n  repeat 3\n    if true = return 7\n  return 9\nprint first()'), {output: ['7']});
check('locals do not leak', program('define n = 10\ndefine local(n)\n  set n = n + 1\n  define secret = 7\n  return n\nprint local(1) n\nprint secret\nprint "alive"'), {output: ['2 10', 'alive'], errors: 1});
check('functions use globals, not caller locals', program('define x = 5\ndefine read()\n  return x\ndefine caller(x)\n  return read()\nprint caller(99)'), {output: ['5']});
check('set existing global in function', program('define n = 0\ndefine inc()\n  set n = n + 1\ninc()\nprint n'), {output: ['1']});
check('recursive factorial', program('define factorial(n)\n  if n = 0 = return 1\n  return n * factorial(n - 1)\nprint factorial(5)'), {output: ['120']});
check('function without return', program('define say()\n  print "hi"\nprint say()'), {output: ['hi', '']});
check('unknown function', program('unknown()\nprint "alive"'), {output: ['alive'], errors: 1, contains: 'function'});
check('wrong arity does not evaluate side effects', program('define f()\n  return 1\nprint f(ask("no"))\nprint "alive"'), {output: ['alive'], errors: 1, contains: 'arguments'});
check('duplicate parameter', program('define bad(x, x)\n  print "no"\nprint "alive"'), {output: ['alive'], errors: 1, contains: 'different name'});
check('return outside function', program('return 3\nprint "alive"'), {output: ['alive'], errors: 1});
check('break outside loop', program('break\nprint "alive"'), {output: ['alive'], errors: 1});
check('break nearest loop', program('repeat 2\n  repeat 3\n    print "inner"\n    break\n  print "outer"'), {output: ['inner', 'outer', 'inner', 'outer']});
check('break until', program('until false\n  print "once"\n  break'), {output: ['once']});
check('function cannot break callers loop', program('repeat 1\n  define bad()\n    break\n  print "alive"'), {output: ['alive'], errors: 1});
check('nested function rejected', program('define outer()\n  define inner()\n    print "no"\nprint "alive"'), {output: ['alive'], errors: 1});
check('recursive depth limit is an error, not a JS traceback', program('define forever()\n  return forever()\nprint forever()\nprint "alive"'), {output: ['alive'], errors: 1, contains: 'call limit'});
check('list creation indexing and size', program('define items = [1, "two", [3]]\nprint items[1] items[3][1] length(items)\nprint []'), {output: ['1 3 3', '[]']});
check('list mutation', program('define items = [[1], 2]\nset items[1][1] = 9\nappend(items, 3)\nprint items'), {output: ['[[9], 2, 3]']});
check('list references in functions', program('define addItem(items, n)\n  append(items, n)\ndefine items = []\naddItem(items, 7)\nprint items'), {output: ['[7]']});
check('list equality by values', program('if [1, [2]] = [1, [2]] = print "same"'), {output: ['same']});
check('pick from a list', program('define items = [7, 9]\ndefine selected = pick items\nprint selected'), {output: ['7']});
check('empty pick', program('print pick []\nprint "alive"'), {output: ['alive'], errors: 1});
for (const index of ['0', '-1', '1.5', '3', '"1"']) check('bad index ' + index, program('define xs = [1, 2]\nprint xs[' + index + ']\nprint "alive"'), {output: ['alive'], errors: 1});
check('undefined list assignment', program('set missing[1] = 3\nprint "alive"'), {output: ['alive'], errors: 1});
check('non-list indexing', program('define x = 5\nprint x[1]\nprint "alive"'), {output: ['alive'], errors: 1});
check('cyclic append rejected', program('define xs = []\nappend(xs, xs)\nprint xs'), {output: ['[]'], errors: 1});
check('cyclic assignment rejected', program('define xs = [0]\nset xs[1] = xs\nprint xs'), {output: ['[0]'], errors: 1});
check('built-in name protected', program('define length(x)\n  return 5\nprint length([1])'), {output: ['1'], errors: 1});
check('Unicode length', program('print length("aé𝄞")'), {output: ['3']});
check('explicit number conversion', program('print number("18") + 1\nprint number("bad")\nprint "alive"'), {output: ['19', 'alive'], errors: 1});
check('overflow reported', program('print number("1e308") * 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999 * 10\nprint "alive"'), {output: ['alive'], errors: 1});
check('finite large numbers print safely', program('print number("1e100")'), {output: ['1e+100']});
check('oversized numeric literal', program('print ' + '9'.repeat(400) + '\nprint "alive"'), {output: ['alive'], errors: 1});
const keyProgram = program('print ("Press C to start")\ndefine keypress{1} = C\ndefine ask{1} = ("Age?")\nif keypress{1} = ask{1}\nprint ("You are") answer{1} ("years old")');
check('key link waits for matching key', keyProgram, {keys: ['x', 'c'], input: ['14'], output: ['Press C to start', 'You are 14 years old']});
check('no key available continues safely', keyProgram, {keys: [], output: ['Press C to start'], errors: 2});
check('undefined key', program('define ask{1} = ("?")\nif keypress{1} = ask{1}\nprint "alive"'), {output: ['alive'], errors: 1});
check('undefined linked question', program('define keypress{1} = C\nif keypress{1} = ask{1}\nprint "alive"'), {output: ['alive'], errors: 1});
check('unsupported key name', program('define keypress{1} = CommandW\nprint "alive"'), {output: ['alive'], errors: 1});
check('not covers the whole comparison', program('define age = 9\nif not age = 9\n  print "A"\nif not age = 10\n  print "B"\nif not age = 10 and age = 9\n  print "C"\nprint not false'), {output: ['B', 'C', 'true']});
check('not with brackets and in arithmetic stays valid', program('define age = 9\nif not (age > 3)\n  print "D"\nprint -age'), {output: ['-9']});
check('unknown word suggests quotes', program('print Hello'), {errors: 1, contains: 'put it in quotes: "Hello"'});
check('step budget', program('until false\n  print "loop"'), {limit: 20, errors: 1, stopped: true, contains: 'used its'});
(async () => {
  const seen = [];
  const asyncResult = await runAsync(keyProgram, {onOutput: text => seen.push(text), keypress: async key => { assert.equal(key, 'C'); assert.deepEqual(seen, ['Press C to start']); return 'C'; }, input: async () => '21'});
  assert.equal(asyncResult.errors, 0); assert.deepEqual(asyncResult.output, ['Press C to start', 'You are 21 years old']); passed++;
  const controller = new AbortController(); let waiting;
  const ready = new Promise(resolve => { waiting = resolve; });
  const cancelled = runAsync(keyProgram, {signal: controller.signal, keypress: () => { waiting(); return new Promise(() => {}); }});
  await ready; controller.abort();
  const stopped = await cancelled; assert.equal(stopped.cancelled, true); assert.equal(stopped.errors, 0); assert.deepEqual(stopped.output, ['Press C to start']); passed++;
  const busy = new AbortController();
  setTimeout(() => busy.abort(), 0);
  const interrupted = await runAsync(program('until false\n  define x = 1'), {signal: busy.signal});
  assert.equal(interrupted.cancelled, true); assert(interrupted.steps < 1000000); passed++;
  const failedInput = await runAsync(program('define ask{1} = ("?")\nask{1}\nprint "alive"'), {input: async () => { throw new Error('host failed'); }});
  assert.equal(failedInput.errors, 1); assert.deepEqual(failedInput.output, ['alive']); passed++;
  const preaborted = new AbortController(); preaborted.abort();
  const noRun = await runAsync(program('print "no"'), {signal: preaborted.signal});
  assert.equal(noRun.cancelled, true); assert.deepEqual(noRun.output, []); passed++;
  console.log(passed + ' v1 tests passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
