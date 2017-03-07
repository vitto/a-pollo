$(function () {

  var duration = 2000
  var colorClipboard = new Clipboard('.copy-snippet')

  function messageColor (caller, message) {
    var $target = $(caller)
    var title = $target.data('title')
    $target.text(message)
    setTimeout(function () {
      $target.text(title)
    }, duration)
  }

  colorClipboard.on('success', function (e) {
    e.clearSelection()
    messageColor(e.trigger, 'Copied successfully')
  })

  colorClipboard.on('error', function (e) {
    messageColor(e.trigger, 'Copy error')
  })
})
