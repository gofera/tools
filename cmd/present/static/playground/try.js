const saveTextKey = "playground-save-text";
const saveUrlKey = "playground-save-url";

var welcomePageText = "";
var helpShown = false;

function submitTryIt() {

  let mask = document.getElementById("iframemask");
  mask.style.display = "block";

  var text = document.getElementById("textareaCode").value;
  var url = document.getElementById("resources-path").value;
  var oldIframe = document.getElementById("iframeResult");
  var page;
  if (oldIframe) {
    let ifrw = (oldIframe.contentWindow) ? oldIframe.contentWindow : (oldIframe.contentDocument.document) ? oldIframe.contentDocument.document : oldIframe.contentDocument;
    page = ifrw.curSlide + 1;
  }

  window.localStorage.setItem(saveTextKey, text);
  window.localStorage.setItem(saveUrlKey, url);
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
  document.getElementById("resources-path").value = window.location.href + "welcome";
  submitTryIt();
}

document.addEventListener('DOMContentLoaded', function () {
  fetch("welcome/help.html")
    .then(res => {
      res.text().then(body => {
        document.getElementById("helpText").innerHTML = body
      })
    });

  let savedURL = window.localStorage.getItem(saveUrlKey);
  if (savedURL == null || savedURL === "") {
    savedURL = window.location.href + "welcome";
  }
  document.getElementById("resources-path").value = savedURL;
  let savedText = window.localStorage.getItem(saveTextKey);
  if (savedText == null || savedText === "") {
    fetch("welcome/index.slide")
      .then(res => {
        res.text().then(body => {
          welcomePageText = body;
          setToWelcomePage();
        })
      })
  } else {
    document.getElementById("textareaCode").value = savedText;
    submitTryIt();
  }
}, false);