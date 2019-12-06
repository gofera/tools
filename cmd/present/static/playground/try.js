const saveTextKey = "playground-save-text";
const saveUrlKey = "playground-save-url";

var welcomePageText = "";
var welcomeUrl = window.location.href + "welcome";

var helpShown = false;

document.addEventListener('DOMContentLoaded', function () {
  fetch("welcome/help.html")
    .then(res => {
      res.text().then(body => {
        document.getElementById("helpText").innerHTML = body
      })
    });

  let savedURL = window.localStorage.getItem(saveUrlKey);
  if (savedURL == null || savedURL === "") {
    savedURL = welcomeUrl;
  }
  document.getElementById("resources-path").value = savedURL;

  fetch("welcome/index.slide")
    .then(res => {
      res.text().then(body => {
        welcomePageText = body;
        let savedText = window.localStorage.getItem(saveTextKey);
        if (savedText == null || savedText === "") {
          setToWelcomePage();
        } else {
          document.getElementById("textareaCode").value = savedText;
          submitTryIt();
        }
      })
    })
}, false);

function submitTryIt() {

  let mask = document.getElementById("iframemask");
  mask.style.display = "block";

  var text = document.getElementById("textareaCode").value;
  var url = document.getElementById("resources-path").value;
  var oldIframe = document.getElementById("iframeResult");
  var page = getPage(oldIframe);

  window.localStorage.setItem(saveTextKey, text === welcomePageText ? "" : text);
  window.localStorage.setItem(saveUrlKey, url === welcomeUrl ? "" : url);
  fetch("run?path=" + url, {
    method: "POST",
    body: text,

  }).then(res => {
    res.text().then(txt => {
      let ifr = document.createElement("iframe");
      ifr.setAttribute("frameborder", "0");
      ifr.setAttribute("id", "iframeResult");
      ifr.setAttribute("name", "iframeResult");

      let wrapper = document.getElementById("iframewrapper");
      wrapper.innerHTML = "";
      wrapper.appendChild(ifr);

      let ifrw = (ifr.contentWindow) ? ifr.contentWindow : (ifr.contentDocument.document) ? ifr.contentDocument.document : ifr.contentDocument;
      ifrw.document.open();
      if (page) {
        ifrw.location.hash = "#" + page;
      }
      ifrw.document.write(txt);
      ifrw.document.close();

      mask.style.display = "none";
    });
  })
}

function triggerHelp() {
  var helpPane = document.getElementById("helpPane");
  helpShown = !helpShown;
  if (helpShown)
    helpPane.style.display = "block";
  else
    helpPane.style.display = "none";
}

function revertWelcomePage() {
  let ok = window.confirm("This operation will override your slide context to welcome page. Continue?");
  if (ok) {
    setToWelcomePage();
  }
}

function setToWelcomePage() {
  document.getElementById("textareaCode").value = welcomePageText;
  document.getElementById("resources-path").value = welcomeUrl;
  submitTryIt();
}

function jumpLeft() {
  let area = document.getElementById("textareaCode");
  let currentPage = getPage(document.getElementById("iframeResult")) || 1;
  let text = area.value;
  let lines = text.split("\n");

  let page = 1; // page 1 is home page
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("* ")) {
      page++
    }
    if (page === currentPage) {
      selectTextareaLine(area, i);
      area.scrollTop = area.scrollHeight / lines.length * i - area.clientHeight / 2;
      return;
    }
  }
}

function jumpRight() {
  let area = document.getElementById("textareaCode");
  let targetPos = area.selectionStart;
  let ifr = document.getElementById("iframeResult");
  let ifrw = (ifr.contentWindow) ? ifr.contentWindow : (ifr.contentDocument.document) ? ifr.contentDocument.document : ifr.contentDocument;
  let text = area.value;
  let lines = text.split("\n");

  let page = 0;
  let pos = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("* ")) {
      page++
    }
    pos += lines[i].length + 1;
    if (pos > targetPos) {
      ifrw.openSlide(page);
      return;
    }
  }
}

function getPage(iframe) {
  var page;
  if (iframe) {
    let ifrw = (iframe.contentWindow) ? iframe.contentWindow : (iframe.contentDocument.document) ? iframe.contentDocument.document : iframe.contentDocument;
    page = ifrw.curSlide + 1;
  }
  return page;
}

function selectTextareaLine(tarea, lineNum) {
  var lines = tarea.value.split("\n");

  // calculate start/end
  var startPos = 0, endPos = tarea.value.length;
  for (var x = 0; x < lines.length; x++) {
    if (x == lineNum) {
      break;
    }
    startPos += (lines[x].length + 1);

  }

  var endPos = lines[lineNum].length + startPos;

  // do selection
  // Chrome / Firefox
  if (typeof (tarea.selectionStart) != "undefined") {
    tarea.focus();
    tarea.selectionStart = startPos;
    tarea.selectionEnd = endPos;
    return true;
  }

  // IE
  if (document.selection && document.selection.createRange) {
    tarea.focus();
    tarea.select();
    var range = document.selection.createRange();
    range.collapse(true);
    range.moveEnd("character", endPos);
    range.moveStart("character", startPos);
    range.select();
    return true;
  }

  return false;
}