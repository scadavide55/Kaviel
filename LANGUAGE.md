# Kaviel — project specification

Living document, v1. Every decision taken lives here; what is still open is marked **OPEN**.
This file is the reference for the language; where it and the code disagree, the code and the tests win.

---

## 0. The goal, written once and for all

> The simplest and friendliest programming language in the world: a six-year-old learns it in a few minutes and can write a real program. Errors behave like HTML: the program **never stops**, but **nothing passes in silence**.

Six laws follow. If a proposal breaks one of them, the proposal is wrong, not the law.

| # | Law | What it means |
|---|---|---|
| 1 | **It never stops** | a broken line is skipped, the rest runs to `end` |
| 2 | **Nothing is silent** | every error leaves a visible mark, with line and explanation |
| 3 | **Few words** | one word per idea, no synonyms; the engine reserves 24 words, of which 15 are commands and 6 (`under`, `over`, `is`, `and`, `or`, `in`) are words used inside a sentence |
| 4 | **One thing, one way** | two syntaxes for the same action are a design bug |
| 5 | **It reads as it happens** | indentation is the block, `print "hi"`, `=` is equality, `under 18` reads like English |
| 6 | **The first error is not the last** | every error is reported in one run, not one per run |

---

## 1. Shape of a program

```
  ...lines...
end
```

- `end` comes last; if it is missing, everything still runs and a **warning** appears (law 1).
- `start` is **no longer needed** (1.6, decided by Davide, 20 October 2026). A program that begins with `start` still runs, in silence, so older programs and files keep working. Nothing in the lessons, the examples or the editor writes it any more.
- Comments: `#` to the end of the line.
- Extension: `.kv`.
- A program is run from the terminal (`kaviel run file.kv`) or in the browser editor (`kaviel.html`).

---

## 2. The words (v1)

| Word | Does | Example |
|---|---|---|
| `end` | closes the program | `end` |
| `start` | optional, and ignored: older programs begin with it | `start` |
| `print` | shows values on one line | `print "Hello " name` |
| `define` | creates a variable, a question, a key or a function | `define age = 12` |
| `set` | changes a variable or one list item | `set age = age + 1` |
| `if` / `else` | choose a block | `if age > 10` |
| `repeat` | repeats a block N times | `repeat 3` |
| `for` | walks a list or a text, one item at a time | `for each pet in pets` |
| `until` | repeats while a condition is false | `until n = 1` |
| `ask` | asks a question and gives back text | `define name = ask("Your name? ")` |
| `random` | runs one of the following blocks | `random 67` |
| `pick` | chooses one value at random | `define die = pick 1, 2, 3` |
| `return` | sends a value back from a function | `return n * n` |
| `break` | leaves the nearest loop | `break` |

Literals: numbers, text in `"..."`, `true` / `false`, `nothing`, lists `[1, 2, 3]`.
Operators: `+ - * / // %`, comparisons `= != < > <= >=`, logic `and or not`, and the three threshold words `is` / `under` / `over` (§6). `//` divides and keeps the whole part.

`=` is **only** equality, never assignment. `define` and `set` assign. `==` is accepted as a synonym of `=` because people arrive from Python and C.

A keyword cannot name a variable or a function: `define return = 1` is an error, with a hint.

---

## 3. Variables and slots `{n}`

The braces are optional: `define age = 12` is `define age{1} = 12`.

`age` and `age{1}` are the same thing. Braces are needed only for a second value under the same name (`points{1}`, `points{2}`), which is rare.

- Reading a name never created → **error**, value `nothing`, run continues.
- `define` of an existing name → **warning**, the new value wins — unless that name was created inside the loop that is running, which is what a loop is for.
- `set` of a name that never existed → **warning** ("it did not exist, I created it") and it is created.
- **A word inside the braces names a part**: `define monster{hp} = 10`, `set monster{hp} = monster{hp} - 3`, `print monster{hp}`. It works exactly like a numbered slot, with a name instead of a number, so `monster{name}` and `monster{hp}` are two parts of one thing, and `hero{hp}` is another thing. Decided by Davide, 20 October 2026.
  - The word is written plain: not text, not a box. `monster{"hp"}` is an error with a hint.
  - It cannot be a reserved word (`and`, `is`, `over`...).
  - A missing part is named in full in the error: ``I do not know `monster{mana}` ``.
  - There is no way yet to list the parts of a thing, nor to put a box in the braces (`monster{field}`). Both would be new decisions.
