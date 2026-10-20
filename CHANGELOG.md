# Changes

## 1.6.0 — 20 October 2026

- **`start` is no longer needed.** A program is just its lines and a closing `end`. A program that still begins with `start` runs exactly as before and says nothing, so older programs and saved files keep working. The lessons, the examples, the editor's empty page and the quick help no longer write it, and the three languages of the first lesson explain `end` alone.
- Fixed: `kaviel run` waited forever after a program that never asks when its input stayed open. It now ends as soon as the program does.
- The editor highlights `under`, `over`, `is`, `for`, `true`, `false` and `nothing`. The cursor position (`Ln`, `Col`) and six screen-reader labels are translated, and a test keeps every label of the page translated.
- The page has a description, share tags, a favicon and a hidden heading for screen readers.
- A program without `start` no longer gets the warning "A program should start with `start`". The warning for a missing `end` stays.

## 1.5.1 — 20 October 2026

- The version (`v1.5.1`) sits beside the name, read from the engine so it cannot drift. The footer no longer carries a hand-written engine version.
- **A thing with parts.** A word inside the braces names a part: `define monster{hp} = 10`, `set monster{hp} = monster{hp} - 3`, `print monster{hp}`. Numbered slots work as before.
- **`random(1, 6)`** gives a whole number from 1 to 6, both ends included. `random 70` followed by a block is unchanged.
- Lessons: a new lesson, "Things with parts" (five steps), and four steps on `random(a, b)` in "Luck", in English, Italian and French; the quick help (`?`) has both. The quick help also said `over 18` meant "18 or more"; since 1.5 it means "more than 18", and now it says so.
- Lessons: five new steps, in English, Italian and French, for what no lesson showed yet: an empty line (`print nothing`), a question in one line (`ask("...")`), a command called from a one-line `if`, `pick` from a list, and `\n` / `\"` inside a text. The line-by-line panel explains each new shape.
- The lesson list shows how many lessons are done, a Continue button that returns to the step you were on, and a closing card when all are done. In an empty output, a newcomer sees "Start with lesson 1" instead of having to find a small icon.
- On a phone, Run brings the output into view, and the language name is no longer cut short.
- French lesson: a doubled "vers la droite" removed. `questions.kv` prints `years old.` in lower case.
- The download button on the site pointed at `Kaviel-1.0.0-beta-*` files that the 1.5 release does not hold (a 404). It now names the real `1.5.0-beta` installers, and a test checks that file names and release tag agree.
- `if ready = greet("Ada")` now runs `greet` when the check is true. Before, the call was read as part of the check, so it ran every time and its answer was compared. The shape is the tie-breaker: a line with an indented block under it keeps `=` as a comparison.
- The engine pauses on elapsed time instead of at every checkpoint, so the editor is as fast as the terminal: the Kaviel machine went from 0.97 s to 0.025 s.

## 1.5 — 20 October 2026

The version where the language stopped surprising the person using it.

### New in the language

- `for each pet in pets` walks a list, and a text too, one item at a time. `break` leaves it early. No counter, no position, no `length`.
- `is` is the third threshold word: `answer{1} = is 18` is true for `18`, ` 18 ` and `18.0`.
- `//` divides and keeps the whole part, so `7 // 2` is `3` and a position is easy to compute.
- Text commands: `upper`, `lower`, `trim`, `part`, `split`, `join`, with positions from 1 and accents counted as one letter.
- A key can now start any action: `if keypress{1} = print "pressed"` waits, then prints. Before, it could only open a question.
- A function can be called from a line above its own `define`, as the specification always said.
- Names carry accented letters: `città`, `perché`.

### Fixed

- `pick` no longer swallows what comes after it: `if pick 1, 2 = 2` compares the picked value instead of being always true.
- `"and"`, `"or"`, `"not"`, `"under"`, `"over"` and `"is"` written as text stay text. The six words are reserved, so they are highlighted and cannot be used as names.
- `else` follows an `if` written on one line.
- `over 18` now means **more than** 18, the same as `>`; `is 18` covers the exact number.
- `=` reads a number out of text, so an answer can be compared with a number directly.
- `define` inside a loop no longer warns on every turn; a name that existed before the loop still warns.
- `print nothing` shows an empty line, and punctuation attaches: `Ciao Mario!` instead of `Ciao Mario !`.
- A text stops at 1 000 000 characters with a sentence instead of an internal error.
- A line after `end` is reported once.
- A position written `2.0` is accepted; `number("1,5")` is 1.5.
- The same mistake repeated inside a loop is shown once, with `(×50)`, in the terminal and in the editor.
- The step limit says the program used its steps, instead of blaming a loop that was fine.

### Lessons

- Six new lessons: **Words and letters** (`upper`, `lower`, `trim`, `part`, `split`, `join`), **Numbers that stay whole** (`//` and `%`), **Draw with letters** (patterns built from text), **True, false and nothing**, **Numbers with a point** (decimals and negatives) and **Lists inside lists** (tables).
- 19 lessons and 67 steps now, in English, Italian and French, and every word of the language appears in one of them.
- Every new instruction has a note under its line: `for each`, the six text commands, `//` and `%`.

### The example

- `examples/machine.kv`, **The Kaviel machine**: a small computer written in Kaviel, with a stack, variables, labels and jumps. It runs two programs on itself (the factorial of 6 and the first ten Fibonacci numbers) and then reports with the text tools. It is the biggest program in the language.

### Cleanup

- 405 lines of the old interpreter removed from `engine.js`.
- `tools/sync-examples.js` regenerates the copies of the examples inside `kaviel.html`, so the page and the files cannot drift apart unnoticed.
- Every count in the README and the specification brought up to date; the command line help aligned.
- Tests on every push, through GitHub Actions.
- The release zip carries `LICENSE` and `package.json`.

### Tests at this version

| Suite | Result |
|---|---|
| `node test.js` | 114 passed |
| `node v1-test.js` | 72 passed |
| `node cli-test.js` | 36 passed, including all 16 examples through the real command |
| `ide-test.html` | 137 passed in a headless browser |

### Not here yet

`import`, objects, file access, and the game in `examples/citadel.kv` still speaks English because its lines are pieces glued together.
