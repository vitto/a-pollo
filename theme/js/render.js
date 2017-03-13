$(function () {
  window.resizeIframe = function (obj, margin) {
    var marginSet = margin || 0
    obj.style.height = (obj.contentWindow.document.body.scrollHeight + marginSet) + 'px'
  }
})
