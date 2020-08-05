const { BrowserWindow, session } = require("electron");
const authService = require("../services/auth-service");
const { createAppWindow, destroyAppWindow } = require("./app-process");
const screenService = require("../services/screen-service");

let win = null;

function createAuthWindow() {
  destroyAuthWin();

  win = new BrowserWindow({
    width: 500,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
    },
  });

  win.loadURL(authService.getAuthenticationURL());

  const {
    session: { webRequest },
  } = win.webContents;

  const filter = {
    urls: ["http://localhost/callback*"],
  };

  webRequest.onBeforeRequest(filter, async ({ url }) => {
    await authService.loadTokens(url);
    createAppWindow();
    return destroyAuthWin();
  });

  win.on("closed", () => {
    win = null;
  });
}

function destroyAuthWin() {
  if (!win) return;
  win.close();
  win = null;
}

async function createLogoutWindow() {
    await authService.logout();
    await screenService.logout();
    await session.defaultSession.clearStorageData();
    destroyAppWindow();
    createAuthWindow();
}

module.exports = {
  createAuthWindow,
  createLogoutWindow,
};
