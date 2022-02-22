const { app, BrowserWindow } = require('electron');

require("electron-reload")(__dirname);

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true
  })

  mainWindow.loadFile("app/index.html")
})
