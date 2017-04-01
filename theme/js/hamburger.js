$(function () {
  $('.hamburger__button').on('click', function () {
    $('.hamburger').toggleClass('hamburger--active')
    $('.body').toggleClass('body--no-overflow')
  })
})
