const { BrowserWindow } = require("electron");
const authService = require('../services/auth-service');
let win = null;

function createAppWindow() {
    // Erstellen des Browser-Fensters.
    win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
      icon: __dirname + "public/images/teckboard-logo-orange.png",
      // hasShadow: false,
      backgroundColor: "#fff",
    });
    global.axios = require("axios");
    global.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
    global.axios.defaults.headers.common["Authorization"] = "Bearer " + authService.getAccessToken();

  
    // und lade die index.html der App.
    win.loadFile("./index.html");
  
    // Öffnen der DevTools.
    // win.webContents.openDevTools();
  
    // Ausgegeben, wenn das Fenster geschlossen wird.
    win.on("closed", () => {
      // Dereferenzieren des Fensterobjekts, normalerweise würden Sie Fenster
      // in einem Array speichern, falls Ihre App mehrere Fenster unterstützt.
      // Das ist der Zeitpunkt, an dem Sie das zugehörige Element löschen sollten.
      win = null;
    });
}
module.exports = createAppWindow