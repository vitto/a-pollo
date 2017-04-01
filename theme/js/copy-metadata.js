$(function () {
  var duration = 2000
  var metadataClipboard = new Clipboard('.file__value')

  function messageMetadata (caller, message) {
    var $target = $(caller).closest('.file__item').find('.file__title')
    var title = $target.data('title')
    $target.text(message)
    setTimeout(function () {
      $target.text(title)
    }, duration)
  }

  metadataClipboard.on('success', function (e) {
    e.clearSelection()
    messageMetadata(e.trigger, 'Copied')
  })

  metadataClipboard.on('error', function (e) {
    messageMetadata(e.trigger, 'Copy not supported')
  })
})
