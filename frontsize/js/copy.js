jQuery.fn.selectText = function(){
    this.find('input').each(function() {
        if($(this).prev().length === 0 || !$(this).prev().hasClass('p_copy')) {
            $('<p class="p_copy" style="position: absolute; z-index: -1;"></p>').insertBefore($(this));
        }
        $(this).prev().html($(this).val());
    });
    var doc = document;
    var element = this[0];
    var range;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

$(function(){

    $(document).on('click', '.apollo-html-example', function(){
        var isActive = $(this).find('.apollo-html-example__bg').hasClass('apollo-html-example__bg--active');
        if (isActive) {
            $(this).find('.apollo-html-example__bg').removeClass('apollo-html-example__bg--active');
        } else {
            $(this).find('.apollo-html-example__bg').addClass('apollo-html-example__bg--active');
        }
    });

    $('.highlight .code').each(function(){
        $(this).html($(this).html().replace(/[“”]{1,}/g, '"'));
    });

    new Clipboard('.apollo-code-example');

    $(document).on('click', '.apollo-page > p > code, .apollo-widget__description code', function(){
        $(this).selectText();
    });

    var timeout;

    $(document).on('click', '.apollo-code-example', function(){

        var $copyMessage, originalText;

        $copyMessage = $(this).find('.apollo-code-example__message');
        originalText = $(this).find('.apollo-code-example__message').data('text');
        $copyMessage.text('copied');

        clearTimeout(timeout);

        timeout = setTimeout(function(){
            $copyMessage.text(originalText);
            window.getSelection().removeAllRanges();
        }, 2000);
    });
});
