submitTryIt();

function submitTryIt() {
  var text = document.getElementById("textareaCode").value;

  let wrapper = document.getElementById("iframewrapper");
  wrapper.innerHTML = "";

  let mask = document.createElement("div");
  mask.className = 'lmask';
  mask.id = 'iframemask';
  wrapper.appendChild(mask);

  fetch("run", {
    method: "POST",
    body: text,
  }).then(res => {
    let ifr = document.createElement("iframe");
    ifr.setAttribute("frameborder", "0");
    ifr.setAttribute("id", "iframeResult");
    ifr.setAttribute("name", "iframeResult");

    wrapper.innerHTML = "";
    wrapper.appendChild(ifr);

    let ifrw = (ifr.contentWindow) ? ifr.contentWindow : (ifr.contentDocument.document) ? ifr.contentDocument.document : ifr.contentDocument;
    ifrw.document.open();
    res.text().then(txt => {
      ifrw.document.write(txt);
      ifrw.document.close();
    });
  })
}