# Kaviel — project specification

Living document. Every decision taken lives here; what is still open is marked **OPEN**.
The original hand-written draft is in `draft`, this file replaces it as the reference.

---

## 0. The goal, written once and for all

> The simplest and friendliest programming language in the world: a six-year-old learns it in a few minutes and can write a real program. Errors behave like HTML: the program **never stops**, but **nothing passes in silence**.

Six laws follow from this. If a proposal breaks one of them, the proposal is wrong, not the law.

| # | Law | What it means in practice |
|---|---|---|
| 1 | **It never stops** | a broken line is skipped, the rest runs to `end` |
| 2 | **Nothing is silent** | every error leaves a visible mark, with line and explanation |
| 3 | **Few words** | 10 keywords in v1, not one more |
| 4 | **One thing, one way** | two syntaxes for the same action are a design bug |
| 5 | **It reads as it happens** | indentation is the block, `print "hi"` without brackets, `=` is equality |
| 6 | **The first error is not the last** | you fix every error in one go, not one per run |

Law 6 is what makes the language *fun*: in C you stop at the first error and start again. Here you see at once everything that is wrong, like a browser console.

---

## 1. Shape of a program

```
start
  ...lines...
end
```

- `start` is the first line, `end` the last. One of each.
- If they are missing: everything still runs and a **warning** appears (law 1).
- No other files, no `import` in v1 (see §9).
- Comments: `#` to the end of the line.
- File extension: `.kaviel`.

---

## 2. The words (v1)

| Word | What it does | Example |
|---|---|---|
| `start` / `end` | open and close the program | `start` |
| `print` | shows | `print "hello " name` |
| `define` | creates a thing | `define age = 12` |
| `set` | changes a thing that exists | `set age = age + 1` |
| `if` | runs the block when true | `if age > 10` |
| `else` | otherwise | `else` |
| `repeat` | repeats N times | `repeat 3` |
| `until` | repeats while the condition is false | `until n = 1` |
| `ask` | asks a question, gives back the text | `define name = ask("Your name? ")` |
| `random` | runs **one** of the blocks, with the chances | `random 67` |
| `pick` | picks **one value** at random | `define die = pick 1, 2, 3, 4, 5, 6` |

Numbers, text in `"..."`, `true` / `false`, `nothing` (the empty value).

Operators: `+ - * / %`, and to compare `= != < > <= >=`.
`=` is **only** equality, never assignment: `if x = 1` reads the way a child expects. Assigning is done by `define` and `set`, so `=` is free. (`==` is accepted as a synonym, because people arrive from Python and C.)

---

## 3. Variables and slots `{n}`

The slots idea stays, but **the braces are optional**:

```
define age = 12        # the same as:
define age{1} = 12
```

`age` and `age{1}` are the same thing. Braces are only needed when you want more than one value under the same name (`define points{1}`, `define points{2}`), which is almost never. The cost for a child drops from "you must understand the braces" to zero, and the original syntax survives.

- Reading a name that was never created → **error**, value `nothing`, run continues.
- `define` on a name that already exists → **warning**, the new value wins.
- `set` on a name that never existed → **warning** ("it did not exist, I created it") and creates it.

Names: letters, digits, `_`; they start with a letter. Upper and lower case count.

---

## 4. Blocks and indentation

```
if age > 10
  print "you are big"
else
  print "you are small"
```

- A block is everything indented to the right of the line above. Spaces (a tab counts as 4 spaces).
- Indentation that does not match any open level → **error**, and it snaps to the nearest level (it forgives, but it says so).
- `else` **exists**. Without it, "otherwise" means writing the opposite condition by hand, and a mistake in that negation makes the program do the wrong thing *with no error at all* — the worst case. With `else` the condition is written once.
- `repeat 3` repeats the block. The counter is not reachable in v1: use a variable with `set`.
- `until cond` repeats the block while `cond` is false, checking first.

---

## 5. Random, without slots

The core of the original idea — **chance and behaviour in the same place** — stays, in one single form:

```
random 67
  print "Wow!"
random 33
  print "Damn!"
```

