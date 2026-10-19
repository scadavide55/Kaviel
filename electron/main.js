/* The Kaviel desktop app: the same page as the website, opened from disk.
   No build step and no network: every file is local. */
const { app, BrowserWindow, Menu, shell, session } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const PAGE = path.join(__dirname, '..', 'kaviel.html');
const RUNNER = path.join(__dirname, '..', 'run.js');
const BG = '#f7f3ec';

app.setName('Kaviel');

// ---------------------------------------------------------------- the command

// A folder every normal user can write to, without a password.
function binDir() {
  if (process.platform === 'win32') {
    const base = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
    return path.join(base, 'Kaviel', 'bin');
  }
  return path.join(os.homedir(), '.local', 'bin');
}

// The app is its own Node: ELECTRON_RUN_AS_NODE runs run.js with no window.
function launcherText() {
  const exe = process.execPath, runner = RUNNER;
  if (process.platform === 'win32') {
    return '@echo off\r\nsetlocal\r\nset ELECTRON_RUN_AS_NODE=1\r\n"' + exe + '" "' + runner + '" %*\r\n';
  }
  return '#!/bin/sh\n# Kaviel command, written by the Kaviel app.\nexport ELECTRON_RUN_AS_NODE=1\nexec "' +
    exe + '" "' + runner + '" "$@"\n';
}

function installCommand() {
  const dir = binDir();
  const file = path.join(dir, process.platform === 'win32' ? 'kaviel.cmd' : 'kaviel');
  try {
    fs.mkdirSync(dir, {recursive: true});
    fs.writeFileSync(file, launcherText(), {mode: 0o755});
    fs.chmodSync(file, 0o755);
  } catch (e) {
    return {ok: false, file: file, reason: String(e && e.message || e)};
  }
  const parts = (process.env.PATH || '').split(process.platform === 'win32' ? ';' : ':');
  return {ok: true, file: file, dir: dir, onPath: parts.indexOf(dir) >= 0, platform: process.platform};
}

let cli = {ok: false};

function buildMenu() {
  // macOS needs a menu for the usual Cmd+C, Cmd+V and Cmd+Q to work.
  if (process.platform !== 'darwin') return null;
  return Menu.buildFromTemplate([
    {role: 'appMenu'},
    {label: 'Edit', submenu: [{role: 'undo'}, {role: 'redo'}, {type: 'separator'}, {role: 'cut'}, {role: 'copy'}, {role: 'paste'}, {role: 'selectAll'}]},
    {label: 'View', submenu: [{role: 'reload'}, {role: 'toggleDevTools'}, {type: 'separator'}, {role: 'resetZoom'}, {role: 'zoomIn'}, {role: 'zoomOut'}, {type: 'separator'}, {role: 'togglefullscreen'}]},
    {role: 'windowMenu'}
  ]);
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 860,
    minHeight: 560,
    backgroundColor: BG,
    title: 'Kaviel',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
      additionalArguments: ['--kaviel-version=' + app.getVersion(), '--kaviel-cli=' + JSON.stringify(cli)]
    }
  });

  win.once('ready-to-show', function () { win.show(); });
  // Links never leave the app: an outside address opens in the browser instead.
  win.webContents.setWindowOpenHandler(function (details) {
    if (/^https?:/i.test(details.url)) shell.openExternal(details.url);
    return {action: 'deny'};
  });
  win.webContents.on('will-navigate', function (event, url) {
    if (url.split('#')[0].split('?')[0] !== 'file://' + PAGE) event.preventDefault();
  });
  win.loadFile(PAGE);
  return win;
}

app.whenReady().then(function () {
  // Offline for real: nothing in the app reaches the internet.
  session.defaultSession.webRequest.onBeforeRequest(function (details, callback) {
    callback({cancel: /^https?:/i.test(details.url)});
  });
  Menu.setApplicationMenu(buildMenu());
  cli = installCommand();
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
