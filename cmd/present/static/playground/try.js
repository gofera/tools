const saveKey = "playground-save-text";

function submitTryIt() {

  let mask = document.getElementById("iframemask");
  mask.style.display = "block";

  var text = document.getElementById("textareaCode").value;
  window.localStorage.setItem(saveKey, text)
  fetch("run", {
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
      ifrw.document.write(txt);
      ifrw.document.close();

      mask.style.display = "none";
    });
  })
}

document.addEventListener('DOMContentLoaded', function () {
  let savedText = window.localStorage.getItem(saveKey);
  if (savedText == null || savedText === "") {
    fetch("resources/welcome.slides")
      .then(res => {
        res.text().then(body => {
          document.getElementById("textareaCode").value = body;
          submitTryIt();
        })
      })
  } else {
    document.getElementById("textareaCode").value = savedText;
    submitTryIt();
  }
}, false);