- Consecutive `random` lines (with their blocks) form **one draw**: one wins, the others do not run.
- Two groups separated by any other line = **two independent draws**. This closes the hole in the draft: with `Random{1}` used both as "which random" and "which face", the language could express only one random per program.
- Chances that do not add up to 100 → **warning**, and they are normalised (it does not stop: law 1).
- The draw happens once, when execution reaches the `random` lines. The result is frozen: reading it twice cannot give two different outcomes.

**The "one use" rule disappears as an error because it becomes impossible to break**: a face has no name, so there is no way to attach a second block to it. It was the right rule, solved by shape instead of by a message.

`pick` does the other job — choosing a value, all with equal chance:

```
define die = pick 1, 2, 3
```

In rock-paper-scissors this is worth a lot: `define cpu = pick "rock", "paper", "scissors"` gives back the word, and the map `1 = rock, 2 = paper, 3 = scissors` disappears.

---

## 6. `ask`

```
define name = ask("Your name? ")
print "Hello " name
```

- `ask` writes the question, waits for Enter, gives back what was typed (a text; pressing Enter alone gives `""`).
- The same `ask` line can run more than once (inside a `repeat`).
- With no interface (terminal) `ask` reads from stdin.
- In the editor page the question opens a small window.

---

## 7. Values, conversions, types

Four types: number, text, `true`/`false`, `nothing`.

No declarations: the value decides the type. Conversions are automatic and **generous**, because a child must not have to know what a type is:

| Situation | What happens |
|---|---|
| `print 5` | shows `5` |
| `"hi " + 5` | `hi 5` (a `+` with text glues) |
| `5 + "5"` | `55` (glues, does not add: predictable and explainable) |
| `"a" - 1` | **error**, result `nothing`, run continues |
| `1 / 0` | **error**, result `nothing`, run continues |
| `"rock" = 1` | `false` + **warning** (comparing different types is almost always a bug) |
| `print "a " b` | one space between values, and none if one is already there |

To glue text exactly, with no space added, use `+`: `print "Hi " + name + "!"`.

---

## 8. Errors — the part that matters

### Three levels

| Level | When | What the program does | How you see it |
|---|---|---|---|
| **Error** | the line cannot be understood or cannot run | skips the line and moves on | line marked red + message |
| **Warning** | it runs, but probably not what you wanted | runs | line marked yellow |
| **Hint** | there is a better way | runs | in the panel only |

### What must never happen

- **The program stops halfway.** Never (except the "endless loop" case below).
- **The error disappears.** Never, not one.
- **The error is shown as a traceback.** Never: no `TypeError at line 12`. Only sentences.

### The sentences

The message is a sentence, not a code. Fixed shape:

> **line 7** — I do not know `age`. Did you create it with `define`?
> *Did you mean `age`?*

The "did you mean" is computed by comparing the word written with the keywords and with the names created so far (Levenshtein distance ≤ 2). For a child it is the difference between "wrong" and "I only misspelled it".

### What happens, case by case

| Case | Reaction | Level |
|---|---|---|
| unknown word (`prnt`) | line skipped | error |
| name never created, in a read | value `nothing`, line skipped | error |
| `define` of a name that exists | the new one wins | warning |
| `set` of a name that never existed | creates it | warning |
| indentation out of level | snaps to the nearest level | error |
| `if` block with no body | the block does nothing | warning |
| `if` condition that fails | it counts as false, the block does not run, and it says so | error |
| `random` that does not add up to 100 | normalises | warning |
| division by zero | result `nothing` | error |
| operation on incompatible types | result `nothing` | error |
| empty `ask` | `""` | warning |
| missing `start` / `end` | runs everything | warning |
| **more than 1 000 000 steps** | the program stops | error |
| internal engine error | the program stops | error, with the line |

The last one is the only thing that stops the program, and it is mandatory: a child writes a `repeat` with a wrong `set` and creates an endless loop on the first try. The limit saves them and says what to look at.

### Recovery: how it carries on

The parser does not try to guess inside a broken line: the line becomes a "hole", the error is recorded, and it restarts from the next logical line at the same level or further left.

- If the **header of a block** is broken (`if`, `repeat`, `random`), the whole block is skipped, and it says so: *"I skipped lines 8–10 of the `if` block too"*.
- If an **expression** inside a line is broken, that line skips its action and the other lines are untouched.
- An error never interrupts the analysis: every error in the program is collected, shown together, and only then does execution start.

