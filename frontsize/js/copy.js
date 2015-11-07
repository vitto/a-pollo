$(function(){

    $('.value').each(function(){
        $(this).text($(this).text().replace(/[“”]{1,}/g, '"'));
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
        }, 2000);
    });
});
