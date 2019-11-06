submitTryIt()

function submitTryIt() {
  var text = document.getElementById("textareaCode").value;

  let wrapper = document.getElementById("iframewrapper");
  wrapper.innerHTML = "";

  let mask = document.createElement("div");
  mask.className = 'lmask';
  mask.id = 'iframemask';
  wrapper.appendChild(mask);

  var ifr = document.createElement("iframe");
  ifr.setAttribute("frameborder", "0");
  ifr.setAttribute("id", "iframeResult");
  ifr.setAttribute("name", "iframeResult");

  wrapper.appendChild(ifr);

  var ifrw = (ifr.contentWindow) ? ifr.contentWindow : (ifr.contentDocument.document) ? ifr.contentDocument.document : ifr.contentDocument;
  ifrw.document.open();
  ifrw.document.write(text);
  ifrw.document.close();
}