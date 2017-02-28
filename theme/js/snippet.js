$(function () {
  var cookies = Cookies.getJSON()
  var snippet = {
    viewport: 'desktop',
    background: 'light'
  }


  if (cookies.snippet === 'undefined') {
    Cookies.set('snippet', snippet)
  } else {
    snippet = cookies.snippet
  }

  function setViewport (viewport) {
    $('.render__wrapper').removeClass(function (index, className) {
      return (className.match(/render__wrapper--(desktop|tablet|mobile)/g) || []).join(' ');
    })
    $('.options__action[data-viewport]').removeClass('options__action--selected')
    $('.options__action[data-viewport=' + viewport + ']').addClass('options__action--selected')
    $('.render__wrapper').addClass('render__wrapper--' + viewport)
  }

  setViewport(snippet.viewport)

  $('.options__action[data-viewport]').on('click', function (e) {
    e.preventDefault()
    snippet.viewport = $(this).data('viewport')
    Cookies.set('snippet', snippet)
    setViewport(snippet.viewport)
  })

  function setBackground(background) {
    $('.render__wrapper').removeClass(function (index, className) {
      return (className.match(/render__wrapper--(transparency|light|dark)/g) || []).join(' ');
    })
    $('.options__action[data-background]').removeClass('options__action--selected')
    if (background !== '') {
      $('.options__action[data-background=' + background + ']').addClass('options__action--selected')
      $('.render__wrapper').addClass('render__wrapper--' + background)
    }
  }

  setBackground(snippet.background)

  $('.options__action[data-background]').on('click', function (e) {
    e.preventDefault()
    snippet.background = $(this).data('background')
    Cookies.set('snippet', snippet)
    setBackground(snippet.background)
  })
})
