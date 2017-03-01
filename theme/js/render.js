$(function () {
  var paddingTop = parseInt($('.render__area').css('paddingTop').replace('px', ''))
  var paddingBottom = parseInt($('.render__area').css('paddingBottom').replace('px', ''))
  window.resizeIframe = function (obj) {
    obj.style.height = (obj.contentWindow.document.body.scrollHeight + paddingTop + paddingBottom) + 'px'
  }
})