- Names: letters, digits, `_`, starting with a letter. Letters include the accented ones, so `città` and `perché` are names. Case counts.

---

## 4. Blocks and indentation

```
if age > 10
  print "you are big"
else
  print "you are small"
```

- A block is everything indented to the right of the line above. A tab counts as 4 spaces.
- Wrong indentation → **error**, and it snaps to the nearest open level: it forgives, but it says so.
- `else` **exists**: without it, "otherwise" means writing the opposite condition by hand, and a mistake in that negation silently does the wrong thing.
- `repeat 3` runs its block 3 times. `until cond` checks before each turn and stops when `cond` holds.
- `for each pet in pets` runs its block once for every item of a list, with `pet` holding that item. It works on a text too, one letter at a time. `break` leaves it early. After the loop the name keeps the last item.
- `break` leaves the nearest loop; inside a function it cannot leave the caller's loop.

**One line, one action.** When the action is short, `if cond = action` puts it on the same line:

```
if age = under 18 = print "Teenager"
if score > 10 = set best = score
if n = 0 = return 1
```

`=` after the condition is the separator; inside the condition, `=` still means equality and `>= <=` still work. This is the only place where one `=` does two jobs, and it is unambiguous by position — and by shape:

- a line that stands alone, with no indented block under it, takes an action after the `=`;
- a line with an indented block under it is a header, so its `=` is a comparison. `if total = length(pets)` followed by a block compares the total with the number of pets.

The action can be `print`, `set`, `ask{n}`, `break`, `return`, `define`, or **a command of your own**: `if ready = greet("Ada")` runs `greet` when the check is true, and only then.

---

## 5. Random, without slots

```
random 67
  print "Wow!"
random 33
  print "Damn!"
```

- Consecutive `random` lines (with their blocks) form **one draw**: one wins, the others do not run.
- Two groups separated by any other line are two independent draws.
- Chances that do not add up to 100 → **warning**, and they are normalised.
- The draw happens once, when execution reaches the lines. The result is frozen.

`pick` chooses a value, all with equal chance: `pick 1, 2, 3` or `pick items` (a list of choices).

`random(a, b)` is a **value**, not a block: a whole number from `a` to `b`, both ends included, with equal chance. `random(1, 6)` is a die; `items[random(1, length(items))]` is a place that exists. Decided by Davide, 20 October 2026.

- Both numbers must be whole numbers; text (even `"6"`) and decimals are an **error** with a hint (`number(...)` turns an answer into a number).
- A first number bigger than the second is a **warning**, and the two are swapped.
- It takes exactly two numbers. `random` followed by a space and a chance is still the block above: the two never meet, because the value form needs brackets right after the word.
- Each time execution reaches it, it throws again. Keep the result in a box to use it twice.

---

## 6. Questions and answers

### Numbered questions

```
define ask{1} = ("What's your name? ")
define ask{2} = ("How old are you? ")
ask{1}
ask{2}
print ("Hello ") answer{1} ("You are") answer{2} ("Years old.")
end
```

Answers `Luca`, `14` → `Hello Luca You are 14 Years old.`

- `define ask{n} = ("question")` prepares a question; it does not ask. The text is required: `define ask{1}` without text is a clear error (decided by Davide, 19 Oct 2026).
- `ask{n}` asks it and waits; then execution continues. Questions run in execution order.
- `answer{n}` reads that question's latest response. Responses stay **text**, even `"14"`.
- Slots are positive integers; question slots, answer slots, keys and variables are separate namespaces.
- Repeating `ask{n}` asks again and replaces only that answer. Redefining a question warns and clears its old answer.
- Asking an undefined question, or reading an answer before it exists, is an error; only that line is skipped.
- Enter with no text stores `""` and gives a warning.
- Definitions and answers are reset at every run.

### Threshold words

```
if answer{1} = under 18 = print "You are under 18."
if answer{1} = over 18 = print "You are over 18."
```

