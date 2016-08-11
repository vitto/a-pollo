$(function(){
  var $header, startFrom, headerHeight, scrollTop, prevScroll, diffScroll, friction;
  $header = $('.miniml-header--fixed');
  headerHeight = 60;
  friction = 3;
  startFrom = headerHeight;
  scrollTop = 0;
  prevScroll = 0;
  diffScroll = 0;

  $(window).scroll(function () {
    scrollTop = $(window).scrollTop();
    if (prevScroll > scrollTop) {
      diffScroll = diffScroll - 1 > 0 ? diffScroll - 1 : 0 ;
      if (diffScroll === 0) {
        $header.removeClass('miniml-header--hidden');
        $header.removeClass('miniml-header--outside');
      }
    } else {
      diffScroll = diffScroll + 1 < headerHeight / friction ? diffScroll + 1 : headerHeight / friction ;
      if (diffScroll >= headerHeight / friction) {
        $header.addClass('miniml-header--outside');
      }
    }
    if (scrollTop === 0) {
      $header.addClass('miniml-header--hidden');
    }
    prevScroll = scrollTop;
  });
});
