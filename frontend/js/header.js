$(function(){
  var $header, startFrom, headerHeight, scrollTop, prevScroll;
  $header = $('.miniml-header--fixed');
  headerHeight = 60;
  startFrom = headerHeight;
  scrollTop = 0;
  prevScroll = 0;

  $(window).scroll(function () {
    scrollTop = $(window).scrollTop();
    if (prevScroll > scrollTop) {
      if (scrollTop > startFrom) {
        $header.removeClass('miniml-header--hidden');
        $header.removeClass('miniml-header--outside');
      }
    } else {
      $header.addClass('miniml-header--outside');
    }
    if (scrollTop === 0) {
      $header.addClass('miniml-header--hidden');
    }
    prevScroll = scrollTop;
  });
});
