# Kaviel — what still has to be fixed

## Fixed in 1.5 (20 October 2026)

| Item | What changed |
|---|---|
| A1, A2 | `pick` no longer swallows a comparison or an arithmetic operator: each choice is parsed one level below the comparison |
| A10 | `"and"`, `"or"`, `"not"`, `"under"`, `"over"` written as text stay text; the five words are now reserved, so they are highlighted and cannot be used as names |
| A15 | `else` now follows an `if` written on one line |
| n22 | the footer says which engine is running |
| n23 | a `beta` badge sits beside the name |
| n25 | `over 18` is now `> 18`, the same as `>`, and the example, the lessons in three languages, the tutorial and the specification follow |
| n24, n26, A23 | `is` is the third threshold word: `answer{1} = is 18` is true for `18`, ` 18 ` and `18.0`, and the error message no longer talks about a "response" |
| n26 | `=` reads a number out of text too: `"18" = 18` is true, `"rock" = 1` stays false with a warning, and the lessons say so |
| A3 | `define` inside a loop no longer warns on every turn; a name that existed before the loop still warns |
| A4 | `//` divides and keeps the whole part, and a position written `2.0` is accepted |
| A12 | names carry accented letters: `città`, `perché` |
| A13 | a decimal comma is read as a decimal point, in `number("1,5")` and in `is 2.5` |
| A14 | the same mistake inside a loop is shown once, with `(×50)`, in the terminal and in the editor |
| B `for each` | `for each pet in pets` walks a list or a text, with `break`; a new example, a lesson step in three languages and the specification came with it |
| A6 | `nothing` prints an empty line; inside a list it still reads `nothing` |
| A8 | "needs 1 argument", singular |
| A9 | the step limit says the program used its steps, not that a loop is broken |
| A11 | a text stops at 1 000 000 characters with a sentence, instead of an internal error |
| A16 | a line after `end` is reported once |
| A17 | a function can be called above its own definition, as the specification promised |
| A18, A19 | `Ciao Mario!` and `Ada` — punctuation attaches, an empty piece adds no space |
| A20, A21 | truthiness and the text comparison rule are written in the specification |
| B text | `upper`, `lower`, `trim`, `part`, `split`, `join`, with positions from 1 and accents counted as one |
| H1 | 405 lines of the old interpreter removed from `engine.js` |
| D | every count in the README and the specification brought up to date, help aligned |
| A5 | the sign rule of `%` is written in the specification |
| A7 | a key can start any action, not only a question |
| G10 | the unused `fs` import left the command line |
| — | `tools/sync-examples.js` regenerates the copies of the examples inside `kaviel.html`, so the two can no longer drift without a test noticing |

## Still open after 1.5

| Item | Why it is still open |
|---|---|
| `import`, objects, file access | they are new features, not fixes; each one needs a design decision of its own |
| the game in `examples/citadel.kv` speaks English | its lines are pieces glued together (`"you hit the"` + name + `"for"` + damage); a dictionary would produce broken Italian. It needs the program rewritten sentence by sentence, not a translation table |
| the editor is about ten times slower than the terminal | 18 s against 1.7 s for the citadel; it needs profiling, not a guess |
| the download address hard-codes the release tag | one line in `kaviel.html`; it breaks if the tag is renamed |
| the installers are not signed | needs a paid certificate |
| early commits still contain the hand-written draft | removing it rewrites history |
| Esc while a program waits for the Escape key | read from the code, never proven in a browser |
| no 1.5 installer has been built or tried | needs `npm install` and a build of three platforms |

This file is the list that was started on 19 October 2026 and then checked again, item by item, against the code.
Every line below was **run or read**, not guessed. Where a claim could not be reproduced it says so.

Priority: **P0** breaks a program silently · **P1** wrong or missing behaviour · **P2** rough edge · **P3** tidiness.

---

## A. Bugs in the language

### A24 · `if cond = myFunction(...)` runs the call as part of the condition — **fixed in 1.5.1**

Only `print`, `set`, `break`, `return` and `define` are accepted after the `=` of a one-line `if` (`engine.js`, `inlineAction`). A call of a command of your own is not, so the `=` is read as equality and the call becomes the second operand: it runs **every time**, whatever the condition says.

Proof: `if 1 = 2 = greet("Ada")` prints `Ada`. In the Kaviel machine the same shape made every instruction run the `load` branch.

Today the mistake leaves a warning ("comparing true or false with nothing") with a hint about indenting the action. That warning only helps while the call returns nothing.

The fix needs a decision, because `if total = length(pets)` is a real comparison and `if ok = greet("Ada")` looks like an action:

