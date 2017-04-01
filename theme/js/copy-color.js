$(function () {
  var duration = 2000
  var colorClipboard = new Clipboard('.color-value__item-copy')

  function messageColor (caller, message) {
    var $target = $(caller).closest('.color-value').find('.color-value__title')
    var title = $target.data('title')
    $target.text(message)
    setTimeout(function () {
      $target.text(title)
    }, duration)
  }

  colorClipboard.on('success', function (e) {
    e.clearSelection()
    messageColor(e.trigger, 'Copied')
  })

  colorClipboard.on('error', function (e) {
    messageColor(e.trigger, 'Copy not supported')
  })

  var colorVarClipboard = new Clipboard('.color__var')

  function messageColorVar (caller, message) {
    var $target = $(caller).closest('.color__header').find('.color__title')
    var title = $target.data('title')
    $target.text(message)
    setTimeout(function () {
      $target.text(title)
    }, duration)
  }

  colorVarClipboard.on('success', function (e) {
    e.clearSelection()
    messageColorVar(e.trigger, 'Copied')
  })

  colorVarClipboard.on('error', function (e) {
    messageColorVar(e.trigger, 'Copy not supported')
  })
})