### Where you see them

```
┌──────────────────────────┬──────────────────────────┐
│  editor                  │  Output      Problems (3)│
│  start                   │                          │
│  define age = 12         │  Hello Davide            │
│  prnt "hello"  ← red     │  ─────────────────────   │
│  end                     │  line 3 · error          │
│                          │  I do not know `prnt`.   │
│                          │  Did you mean `print`?   │
└──────────────────────────┴──────────────────────────┘
```

At the end of every run, one summary line:
`Done · 3 problems (1 error, 2 warnings)`
If there are no problems: `Done · no problems`.

---

## 9. What is not there, on purpose

| Not there | Why | When it comes back |
|---|---|---|
| `import` | with three built-in commands it is a word to learn for nothing | when real modules exist (v0.4) |
| user-defined functions | the biggest absence, but it doubles what must be explained | v0.3 |
| lists | same; rock-paper-scissors shows how much they are missed | v0.3 |
| `while` | `repeat` covers the first programs, `until` covers the loops with a condition | already there as `until` |
| `break` | it needs early exit from a loop | v0.3 |
| `keypress` | it needs event handling, not a concept for the first minutes | v0.2 |
| `else if` | `else` + an indented `if` does the same | maybe never |
| objects / classes | out of reach, and not needed for the goal | — |
| declared types | the value decides the type | — |

---

## 10. Reference examples

They are the tests: each one has an expected output.

### 10.1 One die and one choice

```
start
random 67
  print "Wow!"
random 33
  print "Damn!"
end
```

Output: `Wow!` about 67 times out of 100, `Damn!` the rest. **One** output per run.

### 10.2 Rock, paper, scissors

```
start
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

if you = "paper"
  if cpu = "rock"
    print "I chose rock. You win!"
  if cpu = "scissors"
    print "I chose scissors. You lose."

if you = "scissors"
  if cpu = "rock"
    print "I chose rock. You lose."
  if cpu = "paper"
    print "I chose paper. You win!"

end
```

If you type `Rock` with a capital letter nothing matches and nothing is printed: **no error**, because for the language it is just two different texts. This is the case where being permissive hurts: from here comes the rule that comparing different types gives a warning.

### 10.3 Collatz, with `else`

```
start
define n = 27
define steps = 1

until n = 1
  if n % 2 = 0
    set n = n / 2
  else
    set n = n * 3 + 1
  set steps = steps + 1

print "done in " steps " steps"
end
```

With `else` the condition is written once. `until` stops the moment `n` reaches 1, so it prints once instead of 111 times.

---

## 11. How it is built

```
source text
   │
   ▼
[ lexer ]        logical lines → tokens (NEWLINE, INDENT, DEDENT included)
   │             tab = 4 spaces, brackets and a trailing "\" continue the line
   ▼
[ parser ]       tokens → tree, with recovery: a broken line becomes an "error" node
   │             errors collected in a list, never thrown
   ▼
[ interpreter ]  walks the tree, never stops: every runtime error is "nothing"
   │             budget of 1 000 000 steps
   ▼
output + problems
```

Four files, no dependencies:

| File | Role |
|---|---|
| `engine.js` | lexer + parser + interpreter. **No DOM.** Runs in the browser and in Node |
| `kaviel.html` | editor, Output panel, Problems panel, line marks |
| `test.js` | runs the §10 examples in Node and compares output and problem counts |
| `run.js` | runs a `.kaviel` file from the terminal (`node run.js hello.kaviel`) |

`examples/` holds runnable programs. The engine kept apart from the DOM is what makes it possible to really test the language instead of looking at it.

---

## 12. Roadmap

| Version | What | State |
|---|---|---|
| v0.1 | `start/end`, `print`, `define`, `set`, `if/else`, `repeat`, numbers and text, every error of §8 | **done** |
| v0.2 | `ask`, `random`, `pick`, `until`, `keypress` | done except `keypress` |
| v0.3 | user functions, lists, `break` | to do |
| v0.4 | `import` with real modules | to do |
| beta | final name, ready examples, English-only messages and docs | to do |

---

## 13. OPEN

