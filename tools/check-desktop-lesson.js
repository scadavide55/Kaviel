/* Checks the app-only lesson without opening a visible window:
   node_modules/.bin/electron tools/check-desktop-lesson.js                */
const { app, BrowserWindow } = require('electron');
const path = require('path');

app.whenReady().then(async function () {
  const win = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'electron', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      additionalArguments: ['--kaviel-version=1.5.0', '--kaviel-cli=' + JSON.stringify({ ok: true, dir: '/Users/davide/.local/bin', onPath: true, platform: 'darwin' })]
    }
  });
  await win.loadFile(path.join(__dirname, '..', 'kaviel.html'));
  const result = await win.webContents.executeJavaScript(`(function () {
    var T = window.KavielTutorials || [];
    var last = T[T.length - 1] || {};
    return {
      desktop: !!window.kavielDesktop,
      cli: window.kavielDesktop && window.kavielDesktop.cli,
      lessons: T.length,
      lastTitle: last.title,
      steps: (last.steps || []).length,
      firstText: (last.steps && last.steps[0] && last.steps[0].text || '').slice(0, 60)
    };
  })()`);
  console.log(JSON.stringify(result, null, 2));
  app.quit();
});
