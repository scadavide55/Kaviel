# CLAUDE.md

Working notes for Claude Code in this repository. Read this before touching anything; it says how the project is built, what must not break, and how work is done here.

## What this is

Kaviel is a small programming language with an editor, a terminal command and a desktop app. It is written in plain JavaScript with no build step and no dependencies.

The design goal: a language a child can learn in minutes, where a mistake never stops the program. Errors behave like HTML — a broken line is skipped, the rest runs, and every problem is reported with its line and a sentence. `LANGUAGE.md` holds the specification and the reasoning; where the code and the document disagree, the tests and the code win, and the document must be fixed.

The repository is public. Nothing personal about the owner goes into it.

## Commands

```sh
export PATH="/usr/local/bin:$PATH"   # node is not on the default PATH on this machine

node test.js        # 117  language behaviour and the error table
node v1-test.js     # 72   thresholds, functions, lists, keys, async, cancellation
node cli-test.js    # 37   the command through pipes and signals, and every example
```

The browser suite needs a local server:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 &
"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" --headless --disable-gpu \
  --no-sandbox --dump-dom "http://127.0.0.1:8765/ide-test.html" --virtual-time-budget=150000
```

138 checks must pass. The result is printed at the end of the page as `N passed, M failed`; a single failing check prints its name and, when the check was written with a detail argument, what it saw.

Other tools:

```sh
node tools/sync-examples.js                                  # copy examples/*.kv into kaviel.html
./node_modules/.bin/electron tools/check-desktop-lesson.js   # the app-only lesson still appears
npm install && npm run dist:mac | dist:win | dist:linux      # installers into dist/
sh tools/make-release.sh                                     # the zip
```

All four suites must be green before a commit that touches `engine.js`, `runtime.js`, `kaviel.html`, `editor-ui.js`, the lessons or the examples. A red suite is a broken release: the site is served straight from `main`.

## The map

| File | Role |
|---|---|
| `engine.js` | lexer, parser, `run`, `runAsync`, `tokenize`, `parse`. No interpretation. |
| `runtime.js` | the interpreter: a generator driven by `engine.js`; scopes, functions, lists, keys, limits, cancellation |
| `run.js` | the `kaviel` command: `run`, `help`, `version`, stdin and raw keys |
| `kaviel.html` | the editor page; site entry (`index.html` redirects here); also holds copies of the examples |
| `editor-ui.js`, `editor.css` | highlighting, find, file open/save, output and problems panels |
| `i18n.js` | interface translations, keyed by the English text (en, it, fr) |
| `strings.js` | translations of the quoted text inside examples and lessons |
| `tutorials.js` | the lessons: their code, and the line-by-line explanations |
| `lessons.js` | the lesson texts in the three languages |
| `examples/*.kv` | runnable programs, linked from the editor |
| `electron/` | the desktop app: same page, offline, and it installs the `kaviel` command |
| `tools/` | example sync, desktop lesson check, release zip |

`LANGUAGE.md` is the specification. `ISSUES.md` is the list of known defects with evidence and priority — read it before planning work. `CHANGELOG.md` is what changed in each version.

## Invariants, the ones that break silently

- **The examples exist twice.** `kaviel.html` carries copies of `examples/*.kv` because the page must work from `file://`. After editing an example, run `node tools/sync-examples.js`, or the browser test fails. Adding a new example means four places: the file, the `names` map in `editor-ui.js`, a button in `kaviel.html`, and the placeholder entry the sync tool fills.
- **The version lives in two files** (`engine.js` `VERSION` and `package.json`), and the CI job compares them. The release tag in the download address (`KAVIEL_APP.release` in `kaviel.html`) is a third place.
- **Cache keys are hand-written.** Scripts are loaded as `editor-ui.js?v=1.5.0-N`; after changing a script, bump the number, or browsers keep the old file for ten minutes.
- **The page must stay offline and dependency-free.** No CDN, no analytics, no network call at runtime; the desktop app cancels every http request. New code goes in a file next to the others.
- **The tests are the specification's second copy.** A fix without a test will come back.

## The language rules that are easy to break

Read `LANGUAGE.md` §2–§10 before editing the parser. The ones that have already caused bugs:

- `and`, `or`, `not`, `under`, `over`, `is` are reserved words and matched by token type, never by value. Matching by value made `print "Tom" "and" "Jerry"` print `true`.
- The one-line `if cond = action` takes a keyword or a call as action, but only when **no indented block follows the line**. With a block underneath, `=` is a comparison. `inlineAction()` in `engine.js` decides this; `blockFollows()` is its tie-breaker.
- `pick` parses each choice one precedence level below the comparison, so `if pick 1, 2 = 2` compares the picked value instead of swallowing the `=`.
- Answers are text. `=` and `is`/`under`/`over` read a number out of text; `+` never does.
- Errors are collected and the run continues. The only automatic stop is the 1 000 000 step limit. `error()` returns a sentinel: a statement that reports an error must `return;`, not `return this.error(...)`, or the whole block stops.
- The async engine pauses on elapsed time (12 ms slices), not on every checkpoint: waiting on a 0 ms timer at every checkpoint cost a quarter of a second per program.

## Working here

- Keep code, comments, documentation, commit messages and identifiers in English. The lessons and the interface exist in English, Italian and French; the language itself is English.
- The language's design belongs to the project owner. Propose syntax or semantic changes with options and a recommendation, and wait for a decision. Implementation choices inside that design are yours.
- Run what you write. Every claim in a reply or a changelog must come from a command that ran, a page that opened, or a file that was read; say plainly what was not verified.
- Small commits, messages that say what changed. Do not push, force, rewrite history or publish anything without being asked.
- Do not touch `draft` (the owner's hand-written notes) and keep it out of the repository.
- No secrets, no keys, no personal data anywhere in the repository, the release notes or the commit history.

## When something is unclear

Read `LANGUAGE.md` and `ISSUES.md` first; between them they hold the decisions and the reasons. If the answer is a language decision, ask. If it is an implementation detail, decide, say what you decided in one line, and carry on.