1. accept a call as the action, and require `if total = (length(pets))` for the comparison;
2. keep the grammar and turn the silent comparison into an error when one side is `true`/`false` and the other is `nothing`;
3. add a word: `then` for the action, so `if ok then greet("Ada")`.

**Fixed on 20 October 2026**, in the third way and without new words: `inlineAction` now accepts a call, but only when the line has no indented block under it. A header line keeps its `=` as a comparison, so `if total = length(pets)` with a block still compares. Three tests cover the three shapes.

### A1 · `pick` on the left of a comparison swallows the operator — **P0**

`if pick 1, 2 = 2` does not compare: the parser puts `(2 = 2)` inside the list of values, so the condition tests the picked value itself and is always true.

Proof: a loop of 200 rounds was true **200/200**. With `set v = pick 1, 2` first and then `if v = 2`: **104/200**, correct. With the comparison on the other side, `if 2 = pick 1, 2`: **42/100**, correct.

Where: `engine.js:876-890`.

Fix: parse each item one precedence level lower, or require parentheses. Add the test.

### A2 · the same swallowing with arithmetic — **P1**

`pick 1, 2 + 10` reads as "pick between 1 and 12". Same fix as A1.

### A3 · `define` inside a loop warns on every round — **P1**

A block is not a scope: the second time through, the name "already exists". `repeat 3` with `define x` inside gave 2 warnings for a correct program. The citadel had to avoid it by hand.

Decide: block scope, silence, or a line in the specification.

### A4 · an index must be a whole number, and there is no integer division — **P1**

`items[(1 + 10) / 2]` is an error because `/` gives 5.5. Every index computation needs a helper `int(x) = x - x % 1`.

### A5 · `%` follows the sign of the left side — **P2**

`-5 % 3` is **-2**, `5 % -3` is **2**. The `int()` helper depends on it. Not in the specification.

### A6 · `nothing` prints as the word "nothing" — **P1** (OPEN §19)

### A7 · `keypress` only works together with `ask` — **P2**

`if keypress{1} = print "x"` is an error; a program cannot simply wait for a key.

### A8 · error message grammar — **P3**

`g(x)` called with two arguments says "needs 1 arguments, not 2".

### A9 · the step limit accuses the wrong thing — **P2**

A large but correct program gets "a loop is not ending". It happened with the first citadel, whose loop was ending fine.

### A10 · **NEW** — the words `and`, `or`, `not`, `under`, `over` break when written as quoted text — **P0**

The parser looks at the value of a token, not its kind.

| Written | Gives | Should give |
|---|---|---|
| `print "Tom" "and" "Jerry"` | `true` | `Tom and Jerry` |
| `print "a" "or" "b"` | `true` | `a or b` |
| `print "not"` | error "Something to compute is missing here" | `not` |

Consequence: a beginner writes "rock and roll" in a game and the program answers `true`. Nothing in the tests covers it. Where: `parseLogic`, `parseNot`, `parseUnary` in `engine.js`.

### A11 · **NEW** — a text that doubles ends in "Internal engine error" — **P1**

`define s = "ab"` and `set s = s + s` in a loop works up to 26 rounds (**134,217,728 characters**), then fails at round 27 with "Internal engine error. The program stopped safely." — a message that blames the engine, not the program, and gives no limit. Note the failure arrives *before* the fixed limit of the output (10 000 lines), so the step budget never runs out: it is the memory of a text.

There is no maximum text length anywhere in `engine.js` or `runtime.js`, while lists stop at 100 000 items and output at 10 000 lines. Fix: a limit on text length (say 1 000 000 characters), and a message that says "this text is too long".

### A12 · **NEW** — accented letters cannot be part of a name — **P1**

`define città = 5` gives `I do not know this symbol: à`. The interface speaks Italian and French, so `città`, `età`, `perché` are natural names. Either allow `\p{L}` in names, or say plainly "use letters without accents".

### A13 · **NEW** — the decimal comma is refused — **P1**

`number("1,5")` is an error. For Italian, French and Belgian users the comma is the normal decimal mark. Accept it, or say in the message that a dot is needed.

### A14 · **NEW** — the same error repeats for every round of a loop — **P1**

A wrong name inside `repeat 50` produced **50 identical problems** (100 lines in the terminal). At the 1 000 000 step limit the Problems panel fills with copies. Fix: deduplicate by line and message with a counter ("×50"), and cap the number shown.

### A15 · **NEW** — `else` after a one-line `if` is an error — **P0 for the promise of the language**

```
if a = 1 = print "uno"
else
  print "altro"
```
gives "`else` alone means nothing". The law "one thing, one way" is broken: the one-line `if` and the block `if` behave differently. Either support it, or make the message say "an `else` needs the block form".

### A16 · **NEW** — code after `end` runs with no warning — **P2**

