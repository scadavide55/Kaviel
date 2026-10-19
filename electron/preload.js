/* The page needs one thing from the desktop app: the fact that it is the app,
   so the download button stays away. Nothing else crosses this bridge. */
const { contextBridge } = require('electron');

const version = (process.argv.filter(function (arg) {
  return arg.indexOf('--kaviel-version=') === 0;
})[0] || '').split('=')[1] || '1.0.0';

contextBridge.exposeInMainWorld('kavielDesktop', {version: version});
