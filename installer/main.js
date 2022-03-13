const { app } = require('electron');
const glasstron = require("glasstron");

app.commandLine.appendSwitch("enable-transparent-visuals");
app.on("ready", () => {
  setTimeout(spawnWindow, process.platform == "linux" ? 1000 : 0);
})

function spawnWindow() {
  const win = new glasstron.BrowserWindow({
    width: 800,
    height: 600,
  });
  win.removeMenu();
  win.blurType = "acrylic";
  win.setBlur(true);

  win.loadFile("index.html");
}
