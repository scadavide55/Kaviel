/* test.js — runs the spec examples and every error case of §8.
   node test.js                                                      */

const { run } = require('./engine.js');

let passed = 0, failed = 0;
const failures = [];

function rngOf(value) { return () => value; }

function queue(items) {
  let i = 0;
  return () => (i < items.length ? items[i++] : '');
}

function test(name, src, expect) {
  const opts = {};
  if (expect.rng !== undefined) opts.rng = rngOf(expect.rng);
  if (expect.input) opts.input = queue(expect.input);
  if (expect.limit) opts.limit = expect.limit;

  let res;
  try {
    res = run(src, opts);
  } catch (e) {
    failed++;
    failures.push(name + '\n  the engine threw: ' + e.message);
    return;
  }

  const problems = [];
  if (expect.output && JSON.stringify(res.output) !== JSON.stringify(expect.output)) {
    problems.push('output: expected ' + JSON.stringify(expect.output) + ', got ' + JSON.stringify(res.output));
  }
  if (expect.errors !== undefined && res.errors !== expect.errors) {
    problems.push('errors: expected ' + expect.errors + ', got ' + res.errors +
      (res.problems.length ? '\n    ' + res.problems.map(p => 'line ' + p.line + ' ' + p.kind + ': ' + p.message).join('\n    ') : ''));
  }
  if (expect.warnings !== undefined && res.warnings !== expect.warnings) {
    problems.push('warnings: expected ' + expect.warnings + ', got ' + res.warnings +
      (res.problems.length ? '\n    ' + res.problems.map(p => 'line ' + p.line + ' ' + p.kind + ': ' + p.message).join('\n    ') : ''));
  }
  if (expect.contains) {
    for (const piece of expect.contains) {
      const all = res.problems.map(p => p.message + ' ' + (p.hint || '')).join(' | ');
      if (!all.includes(piece)) problems.push('missing message containing: ' + piece + '\n    got: ' + all);
    }
  }
  if (expect.stopped !== undefined && res.stopped !== expect.stopped) {
    problems.push('stopped: expected ' + expect.stopped + ', got ' + res.stopped);
  }

  if (problems.length) {
    failed++;
    failures.push(name + '\n  ' + problems.join('\n  '));
  } else {
    passed++;
  }
}

/* ---------------------------------------------------------- examples §10 */

test('10.1 random 67/33, first face wins',
  `start
random 67
  print "Wow!"
random 33
  print "Damn!"
end`,
  { output: ['Wow!'], errors: 0, warnings: 0, rng: 0.1 });

test('10.1 random 67/33, second face wins',
  `start
random 67
  print "Wow!"
random 33
  print "Damn!"
end`,
  { output: ['Damn!'], errors: 0, warnings: 0, rng: 0.99 });

test('10.1 random, one output per run',
  `start
random 50
  print "a"
random 50
  print "b"
end`,
  { output: ['a'], errors: 0, warnings: 0, rng: 0.2 });

test('10.2 rock paper scissors, tie',
  `start
print "Rock, paper or scissors?"

define you = ask("Rock, paper or scissors? ")
define cpu = pick "rock", "paper", "scissors"

if you = cpu
  print "Tie."

if you = "rock"
  if cpu = "paper"
    print "I chose paper. You lose."
  if cpu = "scissors"
    print "I chose scissors. You win!"
end`,
  { output: ['Rock, paper or scissors?', 'Tie.'], errors: 0, warnings: 0, input: ['rock'], rng: 0 });

test('10.2 rock paper scissors, loss',
  `start
define you = ask("? ")
define cpu = pick "rock", "paper", "scissors"
if you = "rock"
  if cpu = "paper"
    print "You lose."
end`,
  { output: ['You lose.'], errors: 0, warnings: 0, input: ['rock'], rng: 0.5 });

test('10.3 collatz 27 with else',
  `start
define n = 27
define steps = 1

repeat 111
  if n % 2 = 0
    set n = n / 2
  else
    set n = n * 3 + 1
  set steps = steps + 1
  if n = 1
    print "done in " steps " steps"

end`,
  { errors: 0, warnings: 0 });

