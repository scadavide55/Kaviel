#!/usr/bin/env node
/* Regenerates the copies of examples/*.kv that live inside kaviel.html.
   The page must work without a server, so the samples are inline; this script
   keeps them identical to the files. Run it after changing an example:
     node tools/sync-examples.js                                            */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'kaviel.html');
const uiPath = path.join(root, 'editor-ui.js');

const ui = fs.readFileSync(uiPath, 'utf8');
const mapMatch = ui.match(/var names = \{([^}]*)\}/);
if (!mapMatch) throw new Error('Cannot find the example names in editor-ui.js');
const map = {};
for (const pair of mapMatch[1].split(',')) {
  const [key, file] = pair.split(':').map(s => s.trim().replace(/['"]/g, ''));
  if (key && file) map[key] = file;
}

function blockFor(file) {
  const lines = fs.readFileSync(path.join(root, 'examples', file), 'utf8').split('\n');
  if (lines.length && lines[lines.length - 1] === '') lines.pop();
  return lines.map(line => "'" + line.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "\\n'").join(' +\n');
}

const lines = fs.readFileSync(htmlPath, 'utf8').split('\n');
let changed = 0;

for (const [key, file] of Object.entries(map)) {
  if (!fs.existsSync(path.join(root, 'examples', file))) continue;
  const at = lines.indexOf('    ' + key + ':');
  if (at < 0) { console.log('missing entry: ' + key); continue; }

  let end = at + 1;
  while (end < lines.length && !/^'.*',$/.test(lines[end]) && !/^'[^']*'$/.test(lines[end])) end++;
  if (end >= lines.length) { console.log('cannot find the end of ' + key); continue; }

  const wanted = blockFor(file).split('\n');
  if (/,$/.test(lines[end])) wanted[wanted.length - 1] += ',';
  const current = lines.slice(at + 1, end + 1);
  if (current.join('\n') !== wanted.join('\n')) {
    lines.splice(at + 1, end - at, ...wanted);
    changed++;
  }
}

fs.writeFileSync(htmlPath, lines.join('\n'));
console.log(changed ? 'updated ' + changed + ' example(s)' : 'all examples already in sync');