- `under 18` is **< 18**; `over 18` is **> 18**, the same as `<` and `>`. So 17 is under, 19 is over, and 18 is neither.
- `is 18` is **= 18**, read as a number: it works on text too, so `answer{1} = is 18` is true for `18`, ` 18 ` and `18.0`.
- All three read numbers out of text and refuse text that is not a number. (Decided by Davide on 20 October 2026.)
- They read numbers out of the answer, including `" 18 "`, `"17.5"`, `"1e3"`. Text that is not a number → **error** on that line, run continues.
- They work on both sides: `if 18 = over answer{1}` is the same test.
- A number and a text holding a number are compared as numbers: `"18" = 18` is `true`, and `" 18 " = 18` too. Text that is not a number stays unequal, with a warning.

### A key that opens a question

```
define keypress{1} = C
define ask{1} = ("What's your name? ")
if keypress{1} = ask{1}
print ("Hello ") answer{1}
```

- `define keypress{n} = C` names one key. One character, or `Enter`, `Space`, `Escape`, `Tab`, `Backspace`, `Delete`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`.
- `if keypress{n} = ask{m}` waits for exactly that key, then asks that question. Wrong keys keep waiting; terminals and the editor wait for a real event, not a simulated prompt.
- After `=` the action can be anything, not only a question: `if keypress{1} = print "pressed"` waits, then prints.
- In the browser the editor shows "Press C …" and pauses the run; in the terminal the key is read in raw mode and the terminal is restored afterwards.

### The expression form (preserved)

`define name = ask("Your name? ")` still asks immediately and returns text.

---

## 7. Functions

Decided by Davide (19 Oct 2026): a function is a `define` with parameters, and it sends its result back with `return`.

```
define greet(name)
  return "Hello " + name + "!"

define square(n)
  return n * n

print greet("Ada")
print square(6)
```

- Head: `define name(param, param)` and nothing after it. The body is the indented block.
- `return expr` ends the function and sends the value back; `return` alone sends `nothing`.
- A function without `return` runs and gives `nothing`.
- Parameters are local names; they shadow outer names of the same kind. A function can read globals and change an existing global with `set`.
- A function may be called from a line above its own `define`: the whole program is read before it runs. Nested definitions are an error.
- Calling with the wrong number of arguments is an error and **does not evaluate the arguments**.
- Recursion works up to **128 nested calls**; past that it is an error, not a crash.
- A function cannot `break` its caller's loop.
- Built-in names (`length`, `append`, `number`) cannot be redefined.

---

## 8. Lists

Decided by Davide: **positions start at 1**, so `items[1]` is the first item.

```
define pets = ["cat", "dog", "fox"]
print pets[1]            # cat
print pets[length(pets)] # fox
set pets[2] = "owl"
append(pets, "bee")
print pets               # ["cat", "owl", "fox", "bee"]
```

- `[a, b, c]` builds a list; lists nest (`[[1, 2], [3]]`).
- `items[i]` reads; `set items[i] = v` changes one item; `set items[1][2] = v` reaches inside.
- A position must be a whole number from 1 to the length; `2.0` counts as 2. Otherwise an error names the real length. To get a whole number from a division, use `//`.
- `length(x)` counts items, or characters in text (Unicode-aware).
- Text commands: `upper("ciao")`, `lower("ABC")`, `trim("  x  ")`, `part("hello", 2, 4)` gives `ell`, `split("a,b", ",")` gives a list, `join(list, "-")` puts it back together. Positions start at 1, and accented letters count as one.
- `append(list, value)` adds at the end; `list` is changed in place, so functions receive the same list.
- `number(text)` converts text to a number, or errors if it is not one. A comma works as the decimal mark: `number("1,5")` is 1.5, and so is `2,5 = is 2.5`.
- Lists compare by their contents: `[1, [2]] = [1, [2]]` is true.
- A list cannot contain itself (directly or through nesting): error, and the list is left as it was.
- Limit: 100 000 items per list.

---

## 9. Values and types

Four kinds of value: number, text, `true`/`false`, `nothing`, plus lists.