```
start
print "a"
end
print "b"
```
prints `a` and then `b`, silently. At least a warning.

### A17 · **NEW** — a function cannot be called before its definition — **P2**

`print f(2)` before `define f(x)` is an error, although the specification (§7) says "functions may be called before their line". Either register all functions first, or correct §7 and say in the message "define it higher up".

### A18 · **NEW** — `print "Ciao" nome "!"` gives `Ciao Mario !` — **P1 for the promise, P2 for the code**

The rule "one space between pieces" puts a space before the `!`. Written in the specification, but ugly in Italian and French. Decide: attach `! ? . , : ;` to the piece before them, or document it loudly.

### A19 · **NEW** — `print "" nome` starts with a space — **P2**

Same family as A18.

### A20 · **NEW** — `and` and `or` turn anything into a boolean, and `print` shows it — **P1**

`print 1 and 2` is `true`, `print 0 and 1` is `false`, `print "x" or 1` is `true`. Also `if 0` is false: **0, "", false and nothing are false** — a hidden rule that appears nowhere in the specification, the lessons or the guide. Either document truthiness and booleans, or make `print 1 and 2` an error.

### A21 · **NEW** — `<` and `>` refuse text — **P2**

`if "a" < "b"` is an error ("A `<` wants two numbers"). Fine, but the lesson on text says only that `=` works. Documented or supported, decide.

### A22 · **NEW** — `define length = 3` is accepted, `define print = 3` is not — **P1**

The built-in commands `length`, `append`, `number` can be shadowed by a variable, and the function then breaks. A child naming a box `length` breaks `length()`. Reserve them like keywords, with the same hint.

### A23 · **NEW** — the message about `under`/`over` says "response" — **P3**

`if a = under 5` where `a` is text says "this response is not a valid number", but `a` is not an answer. Make the message say "this value".

---

## B. What is missing from the language

| Missing | Why it matters |
|---|---|
| `for each` to walk a list | every list needs a counter and three lines (OPEN §19) |
| text tools: a part, upper/lower, find, split | `length` is the only text command |
| integer division `//` | see A4 |
| `import` / modules | the language stops at one file (OPEN §19) |
| objects / records | a monster is three globals |
| `random` as an expression (`random(1, 6)`) | `random` is a statement, `pick` covers values only |
| reading and writing files | nothing survives a run |
| a way to type a new line inside text that the lessons teach | `\n` works but nobody says so |

---

## C. Speed — solved in 1.5

| Measurement | Before | After |
|---|---|---|
| The Kaviel machine, terminal | 0.31 s | 0.02 s |
| The Kaviel machine, editor | **0.97 s** | **0.025 s** |
| The citadel, editor | 18 s (old measurement) | **0.034 s** |
| `runAsync` against `run`, same program | 250 ms vs 17 ms | 16 ms vs 16 ms |

The cause was in `runAsync`: on every checkpoint, every 256 steps, it waited for a timer of 0 ms, which a browser rounds up to about 4 ms. A program with sixty checkpoints lost a quarter of a second doing nothing. Now it pauses only when 12 ms of real work have passed since the last pause, so the page still draws and Stop still arrives.

---

## D. Documentation that no longer matches the code

| Where | Says | Truth |
|---|---|---|
| `README.md:66` | `examples/` · 14 small programs | 15 |
| `LANGUAGE.md:343` | `ide-test.html` · 136 browser checks | 137 |
| `LANGUAGE.md:384` | 13 lessons … and 14 examples | 15 examples |
| `LANGUAGE.md:400` | `ide-test.html` in Brave · 136 passed | 137 |
| `LANGUAGE.md:403` | The ten examples in `examples/` | 15, and one needs input |
| `LANGUAGE.md:18` | v1 has 14 keywords | the engine reserves 17 (`true`, `false`, `nothing` are literals but cannot be names) |
| `kaviel help` | the two columns do not line up | |
| `LANGUAGE.md` §7 | functions may be called before their line | they cannot (A17) |
| `examples/citadel.kv` header | "Every word of the language appears at least once" | `break` appears **0 times**; `int` and `sign` are defined and never used |
| everywhere | 0, "", false and nothing are false | never written down (A20) |

---

## E. Translations

- **E1** · "The citadel" and "The biggest program of all" are missing from `i18n.js`: the button stays English. **P2**
- **E2** · the text inside quotes in `examples/citadel.kv` is not in `strings.js`, so the game speaks English in Italian and French. **P2**
- **E3** · "Lessons and examples" is in `i18n.js` twice. **P3**
- **E4** · nothing checks that every label in `kaviel.html` has a translation.
- **E5** · **NEW** · the Italian and French lessons still say "right" in English ("una con sinistra, una con right", "une fois avec right"). **P2**
- **E6** · **NEW** · "Your own game!" is not translated in the last lesson. **P2**
- **E7** · **NEW** · in the French lesson "Si ceci, alors cela" there is a doubled phrase: "poussées à droite vers la droite". **P3**
- **E8** · **NEW** · `questions.kv` and `keypress.kv` still print `You are 14 Years old.` — capital Y, from the original hand-written example. `years old.` reads better. **P3**

