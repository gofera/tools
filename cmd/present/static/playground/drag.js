var dragging = false;

function fixDragBtn() {
  var textareawidth, leftpadding, dragleft, containertop, buttonwidth
  var containertop = Number(getStyle(document.getElementById("container"), "top").replace("px", ""));
  let dragbar = document.getElementById("dragbar");
  dragbar.style.width = "5px";
  textareasize = Number(getStyle(document.getElementById("textareawrapper"), "width").replace("px", ""));
  leftpadding = Number(getStyle(document.getElementById("textarea"), "padding-left").replace("px", ""));
  buttonwidth = Number(getStyle(dragbar, "width").replace("px", ""));
  textareaheight = getStyle(document.getElementById("textareawrapper"), "height");
  dragleft = textareasize + leftpadding + (leftpadding / 2) - (buttonwidth / 2);
  dragbar.style.top = containertop + "px";
  dragbar.style.left = dragleft + "px";
  dragbar.style.height = textareaheight;
  dragbar.style.cursor = "col-resize";

}

function dragstart(e) {
  e.preventDefault();
  dragging = true;
  var main = document.getElementById("iframecontainer");
}

function dragmove(e) {
  if (dragging) {
    document.getElementById("shield").style.display = "block";
    var percentage = (e.pageX / window.innerWidth) * 100;
    if (percentage > 5 && percentage < 98) {
      var mainPercentage = 100 - percentage;
      document.getElementById("textareacontainer").style.width = percentage + "%";
      document.getElementById("iframecontainer").style.width = mainPercentage + "%";
      fixDragBtn();
    }
  }
}

function dragend() {
  document.getElementById("shield").style.display = "none";
  dragging = false;
  var vend = navigator.vendor;
  if (window.editor && vend.indexOf("Apple") == -1) {
    window.editor.refresh();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  if (window.addEventListener) {
    document.getElementById("dragbar").addEventListener("mousedown", function (e) {
      dragstart(e);
    });
    document.getElementById("dragbar").addEventListener("touchstart", function (e) {
      dragstart(e);
    });
    window.addEventListener("mousemove", function (e) {
      dragmove(e);
    });
    window.addEventListener("touchmove", function (e) {
      dragmove(e);
    });
    window.addEventListener("mouseup", dragend);
    window.addEventListener("touchend", dragend);
    window.addEventListener("load", fixDragBtn);
    window.addEventListener("resize", fixDragBtn);
  }
}, false);

function getStyle(el, styleProp) {
  var value, defaultView = (el.ownerDocument || document).defaultView;
  // W3C standard way:
  if (defaultView && defaultView.getComputedStyle) {
    // sanitize property name to css notation
    // (hypen separated words eg. font-Size)
    styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
    return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
  } else if (el.currentStyle) { // IE
    // sanitize property name to camelCase
    styleProp = styleProp.replace(/\-(\w)/g, function (str, letter) {
      return letter.toUpperCase();
    });
    value = el.currentStyle[styleProp];
    // convert other units to pixels on IE
    if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
      return (function (value) {
        var oldLeft = el.style.left, oldRsLeft = el.runtimeStyle.left;
        el.runtimeStyle.left = el.currentStyle.left;
        el.style.left = value || 0;
        value = el.style.pixelLeft + "px";
        el.style.left = oldLeft;
        el.runtimeStyle.left = oldRsLeft;
        return value;
      })(value);
    }
    return value;
  }
}