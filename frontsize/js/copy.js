$(function(){

    $('.highlight .code').each(function(){
        $(this).html($(this).html().replace(/[“”]{1,}/g, '"'));
    });

    new Clipboard('.code-example');

    var timeout;

    $(document).on('click', '.code-example', function(){

        var $copyMessage, originalText;

        $copyMessage = $(this).find('.code-example__message');
        originalText = $(this).find('.code-example__message').data('text');
        $copyMessage.text('copied');

        clearTimeout(timeout);

        timeout = setTimeout(function(){
            $copyMessage.text(originalText);
            window.getSelection().removeAllRanges();
        }, 2000);
    });
});