test('10.3 collatz reaches 1 in 111 steps',
  `start
define n = 27
define steps = 1
until n = 1
  if n % 2 = 0
    set n = n / 2
  else
    set n = n * 3 + 1
  set steps = steps + 1
print "steps: " steps
print "n: " n
end`,
  { output: ['steps: 112', 'n: 1'], errors: 0, warnings: 0 });

/* ---------------------------------------------------------- the basics */

test('hello world',
  `start
print "hello"
end`,
  { output: ['hello'], errors: 0, warnings: 0 });

test('print joins values with a space',
  `start
define name = "Davide"
print "Hello " name "!"
print "age:" 14
end`,
  { output: ['Hello Davide !', 'age: 14'], errors: 0, warnings: 0 });

test('+ glues exactly, no space added',
  `start
define name = "Davide"
print "Hello " + name + "!"
end`,
  { output: ['Hello Davide!'], errors: 0, warnings: 0 });

test('define and set',
  `start
define x = 1
set x = x + 1
set x = x * 10
print x
end`,
  { output: ['20'], errors: 0, warnings: 0 });

test('slots {n}: different slots, same name',
  `start
define points{1} = 10
define points{2} = 20
set points{1} = points{1} + 5
print points{1}
print points{2}
print points
end`,
  { output: ['15', '20', '15'], errors: 0, warnings: 0 });

test('if / else',
  `start
define age = 8
if age > 10
  print "big"
else
  print "small"
end`,
  { output: ['small'], errors: 0, warnings: 0 });

test('nested if and repeat',
  `start
define i = 0
repeat 3
  set i = i + 1
  if i = 2
    print "two"
  else
    print i
end`,
  { output: ['1', 'two', '3'], errors: 0, warnings: 0 });

test('text + number glues',
  `start
print "5" + 5
print 5 + 5
end`,
  { output: ['55', '10'], errors: 0, warnings: 0 });

test('comments and blank lines',
  `start
# a comment
print "a"   # inline

# another one
print "b"
end`,
  { output: ['a', 'b'], errors: 0, warnings: 0 });

test('true / false / nothing',
  `start
print true
print false
print nothing
if true
  print "ok"
end`,
  { output: ['true', 'false', 'nothing', 'ok'], errors: 0, warnings: 0 });

test('decimals and division',
  `start
print 3.5 + 1
print 27 / 2
print 10 % 3
end`,
  { output: ['4.5', '13.5', '1'], errors: 0, warnings: 0 });

test('operator precedence',
  `start
print 2 + 3 * 4
print (2 + 3) * 4
print 10 - 2 - 3
end`,
  { output: ['14', '20', '5'], errors: 0, warnings: 0 });

test('random inside repeat draws again',
  `start
repeat 3
  random 100
    print "always"
end`,
  { output: ['always', 'always', 'always'], errors: 0, warnings: 0, rng: 0.5 });

test('two separate random groups are two draws',
  `start
random 100
  print "a"
print "in between"
random 100
  print "b"
end`,
  { output: ['a', 'in between', 'b'], errors: 0, warnings: 0, rng: 0.5 });

/* ---------------------------------------------------------- errors §8 */

test('unknown word: line skipped, run continues',
  `start
print "before"
prnt "hello"
print "after"
end`,
  { output: ['before', 'after'], errors: 1, warnings: 0, contains: ['I do not know `prnt`', 'print'] });

test('name never created',
  `start
print age
print "end"
end`,
  { output: ['end'], errors: 1, warnings: 0, contains: ['I do not know `age`', 'define'] });

test('define of an existing name: warning, new value wins',
  `start
define x = 1
define x = 2
print x
end`,
  { output: ['2'], errors: 0, warnings: 1, contains: ['already existed'] });

test('set of a name never created: warning, it is created',
  `start
set x = 5
print x
end`,
  { output: ['5'], errors: 0, warnings: 1, contains: ['did not exist'] });

test('division by zero: nothing, run continues',
  `start
print 1 / 0
print "alive"
end`,
  { output: ['alive'], errors: 1, warnings: 0, contains: ['divide by zero'] });

