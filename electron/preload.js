/* The page needs two things from the desktop app: the fact that it is the app,
   so the download button stays away, and where the `kaviel` command went.
   Nothing else crosses this bridge. */
const { contextBridge } = require('electron');

const arg = function (name, fallback) {
  const found = process.argv.filter(function (a) { return a.indexOf('--' + name + '=') === 0; })[0] || '';
  const value = found.split('=').slice(1).join('=');
  return value || fallback;
};

let cli = { ok: false };
try { cli = JSON.parse(arg('kaviel-cli', '{}')); } catch (e) { cli = { ok: false }; }

contextBridge.exposeInMainWorld('kavielDesktop', {
  version: arg('kaviel-version', '1.5.0'),
  cli: cli
});