| Situation | What happens |
|---|---|
| `print 5` | `5` |
| `"hi " + 5` | `hi 5` (`+` with a text glues) |
| `5 + "5"` | `55` (glues, does not add) |
| `"a" - 1` | **error**, `nothing`, run continues |
| `1 / 0` | **error**, `nothing`, run continues |
| `-5 % 3` | `-2`: `%` keeps the sign of the left side, like the `rest` of a division |
| `"rock" = 1` | `false` + **warning** (a text that is not a number stays unequal) |
| `print "a " b` | one space between values, and none where one is already written |
| `print "Ciao" name "!"` | punctuation stays attached: `Ciao Mario!`, never `Mario !` |
| `print nothing` | an empty line |

To glue text exactly, use `+`: `print "Hi " + name + "!"`.

Truthiness: `false`, `0`, `""` and `nothing` are false; everything else, including `[]`, is true. This is used by `if`, `until`, `and`, `or` and `not`.
Comparison of text: `=` works, and reads a number out of a text when the other side is a number. `<`, `>`, `<=`, `>=` want numbers; on text they raise an error.

---

## 10. Errors

### Levels

| Level | When | Program | Seen as |
|---|---|---|---|
| **Error** | the line cannot be understood or cannot run | skips the line, moves on | red line + message |
| **Warning** | it runs, probably not what you meant | runs | yellow line |
| **Hint** | a better way exists | runs | in the panel |

### The sentences

> **line 7** — I do not know `age`. Did you create it with `define`?
> *Did you mean `age`?*

The message is a sentence, never a traceback. "Did you mean" compares the word with keywords and with names created so far.

### Recovery

- A broken **block header** (`if`, `repeat`, `random`, `define ...`) skips its block and says so: "I skipped lines 8–10 of the `if` block too."
- A broken **expression** skips that line's action only.
- Every error is collected before execution starts; then the program runs anyway.
- The same mistake repeated inside a loop is shown once, with a counter: `(×50)`. A program cannot bury its own first error under copies of itself.
- The only thing that stops a program is the step limit (§11) or Stop in the editor.

### Where you see them

Editor: Output on top, Problems below, click a problem to select its line. Terminal: messages and lines on stderr, output on stdout, exit code 1.

---

## 11. Limits

| Limit | Value | On reaching it |
|---|---|---|
| Steps per run | 1 000 000 | error, program stopped |
| Nested function calls | 128 | error, the call is skipped |
| Items in a list | 100 000 | error, `append` refused |
| Output lines | 10 000 | error, program stopped |
| Characters in one text | 1 000 000 | error on that line, run continues |

The step limit is the only automatic stop, and it is mandatory: a wrong `set` inside a loop creates an endless loop on the first try.

---

## 12. What is not there, on purpose

| Not there | Why |
|---|---|
| `import` / modules | nothing real to import yet |
| objects / classes | out of reach; a thing with named parts, `monster{hp}`, covers what a game needs (added on 20 October 2026) |
| `else if` | `else` plus an indented `if` does the same |
| `while` | `repeat` and `until` cover it |
| declared types | the value decides the type |
| ~~`for each`~~ | added on 20 October 2026: `for each pet in pets` |

**OPEN:** whether `import` comes next.

---

## 13. How it is built

```
source text
   │
   ▼
[ lexer ]        logical lines → tokens (NEWLINE, INDENT, DEDENT)
   │             tab = 4 spaces, brackets continue the line
   ▼
[ parser ]       tokens → tree, with recovery: a broken line becomes a node
   │             errors collected, never thrown
   ▼
[ runtime ]      generator: one interpreter for synchronous and async hosts
   │             output callbacks, input/keypress requests, cancel signal
   ▼
output + problems
```

Static files, no dependencies, no build step:

| File | Role |
|---|---|
| `engine.js` | lexer, parser, language metadata; public API `run`, `runAsync`, `tokenize`, `parse` |
| `runtime.js` | the interpreter: scopes, functions, lists, keys, limits, cancellation |
| `kaviel.html` | editor window, layout and run integration |
| `editor.css` | responsive workspace theme |
| `editor-ui.js` | highlighting, find, local files, guide, status |
| `tutorials.js` | 20 lessons (81 steps) in a side panel next to the editor, texts in `lessons.js` (en, it, fr) |
| `test.js` | 112 language tests, including the §14 examples |
| `v1-test.js` | 72 tests: thresholds, functions, lists, keys, async and cancellation |
| `cli-test.js` | 20 tests of the `kaviel` command through pipes and signals |
| `i18n.js` | Italian and French interface (the language itself stays English) |
| `strings.js` | translations of the text inside quotes in lessons, examples and help; keywords never change |
| `ide-test.html` | 137 browser checks: run, input, keys, Stop, lessons, symbols, files, drag and drop, layout |
| `run.js` | the command: `kaviel run`, `kaviel help`, `kaviel version` |
| `examples/` | runnable programs, one per idea |
| `index.html` | the address GitHub Pages serves: it opens `kaviel.html` |
| `electron/`, `build/` | the desktop app and its icon |
| `tools/make-release.sh` | writes the release zip, installers included |

The desktop app is this same page opened from disk by Electron: one editor, not two.

- `electron/main.js` opens `kaviel.html` in a window, cancels every `http` and `https` request, and refuses to navigate away from the page. On macOS the menu exists only so that Cmd+C, Cmd+V, Cmd+Q and reload keep working; on Windows and Linux there is no menu bar.
- `electron/preload.js` tells the page that it is the app (`window.kavielDesktop`), which is what hides **Download**. Nothing else crosses the bridge: no Node, no file system, sandbox on.
- Electron 44.9.0 and electron-builder 26.15.3 are pinned exactly in `package.json`. `npm run dist:mac` builds one universal `.dmg` (Intel and Apple silicon), `dist:win` an NSIS `.exe`, `dist:linux` a `.tar.gz`. All three build on this Mac with no extra tool.
- The app keeps drafts in its own `localStorage`, under `~/Library/Application Support/Kaviel` on macOS.

---

## 14. The command

```
kaviel run program.kv     run a program
kaviel help                   usage
kaviel version                version
node run.js program.kv    the same run, older habit
```

- Output appears line by line while the program runs.
- Answers are typed and confirmed with Enter; `keypress` waits for the exact key in raw mode, and the terminal is restored afterwards.
- Ctrl+C stops the program and prints `Stopped by you.`
- Exit codes: 0 finished, 1 at least one error, 2 file unreadable or command incomplete, 130 stopped.

The `kaviel` command comes with the desktop app: on first launch the app writes a launcher to `~/.local/bin/kaviel` on macOS and Linux, or `%LOCALAPPDATA%\Kaviel\bin\kaviel.cmd` on Windows, and the app itself is the Node that runs `run.js`. The launcher points at the app, so moving the app means running it once again from the new place. The app also carries a lesson about the terminal, in the three languages, written for the system it finds itself on. It runs programs from any folder: `kaviel run path/to/name.kv`.

---

## 15. The editor

- Run with the button, `Cmd+Enter` or `Ctrl+Enter`. Loading an example or a draft never runs anything.
- While a program runs: **Stop** (or Escape) cancels it; a question opens an answer bar inside Output; a key shows `Press C …` and waits for the real key.
- Output streams as it is printed, including before an answer or a key.
- Problems are buttons; click one to select its source line. Editing clears old marks and marks the output as belonging to the previous run.
- `Tab` two spaces, `Shift+Tab` up to two back, Enter keeps indentation and opens a block after `if`, `else`, `repeat`, `until`, `random`, `define name(...)`.
- `Cmd/Ctrl+F` searches; `?` opens the language guide; **Lessons** opens a side panel with 20 lessons (81 steps, ending in a guided treasure game) and 16 examples; each step loads into the editor, and the previous code is kept for restoring.
- The symbol bar above the code puts `"` `(` `)` `{` `}` `[` `]` `=` `#` `,` where the cursor is: on a French keyboard the curly and square brackets need AltGr, and on a tablet they are missing. A symbol replaces the selected text and marks the file as edited.
- Every lesson step has **Listen**: the browser's own voice reads the title and the text in the language of the site, and the same button stops it. Steps and closing the panel stop the reading. Without a voice on the system the button is not there.
- **Download** in the top bar points at the installer for the system you are on (macOS, Windows, Linux) and names it in its title; on a phone, and inside the desktop app, it is not there. The file names live in one place, `window.KAVIEL_APP` in the head of `kaviel.html`, so moving the installers elsewhere is one line.
- Draft and file name live in `localStorage`; the file name can be renamed in the top bar. New, Open and Save sit in the top bar: Open (or dropping a file on the page) reads `.kv` up to 1 MB without executing it; Save downloads the exact source; `Cmd/Ctrl+S` saves instead of the page. Light/dark theme and text size are remembered.
- Everything is local: no account, no upload, no analytics.

