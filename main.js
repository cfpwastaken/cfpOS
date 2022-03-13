const { app, BrowserWindow, ipcMain } = require('electron');
const { existsSync } = require("fs");

// require("electron-reload")(__dirname);

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      webSecurity: false
    },
    kiosk: true
  })
  if(existsSync(".dev")) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile("app/index.html")
})

ipcMain.on("reload", () => {
  app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) })
  app.exit(0)
})

ipcMain.on("exit", () => {
  app.exit(0)
})