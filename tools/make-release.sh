#!/bin/sh
# Packs Kaviel into dist/Kaviel-<version>-beta.zip:
# the editor, the language, the command line, the examples and the installers.
set -e
cd "$(dirname "$0")/.."

VERSION=$(node -p "require('./package.json').version")
NAME="Kaviel-$VERSION-beta"
DMG="Kaviel-$VERSION-beta-universal.dmg"
EXE="Kaviel-$VERSION-beta-setup.exe"
TGZ="Kaviel-$VERSION-beta-linux-x64.tar.gz"

for file in "$DMG" "$EXE" "$TGZ"; do
  if [ ! -f "dist/$file" ]; then
    echo "Missing dist/$file. Run npm run dist first." >&2
    exit 1
  fi
done

rm -rf "dist/$NAME" "dist/$NAME.zip"
mkdir -p "dist/$NAME/application"
cp index.html kaviel.html editor.css editor-ui.js engine.js i18n.js lessons.js runtime.js strings.js tutorials.js run.js README.md LANGUAGE.md LICENSE CHANGELOG.md package.json "dist/$NAME/"
cp -R examples "dist/$NAME/examples"
cp "dist/$DMG" "dist/$EXE" "dist/$TGZ" "dist/$NAME/application/"

(cd dist && zip -rXq "$NAME.zip" "$NAME")
rm -rf "dist/$NAME"
ls -lh "dist/$NAME.zip"
