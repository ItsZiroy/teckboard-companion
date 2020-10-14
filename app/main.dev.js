/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import "core-js/stable";
import "regenerator-runtime/runtime";
import path from "path";
import { app, BrowserWindow, session } from "electron";
import { autoUpdater } from "electron-updater";
import log from "electron-log";
import authService from "./services/auth-service";
import screenService from "./services/screen-service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import screenAuth from "./screen-auth";

export { screenService, authService, screenAuth };
export default class AppUpdater {
  constructor() {
    log.transports.file.level = "info";
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;

if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === "development" ||
  process.env.DEBUG_PROD === "true"
) {
  require("electron-debug")();
}

const installExtensions = async () => {
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS", "REDUX_DEVTOOLS"];

  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

export const createAppWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, "resources")
    : path.join(__dirname, "../resources");

  const getAssetPath = (...paths) => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  global.axios = require("axios");
  global.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  global.axios.defaults.headers.common.Authorization = `Bearer ${authService.getAccessToken()}`;

  mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    icon: getAssetPath("icon.png"),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on("did-finish-load", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};
export function destroyAppWindow() {
  if (mainWindow) mainWindow.close();
}

const createWindow = async () => {
  if (
    process.env.NODE_ENV === "development" ||
    process.env.DEBUG_PROD === "true"
  ) {
    await installExtensions();
  }

  try {
    await authService.refreshTokens();
    createAppWindow();
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    createAuthWindow();
  }
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

if (process.env.E2E_BUILD === "true") {
  // eslint-disable-next-line promise/catch-or-return
  app.whenReady().then(createWindow);
} else {
  app.on("ready", createWindow);
}

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

let win = null;

export function destroyAuthWin() {
  if (!win) return;
  win.close();
  win = null;
}

export async function createLogoutWindow() {
  await authService.logout();
  await screenService.logout();
  await session.defaultSession.clearStorageData();
  destroyAppWindow();
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  createAuthWindow();
}
export function createAuthWindow() {
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