1. **`keypress`** — how it plugs into the page: a keyword that waits for a key press needs the editor to pause the engine midway. It is the only v0.2 item left.

Everything else that was open is closed: the name is **Kaviel**, `random` uses consecutive lines, `pick` stays, and the whole project (code, messages, docs, page) is in English.

---

## 14. The differences from the original draft

| Original draft | Now | Why |
|---|---|---|
| `define Random value{1} = 67` + `Random{1} = print(...)` | `random 67` + block | two steps to say one thing; and `{n}` did two jobs |
| `Random{1}` usable only once → error | impossible to break | the shape forbids it; a whole class of errors disappears |
| `define N value{1} = 27` / `N{1} = 27` / `set steps{1} = ...` | `define n = 27` / `set n = 28` | two ways to assign; braces are now optional |
| `if` without `else` | `if` / `else` | a hand-written negation is the source of silent bugs |
| `print ("x")` and `print "x"` | `print "x"` | one single form |
| `= 67%` | `67` | the `%` was syntax dressed as a comment |
| `if keypress{1} = Ask{1}` | comparing different types → warning | in the draft that error passed in silence |
| `import Random` | no import in v1 | one word less until it loads something real |
| English-only, from the first file | everywhere | the language, the errors, the page and the docs speak the same language |
| `end` | `end` | it stays: it is the edge of the program |

---

## 15. State of the implementation (19 October 2026)

The engine exists and runs. It is not a mock-up: `engine.js` is a real lexer + parser + interpreter.

### How to use it

```
node test.js                          # every case of §8
node run.js examples/collatz.kaviel     # runs a file, reads answers from stdin
open kaviel.html                        # editor with Output and Problems
```

`node` on this Mac sits in `/usr/local/bin/node`, which is not on the shell PATH: either type the whole path or add `/usr/local/bin` to PATH.

### Editor controls and checks

- Run with the button, `Cmd+Enter` or `Ctrl+Enter`. Restoring a draft or loading an example does not run it automatically.
- `Tab` inserts two spaces; with a selection it indents the selected lines. `Shift+Tab` removes up to two leading spaces. Enter keeps indentation and adds two spaces after a block header.
- Source changes, including indentation, are saved to `localStorage`. Editing clears old problem links and marks output as belonging to the previous run.
- Problems are buttons: click one, or focus it and press Enter, to select its source line.
- Pasted indentation tabs become four spaces, matching the engine. Tabs inside text remain unchanged.
- Output and Problems stay visible, including on narrow screens.

For the browser checks, serve this folder locally (`python3 -m http.server 8765 --bind 127.0.0.1`) and open `http://127.0.0.1:8765/ide-test.html`. The page runs 27 checks and restores the previous saved source afterward. Do not edit another editor tab while these checks run.

### What has been verified

| Check | Result |
|---|---|
| 46 tests in `test.js` | all passing |
| §10 examples (dice, rock-paper-scissors, Collatz) | expected output |
| Collatz of 27 | reaches 1 in 111 computation steps; counted from 1 it reads 112 |
| `random 67/33` over 1000 runs | 600–750 successes (expected ~670) |
| `kaviel.html` in headless Brave | runs, marks the right lines, reaches `end`, shows 3 problems |
| `run.js` with `ask` from stdin | reads the line and carries on |

### Decisions taken while building (they were not in the spec)

| Thing | Choice | Why |
|---|---|---|
| `print "steps = " steps` | a space is added only if there is none already | otherwise it printed `steps =  112` with two spaces; this is the line people write most |
| `==` | accepted as `=` | people arrive from Python and C; refusing it is an error for nothing |
| "I skipped lines 8–10" | a **warning**, not an error | the real error is already marked on the header line; two errors for one slip is noise |
| `if` whose condition fails | one single message (the expression's) | two messages on one line is noise |
| the 1 000 000 step limit | error + program stopped | the only case where a program stops, §8 |
| `until` | implemented early | without it, Collatz prints the same line 111 times |
| `+` with text next to `print` | `+` glues exactly, `print` adds spaces | gives the writer full control with two simple rules |

### What is missing for v1

1. `keypress`.
2. User functions and lists (v0.3): without lists, rock-paper-scissors stays long.
3. `break`, or some way to leave a `repeat` before the end.
