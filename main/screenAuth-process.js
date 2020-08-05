const { BrowserWindow } = require("electron");
const screenService = require("../services/screen-service");
const { createAppWindow } = require("./app-process");

let win = null;

function createAuthWindow(callback = undefined) {
  destroyAuthWin();

  win = new BrowserWindow({
    width: 500,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  });

  win.loadURL(screenService.getAuthenticationURL());
  win.on("closed", () => {
    win = null;
  });
  const {
    session: { webRequest },
  } = win.webContents;

  const filter = {
    urls: ["http://localhost/callback*"],
  };

  webRequest.onBeforeRequest(filter, async ({ url }) => {
    await screenService.loadTokens(url);
    callback();
    return destroyAuthWin();
  });
}

function destroyAuthWin() {
  if (!win) return;
  win.close();
  win = null;
}

module.exports = {
  createAuthWindow,
};
