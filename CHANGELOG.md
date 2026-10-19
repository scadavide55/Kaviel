# Changes

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
