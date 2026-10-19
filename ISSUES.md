# Kaviel — what still has to be fixed

Everything here was found by reading the code and running it, on 19 October 2026, against version 1.0.0-beta.
Each item says where it is, how it was proven, and what to do. Nothing here is a guess.

Priority: **P0** breaks a program silently · **P1** wrong or missing behaviour · **P2** rough edge · **P3** tidiness.

---

## A. Bugs in the language

### A1 · `pick` on the left of a comparison swallows the operator — **P0**

`if pick 1, 2 = 2` does not compare: the parser puts `(2 = 2)` inside the list of values, so the condition tests the picked value itself and is always true.

Proof: a loop of 200 rounds, `if pick 1, 2 = 2` was true **200/200**. With the comparison on the other side, `if 2 = pick 1, 2`, it was correct: **42/100**. With `set v = pick 1, 2` first and then `if v = 2`, correct: **104/200**.

Where: `engine.js:876-890`, the `pick` branch builds its items with `parseExpression()`, which keeps reading operators to the right.

Fix: parse each item one precedence level lower (additive), or make `pick` require parentheses when used inside an expression. A test must be added: `pick` on the left of `= <> <= >= + - * /` returns a value of its own list, never a boolean.

### A2 · the same swallowing with arithmetic — **P1**

`pick 1, 2 + 10` can read as "pick between 1 and 12". Same root cause as A1, same fix.

### A3 · `define` inside a loop prints a warning on every round — **P1**

A block is not a scope: the second time through, the name "already exists" and the interpreter warns. A beginner writing a loop gets two warnings for a correct program. In `examples/citadel.kv` this had to be avoided by hand.

Proof: a `repeat 3` with `define x = i * 10` inside gave 2 warnings ("`x` already existed").

Decide: either blocks get their own scope, or `define` inside a loop is silent, or the specification says plainly that names are global and `define` is only for the first time.

### A4 · a whole number is required to index a list, and there is no integer division — **P1**

`items[(1 + 10) / 2]` is an error, because `/` gives 5.5. There is no `//`. Every program that computes an index must carry a helper like `int(x) = x - x % 1` — the citadel needs it for its binary search.

Suggestion: accept a whole-number float as a position, and/or add `//`.

### A5 · `%` follows the sign of the left side, and the specification never says so — **P2**

`-5 % 3` is **-2**, `5 % -3` is **2**. The `int()` helper depends on it, and the map arithmetic in the citadel relies on adding `size` before `%`. It belongs in §9 of the specification in one line.

### A6 · `nothing` prints as the word "nothing" — **P1** (already OPEN §19)

`print nothing` shows `nothing`. Most small languages print an empty line. Decide, and write it down.

### A7 · `keypress` only works together with `ask` — **P2**

`if keypress{1} = print "got it"` is an error: "Link the key to a question with `= ask{n}`". So a program cannot simply wait for a key; it must also ask a question. The citadel works around it by asking the name right after the key.

### A8 · error message grammar — **P3**

Calling `g(x)` with two arguments says: "`g` needs 1 arguments, not 2". It has to say "1 argument", singular. `runtime.js`, the arity check.

### A9 · the step limit message accuses the wrong thing — **P2**

A big but correct program that reaches 1,000,000 steps gets "a loop is not ending. Look at the repeat / until condition". In the citadel the loop was ending fine; the program was simply doing more work than the budget (it recomputed a path search every turn). Suggest: "the program used its 1,000,000 steps" plus the biggest loop.

---

## B. What is missing from the language

| Missing | Why it matters |
|---|---|
| `for each` to walk a list | without it, every list needs a counter, an index and three lines (OPEN §19) |
| text tools: take a part, upper/lower, find, split | `length` works on text, nothing else; no quiz can check an answer letter by letter |
| integer division `//` | see A4 |
| `import` / modules | the language stops at one file (OPEN §19) |
| objects / records | a monster is three separate variables and three globals |
| `random` as an expression, e.g. `random(1, 6)` | today `random` is a statement with blocks; `pick` covers values only |
| reading and writing files | nothing survives a run |
| a real `while` | `until` is enough today, but reads backwards for a negative condition |

---

## C. Speed

| Measurement | Result |
|---|---|
| The citadel in the terminal, whole game | **1.7 s** |
| The same game in the editor (browser) | **18 s** |
| `fib(16)`, 3193 calls, terminal | 0.2 s |
| 2000 loop iterations, terminal | 0.06 s |

The browser is about ten times slower than the terminal for the same program. The editor rebuilds output through the DOM and the runtime is a generator with an await per statement; worth profiling before the next release, because a beginner seeing 18 s concludes that the program is broken.

