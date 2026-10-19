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
  const questions = [];
  if (expect.input) {
    const next = queue(expect.input);
    opts.input = (question) => { questions.push(question); return next(); };
  }
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
  if (expect.questions && JSON.stringify(questions) !== JSON.stringify(expect.questions)) {
    problems.push('questions: expected ' + JSON.stringify(expect.questions) + ', got ' + JSON.stringify(questions));
  }
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
  { output: ['equal'], errors: 0, warnings: 0 });

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

/* ---------------------------------------------------------- numbered questions */

const numberedExample = `start
define ask{1} = ("What's your name? ")
define ask{2} = ("How old are you? ")
ask{1}
ask{2}
print ("Hello ") answer{1} ("You are") answer{2} ("Years old.")
end`;

test('numbered questions: the requested second example', numberedExample,
  { output: ['Hello Luca You are 14 Years old.'], errors: 0, warnings: 0,
    input: ['Luca', '14'], questions: ["What's your name? ", 'How old are you? '] });

test('numbered questions: original example without end still runs', numberedExample.replace(/\nend$/, ''),
  { output: ['Hello Luca You are 14 Years old.'], errors: 0, warnings: 1,
    input: ['Luca', '14'], questions: ["What's your name? ", 'How old are you? '], contains: ['`end`'] });

test('numbered questions: define never asks',
  `start
define ask{1} = ("Not yet")
print "ready"
end`,
  { output: ['ready'], errors: 0, warnings: 0, input: [], questions: [] });

test('numbered questions: execution order is independent from definition order',
  `start
define ask{1} = ("first")
define ask{2} = ("second")
ask{2}
ask{1}
print answer{1} answer{2}
end`,
  { output: ['one two'], errors: 0, warnings: 0, input: ['two', 'one'], questions: ['second', 'first'] });

test('numbered questions: reading twice does not ask twice',
  `start
define ask{1} = ("name")
ask{1}
print answer{1}
print answer{1}
end`,
  { output: ['Luca', 'Luca'], errors: 0, warnings: 0, input: ['Luca'], questions: ['name'] });

test('numbered questions: repeating ask updates its answer',
  `start
define ask{1} = ("again")
repeat 2
  ask{1}
  print answer{1}
print answer{1}
end`,
  { output: ['first', 'second', 'second'], errors: 0, warnings: 0, input: ['first', 'second'], questions: ['again', 'again'] });

test('numbered questions: empty answers remain readable',
  `start
define ask{1} = ("name")
ask{1}
print "[" + answer{1} + "]"
end`,
  { output: ['[]'], errors: 0, warnings: 1, input: [''], questions: ['name'], contains: ['empty'] });

test('numbered questions: reading before asking skips just that print',
  `start
define ask{1} = ("name")
print answer{1}
print "alive"
end`,
  { output: ['alive'], errors: 1, warnings: 0, input: [], questions: [], contains: ['`answer{1}` has no answer yet'] });

test('numbered questions: undefined question reports its number',
  `start
ask{2}
print "alive"
end`,
  { output: ['alive'], errors: 1, warnings: 0, input: [], questions: [], contains: ['`ask{2}` has not been defined'] });

test('numbered questions: reading an unknown answer reports its number',
  `start
print answer{9}
print "alive"
end`,
  { output: ['alive'], errors: 1, warnings: 0, contains: ['`answer{9}` has no answer yet'] });

test('numbered questions: no input handler reports an error and continues',
  `start
define ask{1} = ("name")
ask{1}
print "alive"
end`,
  { output: ['alive'], errors: 1, warnings: 0, contains: ['nobody here'] });

test('numbered questions: a failed repeat clears its previous response',
  `start
define ask{1} = ("name")
ask{1}
print answer{1}
ask{1}
print answer{1}
print "alive"
end`,
  { output: ['first', 'alive'], errors: 2, warnings: 0, input: ['first', null], questions: ['name', 'name'], contains: ['No answer came back', 'no answer yet'] });

test('numbered questions: large valid numbers use independent sparse slots',
  `start
define ask{9007199254740991} = ("name")
ask{9007199254740991}
print answer{9007199254740991}
end`,
  { output: ['Luca'], errors: 0, warnings: 0, input: ['Luca'], questions: ['name'] });

test('numbered questions: redefinition clears the old answer and warns',
  `start
define ask{1} = ("old")
ask{1}
define ask{1} = ("new")
print answer{1}
ask{1}
print answer{1}
end`,
  { output: ['latest'], errors: 1, warnings: 1, input: ['old answer', 'latest'], questions: ['old', 'new'], contains: ['previous answer was cleared', 'no answer yet'] });

test('numbered questions: numeric-looking answers remain text',
  `start
define ask{1} = ("age")
ask{1}
print answer{1} + 1
end`,
  { output: ['141'], errors: 0, warnings: 0, input: ['14'] });

test('numbered questions: normal slots and legacy ask remain supported',
  `start
define answer = ask("legacy")
define points{1} = 7
define ask{1} = ("numbered")
ask{1}
print answer answer{1} points{1}
end`,
  { output: ['old new 7'], errors: 0, warnings: 0, input: ['old', 'new'], questions: ['legacy', 'numbered'] });

for (const command of ['define', 'set']) {
  test('numbered questions: ' + command + ' cannot overwrite an automatic answer',
    `start\n${command} answer{1} = "manual"\nprint "alive"\nend`,
    { output: ['alive'], errors: 1, warnings: 0, contains: ['filled by its matching'] });
}

