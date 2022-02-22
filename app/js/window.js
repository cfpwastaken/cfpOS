const windows = [];
const TABLETMODE = false;

function dragElement(el) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (el.getElementsByClassName("bar")[0]) {
    el.getElementsByClassName("bar")[0].onmousedown = dragMouseDown;
  } else {
    el.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
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

// promise sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fdd").addEventListener("click", async () => {
    const el = createLoadingWindow("https://winaero.com/blog/wp-content/uploads/2020/09/Windows-10-Settings-gear-icon-colorful-256-big.png",
      "Settings");
    addWindow(el);
    await sleep(2000);
    undrag(el);
    removeWindow(el);
    windowLoadFinish(el, "Settings");
    addWindow(el);
  });
});