test('operation on incompatible types',
  `start
print "a" - 1
print "alive"
end`,
  { output: ['alive'], errors: 1, warnings: 0, contains: ['two numbers'] });

test('comparison across types: warning and false',
  `start
define x = 5
if x = "5"
  print "equal"
else
  print "different"
end`,
  { output: ['different'], errors: 0, warnings: 1, contains: ['can never be equal'] });

test('random that does not add up to 100: warning and continue',
  `start
random 60
  print "a"
random 30
  print "b"
end`,
  { errors: 0, warnings: 1, contains: ['instead of 100'], rng: 0.1 });

test('indentation out of level: error, it snaps',
  `start
if true
    print "inside"
  print "outside"
end`,
  { output: ['inside', 'outside'], errors: 1, warnings: 0, contains: ['further left'] });

test('if without a body: warning',
  `start
if true
print "after"
end`,
  { output: ['after'], errors: 0, warnings: 1, contains: ['no block under it'] });

test('if condition that fails: one error, block skipped',
  `start
define a = 1
if a / 0 = 1
  print "must not happen"
print "alive"
end`,
  { output: ['alive'], errors: 1, warnings: 0, contains: ['divide by zero'] });

test('line indented with no block above: error, still runs',
  `start
print "a"
  print "b"
end`,
  { output: ['a', 'b'], errors: 1, warnings: 0, contains: ['does not open a block'] });

test('infinite loop: stops at the limit',
  `start
define x = 1
until x = 2
  set x = 1
end`,
  { errors: 1, stopped: true, contains: ['not ending'] });

test('missing start and end: warnings, everything runs',
  `print "hello"`,
  { output: ['hello'], errors: 0, warnings: 2, contains: ['`start`', '`end`'] });

test('many errors at once (law 6)',
  `start
prnt "a"
print "b"
foo bar
print 1 / 0
end`,
  { output: ['b'], errors: 3, warnings: 0 });

test('= on its own does not assign',
  `start
define x = 1
x = 2
print x
end`,
  { output: ['1'], errors: 1, warnings: 0, contains: ['does not assign'] });

test('broken header: block skipped and said',
  `start
if 1 >
  print "inside"
  print "still inside"
print "outside"
end`,
  { output: ['outside'], errors: 1, warnings: 1, contains: ['I skipped lines'] });

test('empty ask: warning and empty text',
  `start
define answer = ask("? ")
print "[" answer "]"
end`,
  { output: ['[ ]'], errors: 0, warnings: 1, input: [''], contains: ['empty'] });

test('ask with nobody to answer: error, run continues',
  `start
define r = ask("? ")
print "alive"
end`,
  { output: ['alive'], errors: 1, warnings: 0 });

test('unclosed text: error, run continues',
  `start
print "hello
print "after"
end`,
  { output: ['after'], errors: 1, warnings: 0, contains: ['never closes'] });

test('pick really chooses one of the values',
  `start
define die = pick 1, 2, 3, 4, 5, 6
print die
end`,
  { output: ['4'], errors: 0, warnings: 0, rng: 0.5 });

test('two questions in a row',
  `start
define q = ask("name? ")
print q
define q2 = ask("age? ")
print q2
end`,
  { output: ['Davide', '14'], errors: 0, warnings: 0, input: ['Davide', '14'] });

test('empty program: only the start/end warnings',
  ``,
  { output: [], errors: 0, warnings: 2, contains: ['`start`', '`end`'] });

test('else on its own',
  `start
else
  print "x"
end`,
  { errors: 1, warnings: 0, contains: ['`else` alone'] });

/* ---------------------------------------------------------- random, statistically */

{
  const res = run(`start
define w = 0
define l = 0
repeat 1000
  random 67
    set w = w + 1
  random 33
    set l = l + 1
end
print w
end`, {});
  const n = Number(res.output[0]);
  if (!(n >= 600 && n <= 750)) {
    failed++;
    failures.push('random 67/33 over 1000 turns out of range: ' + n);
  } else {
    passed++;
  }
}

/* ---------------------------------------------------------- result */

console.log('');
for (const f of failures) console.log('FAILED · ' + f + '\n');
console.log(passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
