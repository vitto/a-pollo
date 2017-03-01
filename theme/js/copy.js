$(function () {
  var clipboard = new Clipboard('.clipboard')

  clipboard.on('success', function(e) {
    console.info('Action:', e.action)
    console.info('Text:', e.text)
    console.info('Trigger:', e.trigger)
    e.clearSelection()
    var $button = $(e.target)
    var original = $button.text()
    var copied = $button.data('copied')
    // e.preventDefault()
    $button.text(copied)
    setTimeout(function () {
      $button.text(original)
    }, 3000)
  })

  clipboard.on('error', function(e) {
    console.error('Action:', e.action)
    console.error('Trigger:', e.trigger)
  })

  // $('.clipboard').on('click', function (e) {
  //   var $button = $(this)
  //   var original = $button.text()
  //   var copied = $button.data('copied')
  //   e.preventDefault()
  //   $button.text(copied)
  //   setTimeout(function () {
  //     $button.text(original)
  //   }, 3000)
  // })
})