---

## F. Holes in the tests

| Hole | Consequence |
|---|---|
| no test puts `pick` on the left of a comparison | A1 shipped in 1.0 |
| no test writes `"and"`, `"or"`, `"not"` as text | A10 shipped in 1.0 |
| nothing checks text length | A11 |
| nothing checks accented names or the decimal comma | A12, A13 |
| nothing checks that errors are not repeated per round | A14 |
| no test of one-line `if` followed by `else` | A15 |
| nothing runs code after `end` | A16 |
| nothing checks calling a function before its line | A17 (and the spec says otherwise) |
| `test.js:438` tests `pick` with a fixed random number | it proves the value is in range, never the distribution |
| nothing checks that every file in `examples/` is linked | two links pointed at missing files until today |
| nothing checks i18n coverage | E1 to E8 |
| no example is run with scripted input | `questions.kv`, `keypress.kv`, the citadel never run in the suite |

---

## G. Packaging and release

- **G1** · the desktop app does not install the `kaviel` command; `build.files` has no `run.js` and the app is sandboxed. **P2**
- **G2** · the Windows `.exe` and the Linux `.tar.gz` have never been launched on those systems. **P1 for confidence**
- **G3** · no continuous integration: nothing runs the four suites on a push. **P2**
- **G4** · `editor-ui.js?v=1.0.0` is a hand-written cache key; forget to change it and browsers keep the old script (this happened). **P2**
- **G5** · the download address hard-codes the tag `kaviel-1.0.0`. **P2**
- **G6** · installers are not signed: the systems warn on first launch. **P3**
- **G7** · early commits of the public repository still contain the hand-written `draft`. Removing it needs a history rewrite. **P3**
- **G8** · `tools/make-release.sh` packages `application/` into a zip nobody publishes any more. **P3**
- **G9** · **NEW** · the release zip copies `README.md` and `LANGUAGE.md` but **not** `LICENSE`, `package.json` or `CHANGELOG`. **P3**
- **G10** · **NEW** · `run.js` requires `fs` and never uses it; `ARROWS` is only used in key mode. Dead weight in the command line. **P3**
- **G11** · **NEW** · the version `1.0.0` lives in `engine.js:1363`, in `package.json` and inside the release file names with a fixed `-beta`. Three places to change, one forgotten is enough. **P2**

---

## H. Dead code

- **H1** · **NEW** · `engine.js` still contains the old `Interpreter` (from line 988 to about 1346) with `show`, `joinPrinted`, `typeName`, `truthy` and `skipCallArgs`. Nothing uses it: `engine.js` hands everything to `runtime.js`. Two implementations in one repository is a trap: someone will fix the wrong one. **P1**

---

## I. Not verified, to try in the browser

These come from reading `kaviel.html` and `editor-ui.js`, not from running them.

- **I1** · Esc stops the run *before* the key waiter sees it (`kaviel.html:565`), so a program waiting for `Escape` can never receive it.
- **I2** · Stop while a question is open may produce a fake error ("The input could not be read").
- **I3** · the output grows with a DOM update per line; with 10 000 lines it will crawl (this is part of C).
- **I4** · choosing an example overwrites the draft in the editor without asking.
- **I5** · `under` and `over` are not highlighted: they are missing from `KEYWORDS`.
- **I6** · the terminal lets arrow keys through as `[A` when it reads a whole line.

---

## J. Product questions, not code

- **J1** · no child has ever used the lessons. Every claim about a six-year-old is a hope until one does, without help, while somebody writes down where it stops.
- **J2** · the last lesson asks for about 25 lines typed by hand.
- **J3** · the lessons cannot be reset as a group.
- **J4** · a program with `ask` cannot be shown already run.

---

## The order I would fix them in

1. **A1, A2, A10** — the three that give a wrong answer without saying so.
2. **A15, A22** — they break the two promises of the language: one way to do a thing, and a name never bites you.
3. **A14, A11** — a broken loop must not bury the screen, and a text must have a limit.
4. **A3, A4, A12, A13** — what a beginner meets in the first week.
5. **C** — the browser speed, before telling anyone the editor is usable.
6. **H1, D, E** — dead code, documents, translations: an afternoon.
7. **F** — the tests that would have caught all of the above.
