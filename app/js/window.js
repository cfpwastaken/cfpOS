const { ipcRenderer } = require("electron");

const windows = [];
let focusedWindow = null;
const fs = require("fs");
if(!fs.existsSync("config.json")) {
  fs.writeFileSync("config.json", JSON.stringify({
    tablet: false
  }));
}
const config = require("../config.json");
const TABLETMODE = config.tablet;

function dragElement(el) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (el.getElementsByClassName("bar")[0]) {
    el.getElementsByClassName("bar")[0].onmousedown = dragMouseDown;
  } else {
    el.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    focusedWindow = el;
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    el.style.zIndex = 2;
    for (let i = 0; i < windows.length; i++) {
      if (windows[i] != el) {
        windows[i].style.zIndex = 1;
      }
    }
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    el.style.top = (el.offsetTop - pos2) + "px";
    el.style.left = (el.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function startApp(name) {
  if(TABLETMODE) unshowStart();
  const app = require("../apps/" + name + "/init.js");
  const win = createLoadingWindow(app.icon, app.name);
  addWindow(win);
  app.start((status) => {
    console.log("STATUS");
    win.getElementsByTagName("h2")[0].innerText = status;
  },() => {
    console.log("FINISH");
    document.onmouseup = null;
    document.onmousemove = null;
    undrag(win);
    removeWindow(win);
    windowLoadFinish(win, app.name);
    addWindow(win);
    const iframe = document.createElement("webview");
    iframe.addEventListener('console-message', (e) => {
      console.log("[" + app.name + "]", e.message)
    })
    iframe.nodeintegration = true;
    iframe.webpreferences =  "contextIsolation=false, webSecurity=false";
    iframe.src = "../apps/" + name + "/index.html";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    win.appendChild(iframe);
  },() => {
    console.log("ERROR");
    deleteWindow(win);
    // startApp("../error")
  });
  // const el = createLoadingWindow("https://winaero.com/blog/wp-content/uploads/2020/09/Windows-10-Settings-gear-icon-colorful-256-big.png",
  //   "Settings");
  // addWindow(el);
  // await sleep(2000);
  // undrag(el);
  // removeWindow(el);
  // windowLoadFinish(el, "Settings");
  // addWindow(el);
}

function getApps() {
  const dirs = fs.readdirSync("apps");
  const apps = [];
  for (let i = 0; i < dirs.length; i++) {
    if (fs.existsSync("apps/" + dirs[i] + "/init.js")) {
      const app = require("../apps/" + dirs[i] + "/init.js");
      apps.push({dir: dirs[i], name: app.name, icon: app.icon});
    }
  }
  return apps;
}

function addWindow(el) {
  windows.push(el);
  if(!TABLETMODE) dragElement(el);
  if(el.getElementsByClassName("bar")[0]) {
    if(!TABLETMODE) {
      el.getElementsByClassName("bar")[0].getElementsByClassName("controls")[0].getElementsByClassName("maximize")[0].addEventListener("click", () => {
        maximizeWindow(el);
      })
    }
    el.getElementsByClassName("bar")[0].getElementsByClassName("controls")[0].getElementsByClassName("close")[0].addEventListener("click", () => {
      deleteWindow(el);
    })
  }
  if(TABLETMODE) maximizeWindow(el);
}

function undrag(el) {
  if (el.getElementsByClassName("bar")[0]) {
    el.getElementsByClassName("bar")[0].onmousedown = null;
  } else {
    el.onmousedown = null;
  }
}

async function deleteWindow(el) {
  removeWindow(el);
  el.classList.add("window-close");
  if(TABLETMODE) showStart();
  await sleep(310);
  el.remove();
}

function removeWindow(el) {
  for (let i = 0; i < windows.length; i++) {
    if (windows[i] == el) {
      windows.splice(i, 1);
    }
  }
}

function maximizeWindow(el) {
  if(el.style.width == "100%") {
    el.style.width = "580px";
    el.style.height = "350px";
    el.style.top = "50%";
    el.style.left = "50%";
  } else {
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.top = "0px";
    el.style.left = "0px";
  }
}

function createWindowFromDiv(window, imgsrc, nametext) {
  window.classList.add("window");
  window.classList.add("fluent-blur");
  window.classList.add("fluent-blur-dark");
  window.classList.add("fluent-blur");
  window.style.width = "580px";
  window.style.height = "350px";

  const bar = document.createElement("div");
  bar.classList.add("bar");
  window.appendChild(bar);

  const img = document.createElement("img");
  img.src = imgsrc;
  img.classList.add("icon");
  bar.appendChild(img);

  const name = document.createElement("p");
  name.innerText = nametext;
  bar.appendChild(name);

  const controls = document.createElement("div");
  controls.classList.add("controls");
  bar.appendChild(controls);

  if(!TABLETMODE) {
    const minimize = document.createElement("a");
    minimize.classList.add("control");
    minimize.classList.add("minimize");
    minimize.innerText = "_";
    controls.appendChild(minimize);

    const maximize = document.createElement("a");
    maximize.classList.add("control");
    maximize.classList.add("maximize");
    maximize.innerText = "O";
    controls.appendChild(maximize);
  }

  const close = document.createElement("a");
  close.classList.add("control-close");
  close.classList.add("close");
  close.innerText = "X";
  controls.appendChild(close);

  return window;
}

function createWindow(imgsrc, nametext) {
  const window = document.createElement("div");
  window.style.top = "0px";
  window.style.left = "0px";
  document.body.insertBefore(document.getElementById("taskbar"), window);
  
  return createWindowFromDiv(window, imgsrc, nametext);
}

function createLoadingWindow(imgsrc, statustext) {
  const window = document.createElement("div");
  window.classList.add("window-loading");
  window.classList.add("fluent-blur");
  window.classList.add("fluent-blur-dark");
  window.style.top = "0px";
  window.style.left = "0px";
  document.body.insertBefore(window, document.getElementById("taskbar"));

  const img = document.createElement("img");
  img.src = imgsrc;
  img.classList.add("icon-loading");
  window.appendChild(img);

  const status = document.createElement("h2");
  status.innerText = statustext;
  window.appendChild(status);

  return window;
}

function windowLoadFinish(window, nametext) {
  const imgsrc = window.getElementsByClassName("icon-loading")[0].src;
  while (window.firstChild) {
    window.removeChild(window.firstChild);
  }
  window.classList.remove("window-loading");
  window.classList.remove("fluent-blur");
  window.classList.remove("fluent-blur-dark");
  return createWindowFromDiv(window, imgsrc, nametext);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function showStart() {
  const start = document.createElement("div");
  start.id = "start";
  document.body.appendChild(start);

  const apps = getApps();
  for (let i = 0; i < apps.length; i++) {
    const app = document.createElement("div");
    app.classList.add("start-app");
    document.getElementById("start").appendChild(app);

    const img = document.createElement("img");
    img.src = apps[i].icon;
    img.style.width = "150px";
    img.addEventListener("click", async () => {
      startApp(apps[i].dir);
    });
    app.appendChild(img);

    const name = document.createElement("span");
    console.log(apps[i]);
    name.innerText = apps[i].name;
    name.classList.add("start-text");
    app.appendChild(name);
  }
}

function unshowStart() {
  document.getElementById("start").remove();
}

document.addEventListener("DOMContentLoaded", () => {
  if(!TABLETMODE) {
    document.body.id = "html_taskbar";
    const taskbar = document.createElement("div");
    taskbar.id = "taskbar";
    document.body.appendChild(taskbar);

    const apps = getApps();
    for (let i = 0; i < apps.length; i++) {
      const app = document.createElement("div");
      app.classList.add("taskbar-app");
      taskbar.appendChild(app);

      const img = document.createElement("img");
      img.src = apps[i].icon;
      img.style.width = "50px";
      img.addEventListener("click", async () => {
        startApp(apps[i].dir);
      });
      app.appendChild(img);
    }

    // const img = document.createElement("img");
    // img.src = "https://winaero.com/blog/wp-content/uploads/2020/09/Windows-10-Settings-gear-icon-colorful-256-big.png";
    // img.style.width = "50px";
    // img.addEventListener("click", async () => {
    //   const el = createLoadingWindow("https://winaero.com/blog/wp-content/uploads/2020/09/Windows-10-Settings-gear-icon-colorful-256-big.png",
    //     "Settings");
    //   addWindow(el);
    //   await sleep(2000);
    //   undrag(el);
    //   removeWindow(el);
    //   windowLoadFinish(el, "Settings");
    //   addWindow(el);
    // });
    // taskbar.appendChild(img);
  } else {
    document.body.id = "html_start";
    showStart();
  }

  if(fs.existsSync(".dev")) {
    const dev = fs.readFileSync(".dev", "utf8");
    startApp(dev);
  }
});

window.addEventListener("beforeunload", (e) => {
  console.log(e);
  e.returnValue = false;
  if(focusedWindow) {
    deleteWindow(focusedWindow);
  } else {
    console.log("No focused window");
  }
});