for (const slot of ['0', '-1', '1.5', 'word', '9007199254740992']) {
  test('numbered questions: invalid question number ' + slot,
    `start\ndefine ask{${slot}} = ("name")\nprint "alive"\nend`,
    { output: ['alive'], errors: 1, warnings: 0, input: [], questions: [], contains: ['positive whole number'] });
  test('numbered questions: invalid answer number ' + slot,
    `start\nprint answer{${slot}}\nprint "alive"\nend`,
    { output: ['alive'], errors: 1, warnings: 0, contains: ['positive whole number'] });
}

test('numbered questions: missing question text does not define it',
  `start
define ask{1}
print "alive"
end`,
  { output: ['alive'], errors: 1, warnings: 0, input: [], questions: [], contains: ['question text'] });

test('numbered questions: non-text definitions are rejected',
  `start
define ask{1} = 42
print "alive"
end`,
  { output: ['alive'], errors: 1, warnings: 0, contains: ['text in double quotes'] });

test('numbered questions: definitions cannot hide an input side effect',
  `start
define ask{1} = ask("not now")
print "alive"
end`,
  { output: ['alive'], errors: 1, warnings: 0, input: [], questions: [], contains: ['text in double quotes'] });

test('numbered questions: extra tokens on ask do not trigger it',
  `start
define ask{1} = ("name")
ask{1} print "wrong"
print "alive"
end`,
  { output: ['alive'], errors: 1, warnings: 0, input: [], questions: [], contains: ['sits alone'] });

// Separate runs must not share prepared questions or saved answers.
run(numberedExample, { input: queue(['Luca', '14']) });
test('numbered questions: definitions do not leak between runs',
  `start\nask{1}\nprint "alive"\nend`,
  { output: ['alive'], errors: 1, warnings: 0, contains: ['has not been defined'] });
test('numbered questions: answers do not leak between runs',
  `start\nprint answer{1}\nprint "alive"\nend`,
  { output: ['alive'], errors: 1, warnings: 0, contains: ['no answer yet'] });

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

test('quoted and, or and not stay text',
  `start
print "Tom" "and" "Jerry"
print "a" "or" "b"
print "not"
end`,
  { output: ['Tom and Jerry', 'a or b', 'not'], errors: 0, warnings: 0 });

test('and and or still work as words between values',
  `start
print 1 and 2
print 0 and 1
print true or false
print not false
end`,
  { output: ['true', 'false', 'true', 'true'], errors: 0, warnings: 0 });

test('pick on the left of a comparison compares the picked value',
  `start
print pick 1, 2 = 2
end`,
  { output: ['false'], errors: 0, warnings: 0, rng: 0 });

test('pick on the left of a comparison, second value',
  `start
print pick 1, 2 = 2
end`,
  { output: ['true'], errors: 0, warnings: 0, rng: 0.9 });

test('each choice of pick is an arithmetic expression',
  `start
define v = pick 1, 2 + 10
print v
end`,
  { output: ['1'], errors: 0, warnings: 0, rng: 0 });

test('a case with a comma inside pick still works',
  `start
print (pick 1, 2) < 3
end`,
  { output: ['true'], errors: 0, warnings: 0, rng: 0.9 });

test('else follows an if written on one line',
  `start
define a = 2
if a = 1 = print "uno"
else
  print "altro"
if a = 2 = print "due"
else
  print "non due"
end`,
  { output: ['altro', 'due'], errors: 0, warnings: 0 });

test('names can carry the letters of Italian and French',
  `start
define città = 5
define perché = "yes"
print città perché
end`,
  { output: ['5 yes'], errors: 0, warnings: 0 });

test('a whole number written 2.0 is a valid position',
  `start
define items = [10, 20, 30]
print items[(1 + 3) / 2]
end`,
  { output: ['20'], errors: 0, warnings: 0 });

test('two slashes divide and keep the whole part',
  `start
print 7 // 2
print (6 // 4) * 10
print 7 // 2 * 2
end`,
  { output: ['3', '10', '6'], errors: 0, warnings: 0 });

test('two slashes refuse a zero divisor',
  `start
print 7 // 0
print "alive"
end`,
  { output: ['alive'], errors: 1, contains: 'divide by zero' });

test('a decimal comma is read as a decimal point',
  `start
define ask{1} = ("How much? ")
ask{1}
print number("1,5") + 1
print answer{1} = is 2.5
end`,
  { input: ['2,5'], output: ['2.5', 'true'], errors: 0, warnings: 0 });

test('define inside a loop does not warn on the next turn',
  `start
define i = 0
repeat 3
  define x = i * 10
  print x
  set i = i + 1
end`,
  { output: ['0', '10', '20'], errors: 0, warnings: 0 });

test('define still warns when the name was there before the loop',
  `start
define x = 1
repeat 2
  define x = 5
end`,
  { output: [], errors: 0, warnings: 1, contains: ['already existed'] });


{
  const res = run('start\nrepeat 20\n  print sconosciuto\nend\n');
  const p = res.problems[0];
  if (res.problems.length === 1 && p.count === 20) passed++;
  else { failed++; failures.push('a repeated problem is counted once: ' + JSON.stringify(res.problems)); }
}

/* ---------------------------------------------------------- result */

console.log('');
for (const f of failures) console.log('FAILED · ' + f + '\n');
console.log(passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
