$(function(){
    $(document).on('click', '.apollo-menu-mobile__switch', function(){
        if ($('.apollo-menu-mobile-nav').hasClass('apollo-menu-mobile-nav--open')) {
            $('.apollo-menu-mobile-nav').removeClass('apollo-menu-mobile-nav--open');
        } else {
            $('.apollo-menu-mobile-nav').addClass('apollo-menu-mobile-nav--open');
        }
    });
});