Also: the step budget of 1,000,000 is reached by real programs (the first version of the citadel hit it). Either raise it or make the work per statement cheaper.

---

## D. Documentation that no longer matches the code

| Where | Says | Truth |
|---|---|---|
| `README.md:66` | `examples/` · 14 small programs | 15 |
| `LANGUAGE.md:343` | `ide-test.html` · 136 browser checks | 137 |
| `LANGUAGE.md:384` | … 13 lessons (50 steps …) and 14 examples | 15 examples |
| `LANGUAGE.md:400` | `ide-test.html` in Brave · 136 passed | 137 |
| `LANGUAGE.md:403` | The ten examples in `examples/` | there are 15, and one needs input |
| `LANGUAGE.md:18` | v1 has 14 keywords | the engine reserves 17 words: `true`, `false` and `nothing` are literals but cannot be used as names either |
| `kaviel help` | `kaviel run <file.kv>   Run a program` / `kaviel help               Show this help` | the columns do not line up |

---

## E. Translations

- **E1** · the new example is not translated: "The citadel" and "The biggest program of all" are missing from `i18n.js`, so the button stays English in Italian and French. **P2**
- **E2** · the text inside quotes in `examples/citadel.kv` is not in `strings.js` (goblin, skeleton, "blocks the way!", "critical hit!"…), so the game speaks English in both languages. Every other example is translated. **P2**
- **E3** · `i18n.js` has the entry "Lessons and examples" twice. Harmless, but it means the table is not checked. **P3**
- **E4** · nothing checks that every label in `kaviel.html` has a translation; a missing one silently stays English.

---

## F. Holes in the tests

| Hole | Consequence |
|---|---|
| no test puts `pick` on the left of a comparison | A1 shipped in 1.0 |
| `test.js:438` tests `pick` with a fixed `rng` and one value | it proves the value is in range, never that the distribution is right |
| nothing checks that every file in `examples/` is linked from the editor | two links (`guess_the_number.kv`, `times_table.kv`) pointed at files that do not exist until today |
| nothing checks i18n coverage | see E1 and E4 |
| no example is run with scripted input in the tests | `questions.kv`, `keypress.kv` and the citadel are never exercised by the suite |
| no test of the browser at 100 % (only headless, one viewport) | layout on a real phone unverified |

---

## G. Packaging and release

- **G1** · the desktop app does not install the `kaviel` command: `package.json` `build.files` does not include `run.js`, and the app is sandboxed. Decided, but it should be written in the README next to "On the command line". **P2**
- **G2** · the Windows `.exe` and the Linux `.tar.gz` have never been launched on a real machine of those systems. Only built. **P1 for confidence, not for code**
- **G3** · no continuous integration: nothing runs the four suites on a push, so a broken commit can be published. **P2**
- **G4** · `editor-ui.js?v=1.0.0` in `kaviel.html` is a hand-written cache key: change the file and forget the number, and browsers keep the old script (this happened today, and cost four reloads). Make it part of the release script. **P2**
- **G5** · the download address in `kaviel.html` hard-codes the tag `kaviel-1.0.0`: rename the release and the button breaks. It is one line, but nothing checks it. **P2**
- **G6** · installers are not signed: macOS and Windows warn on first launch. Written in the README, cannot be fixed without paying. **P3**
- **G7** · the early commits of the public repository still contain the hand-written `draft` that was later removed. Removing it needs a history rewrite. **P3**
- **G8** · `tools/make-release.sh` still packs `application/` into a zip that is no longer published. Either keep it and say why, or drop it. **P3**

---

## H. Product questions, not code

- **H1** · no child has ever used the lessons. Every claim about a six-year-old is a hope until one does, without help, while somebody writes down where it stops.
- **H2** · the last lesson asks for about 25 lines typed by hand; on a phone the symbol bar is the only way to write `{ }`.
- **H3** · the lessons cannot be reset as a group: the ticks live in `localStorage` and only the panel can clear them one by one.
- **H4** · a program that uses `ask` cannot be run without a person at the keyboard, so the editor cannot show an example *and* its output before it is run.

---

## The order I would fix them in

1. **A1 + A2** — the only ones that give a wrong answer without saying anything.
2. **A3** — every beginner will meet it in the first week.
3. **A4 + B `for each`** — the two things that make real programs long.
4. **C** — the browser speed, before telling anyone the editor is usable.
5. **D + E** — the documents and the translations, an hour of work.
6. **F** — the tests that would have caught A1 and the two dead links.
