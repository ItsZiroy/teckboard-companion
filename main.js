const { app, BrowserWindow } = require("electron");
const { createAuthWindow } = require("./main/auth-process");
const { createAppWindow } = require("./main/app-process");
const authService = require("./services/auth-service");
// Behalten Sie eine globale Referenz auf das Fensterobjekt.
// Wenn Sie dies nicht tun, wird das Fenster automatisch geschlossen,
// sobald das Objekt dem JavaScript-Garbagekollektor übergeben wird.
let win = null;

async function showWindow() {
  require("electron-reload")(__dirname);
  try {
    await authService.refreshTokens();
    win = 1;
    return createAppWindow();
  } catch (err) {
    win = 1;
    createAuthWindow();
  }
}

// Diese Methode wird aufgerufen, wenn Electron mit der
// Initialisierung fertig ist und Browserfenster erschaffen kann.
// Einige APIs können nur nach dem Auftreten dieses Events genutzt werden.
app.on("ready", showWindow);

// Verlassen, wenn alle Fenster geschlossen sind.
app.on("window-all-closed", () => {
  // Unter macOS ist es üblich, für Apps und ihre Menu Bar
  // aktiv zu bleiben, bis der Nutzer explizit mit Cmd + Q die App beendet.
  if(process.platform === "darwin") {
    win = null;
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // Unter macOS ist es üblich ein neues Fenster der App zu erstellen, wenn
  // das Dock Icon angeklickt wird und keine anderen Fenster offen sind.
  if (win === null) {
    showWindow();
  }
});

// In dieser Datei können Sie den Rest des App-spezifischen
// Hauptprozess-Codes einbinden. Sie können den Code auch
// auf mehrere Dateien aufteilen und diese hier einbinden.
