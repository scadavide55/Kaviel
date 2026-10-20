# Kaviel

A very small programming language, made to teach **how code thinks** before anyone learns a big one.

**[Try it in your browser](https://scadavide55.github.io/Kaviel/)** · no install, no account, works offline ·
[Download the desktop app](https://github.com/scadavide55/Kaviel/releases/latest)

```
define pets = ["cat", "dog", "fox"]
for each pet in pets
  print upper(pet)
end
```

## Why it exists

Kaviel is a first step, not a replacement for Python. It is for someone who has never written code and wants to understand the ideas first: a box that holds a value, a choice, a loop, a command of your own. When those make sense, going on to Python (or anything else) is the natural next move.

It has three ideas that were chosen on purpose:

- **A mistake never stops the program.** A broken line is skipped, the rest runs, and every problem is shown with its line number and one plain sentence. It works like HTML, which shows a page even when a tag is wrong.
- **Nothing is silent.** A skipped line always leaves a visible mark, so the program is forgiving without hiding the problem.
- **The lessons explain every line.** Each step of each lesson shows a small program with a short note beside every line, what you will see when it runs, and a small job to try. They exist in English, Italian and French.

## What it is not

Being honest about this matters more than selling it:

- It has **no libraries**, no packages and no way to talk to the internet or to files yet. Python is far more useful for real work, and it is the right language to learn next.
- It has **not been tested with real beginners yet**. The lessons were written for a child to follow alone, but nobody has done that while someone watched and took notes. Until then "easy to learn" is a goal, not a result. If you try it with someone, please [open an issue](https://github.com/scadavide55/Kaviel/issues) and say where they got stuck.
- Some choices are open to debate, for example the word `define`. They are listed in [ISSUES.md](ISSUES.md) and in the "OPEN" part of [LANGUAGE.md](LANGUAGE.md).

## How it is made

The design (the rules of the language, what to include and what to leave out) is the author's. Most of the code was written with the help of an AI assistant, Claude, and every change is checked by four test suites before it is published. The decisions and their reasons are written down in [LANGUAGE.md](LANGUAGE.md).

## A taste of the language

```
define ask{1} = ("What is your name? ")
ask{1}
define name = answer{1}

define monster{hp} = 10
set monster{hp} = monster{hp} - random(1, 6)

if monster{hp} < 1
  print name "wins!"
else
  print "The monster has" monster{hp} "life left."
end
```

- `define` makes a box, `set` changes it. A box can hold text, numbers, `true` or `false`, a list, or `nothing`.
- Indentation is the block: no braces, no colons.
- Answers are always text. `=` and the words `under`, `over` and `is` read a number out of text for you.
- `monster{hp}` is a named part of a thing, and `random(1, 6)` is a die.

The whole language, with the reasons for each choice, is in [LANGUAGE.md](LANGUAGE.md). What changed in each version is in [CHANGELOG.md](CHANGELOG.md).

## In the browser

Open the site above, or open `kaviel.html` (or `index.html`, which does the same) from this folder. Nothing to install: the editor, the lessons and the language all run in the page, and the programs you write stay on your computer. The page makes no network calls.

## The desktop app

The installers are published with each release, not stored in the repository (each one is over 100 MB):

| System | File |
|---|---|
| macOS (Intel and Apple silicon) | `Kaviel-1.5.1-beta-universal.dmg` |
| Windows 10 and 11 | `Kaviel-1.5.1-beta-setup.exe` |
| Linux (64-bit) | `Kaviel-1.5.1-beta-linux-x64.tar.gz` |

The app is the same editor as the one in the browser, with the lessons and examples, plus one extra lesson about the terminal. It works with no internet connection and sends nothing anywhere. On first launch it also installs the `kaviel` command (see below).

- **macOS**: open the `.dmg` and drag Kaviel into Applications.
- **Windows**: run the `.exe`; the app installs for your user and puts a shortcut on the desktop.
- **Linux**: unpack the `.tar.gz` and run `kaviel` inside the folder. If the sandbox complains, run `sudo chown root chrome-sandbox` and `chmod 4755 chrome-sandbox` inside that folder.

The Windows and Linux installers have been built but not yet launched on those systems by the author, so the first launch there is untested. The installers are not signed with a paid developer certificate, so the system may warn the first time:

- **macOS**: right-click Kaviel, choose Open, then Open again.
- **Windows**: SmartScreen says "Windows protected your PC": press More info, then Run anyway.

## On the command line

The app installs a `kaviel` command (`~/.local/bin/kaviel` on macOS and Linux, `%LOCALAPPDATA%\Kaviel\bin\kaviel.cmd` on Windows):

```
kaviel run examples/hello.kv
kaviel help
kaviel version
```

Without the app, the same commands run with Node.js 20 or newer and no packages to install: `node run.js run examples/hello.kv`.

## What is in this folder

| File | What it is |
|---|---|
| `kaviel.html`, `editor.css`, `editor-ui.js` | the editor page |
| `engine.js`, `runtime.js` | the language: parser, then the interpreter with its values and built-in commands |
| `i18n.js`, `strings.js`, `lessons.js`, `tutorials.js` | the three interface languages and the lessons |
| `run.js` | the command line |
| `examples/` | 17 programs, from `hello.kv` to a small game and a tiny computer written in Kaviel |
| `test.js`, `v1-test.js`, `cli-test.js`, `ide-test.html` | the four test suites |
| `electron/`, `build/`, `tools/` | the desktop app, its icon, and the build and release scripts |

Run the tests with `node test.js && node v1-test.js && node cli-test.js`. The page tests run on a local server: `python3 -m http.server 8765 --bind 127.0.0.1`, then open `http://127.0.0.1:8765/ide-test.html`.

## Building the installers

```
npm install
npm run dist:mac     # .dmg, Intel and Apple silicon
npm run dist:win     # .exe installer
npm run dist:linux   # .tar.gz
```

The files land in `dist/`. Then `sh tools/make-release.sh` packs this folder and the installers into a zip. To try the desktop app without building it: `npm start`.

## Feedback

Questions, mistakes in a lesson, or a place where someone got stuck are the most useful things you can send: [open an issue](https://github.com/scadavide55/Kaviel/issues).

## License

Kaviel is released under the MIT license: you can use it, change it and share it, as long as this notice stays with it. See [LICENSE](LICENSE).
