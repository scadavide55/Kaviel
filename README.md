# Kaviel 1.5
# updated on 20/10/2026 , 1:24AM Rome time

**[Try it in your browser](https://scadavide55.github.io/Kaviel/)** · no install, no account, works offline ·
[Download the desktop app](https://github.com/scadavide55/Kaviel/releases)

Kaviel is a very small programming language. A program reads almost like English, and every line says what it does:

```
start
define ask{1} = ("What is your name? ")
ask{1}
print "Hello" answer{1}
end
```

The editor checks the whole program, shows where something is wrong and keeps going. The language is in [LANGUAGE.md](LANGUAGE.md).

## In the browser

Open `kaviel.html` (or `index.html`, which does the same). Nothing to install: the editor, the lessons and the language all run in the page, and the programs you write stay on your computer.

## The desktop app

The installers are published with each release, not stored in the repository (each one is over 100 MB):

| System | File |
|---|---|
| macOS (Intel and Apple silicon) | `Kaviel-1.0.0-beta-universal.dmg` |
| Windows 10 and 11 | `Kaviel-1.0.0-beta-setup.exe` |
| Linux (64-bit) | `Kaviel-1.5.1-beta-linux-x64.tar.gz` |

To build them yourself, see "Building the installers" below.

The app is the same editor as the one in the browser, with the lessons and examples. It works with no internet connection and sends nothing anywhere.

- **macOS**: open the `.dmg` and drag Kaviel into Applications.
- **Windows**: run the `.exe`; the app installs for your user and puts a shortcut on the desktop.
- **Linux**: unpack the `.tar.gz` and run `Kaviel-1.0.0-beta-linux-x64/kaviel`. If the sandbox complains, run `sudo chown root chrome-sandbox` inside that folder and `chmod 4755 chrome-sandbox`.

The installers are not signed with a paid developer certificate, so the system may warn the first time:

- **macOS**: right-click Kaviel, choose Open, then Open again.
- **Windows**: SmartScreen says "Windows protected your PC" — press More info, then Run anyway.

## On the command line

The command runs on Node.js 20 or newer, with no packages to install. The desktop app installs it for you:

```
node run.js run examples/hello.kv
node run.js help
node run.js version
```

(`kaviel run examples/hello.kv` works the same once `run.js` is on your PATH.)

## What is in this folder

| File | What it is |
|---|---|
| `kaviel.html`, `editor.css`, `editor-ui.js` | the editor page |
| `engine.js` | the language: parser, checker, interpreter |
| `runtime.js` | the values and built-in commands |
| `i18n.js`, `strings.js`, `lessons.js`, `tutorials.js` | the three interface languages and the lessons |
| `run.js` | the command line |
| `examples/` | 16 small programs |
| `test.js`, `v1-test.js`, `cli-test.js`, `ide-test.html` | the tests |
| `electron/`, `build/` | the desktop app and its icon |

Run the tests with `node test.js && node v1-test.js && node cli-test.js`. The page tests run on a local server: `python3 -m http.server 8765 --bind 127.0.0.1`, then open `http://127.0.0.1:8765/ide-test.html`.

## Building the installers

```
npm install
npm run dist:mac     # .dmg, Intel and Apple silicon
npm run dist:win     # .exe installer
npm run dist:linux   # .tar.gz
```

The files land in `dist/`. Then `./tools/make-release.sh` packs this folder and the installers into `dist/Kaviel-1.0.0-beta.zip`.

To try the desktop app without building it: `npm start`.

## License

Kaviel is released under the MIT license: you can use it, change it and share it, as long as this notice stays with it. See [LICENSE](LICENSE).