---

## 16. State of the implementation (19 October 2026)

| Check | Result |
|---|---|
| `node test.js` | 112 passed |
| `node v1-test.js` | 72 passed |
| `node cli-test.js` | 20 passed |
| `ide-test.html` in Brave (headless) | 136 passed |
| `npm start` (the real window, Electron 44.9.0) | page, `localStorage`, Run and the hidden Download button verified in the window |
| The built `Kaviel-1.0.0-beta-universal.dmg`, mounted and launched | the same checks pass from `app.asar`, console clean |
| The sixteen examples in `examples/` | all run without errors except `errors.kv`, which is meant to show them |
| Interactive terminal through a real pty | answers, order and final line verified by hand |
| Collatz of 27 | reaches 1; counted from 1 it reads 112 |

`node` on this Mac is `/usr/local/bin/node` (v24.19.0), also reachable from a login shell.

---

## 17. Decisions taken while building

| Thing | Choice | Why |
|---|---|---|
| `print` spacing | a space is added only if there is none already | otherwise `print "steps =" steps` printed two spaces |
| `==` | accepted as `=` | people arrive from Python and C |
| "I skipped lines 8–10" | a **warning** | the real error is already on the header line |
| step limit | error + stop | the only case where a program stops |
| `until` | in v1 | without it, Collatz prints the same line 111 times |
| functions | `define name(args)` + `return` | **Davide's decision** |
| list positions | start at 1 | **Davide's decision** |
| `define ask{1}` with no text | error | **Davide's decision** |
| `under 18` / `over 18` | `< 18` / `> 18` | **Davide's decision**, changed on 20 October 2026 so that they match `<` and `>` |
| `is 18` | `= 18`, and both read a number out of text | **Davide's decision**, 20 October 2026: `is` and `=` now agree on numbers |
| `if cond = name(...)` | the call is an action when the line has no block under it | 20 October 2026: a command of your own had to be written on a separate line, and `if 1 = 2 = greet()` ran `greet` anyway |
| `for each x in list` | three words, one block, no counter | **Davide's decision**, 20 October 2026: the shortest way to walk a list that still reads like English |
| `nothing` printed | an empty line | 20 October 2026: the word `nothing` on screen looked like a value |
| punctuation in `print` | `! ? . , : ;` attach to the word before | 20 October 2026: `Ciao Mario !` was wrong in Italian and French |
| functions before their line | allowed | the specification already promised it, the engine now does it |
| text limit | 1 000 000 characters | a text that doubles itself ran the engine out of memory with no explanation |
| builtins | `length`, `append`, `number`, `upper`, `lower`, `trim`, `part`, `split`, `join` | six of them arrived on 20 October 2026, when text work became the biggest hole |
| `not` | covers the whole comparison after it: `not age = 9` is `not (age = 9)` | Davide asked for it, 19 Oct 2026 |
| unknown word in an expression | the hint also says: put it in quotes to show it as text | a first program often forgets the quotes |

---

## 18. Differences from the original draft

| Original draft | Now | Why |
|---|---|---|
| `define Random value{1} = 67` + `Random{1} = print(...)` | `random 67` + block | two steps to say one thing |
| `Random{1}` usable once → error | impossible to break | the shape forbids it |
| `N{1} = 27` / `set steps{1}` | `define n = 27` / `set n = 28` | one way to assign; braces optional |
| `if` without `else` | `if` / `else` | a hand-written negation hides bugs |
| `print ("x")` and `print "x"` | `print "x"` | one form |
| `= 67%` | `67` | `%` was syntax dressed as a comment |
| `import Random` | no import in v1 | one word less until it loads something real |
| `end` | `end` | it stays: it is the edge of the program |

---

## 19. OPEN

1. `import` with real modules — v1.1 or v2?
3. ~~Whether `nothing` should print as an empty string~~ — decided on 20 October 2026: it does.
