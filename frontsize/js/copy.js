$(function(){

    var clipboard = new Clipboard('.code-example');

    $(document).on('click', '.code-example', function(){

        var $copyMessage, originalText;

        $copyMessage = $(this).find('.code-example__message');
        originalText = $(this).find('.code-example__message').data('text');
        $copyMessage.text('copied');

        setTimeout(function(){
            $copyMessage.text(originalText);
        }, 2000);
    });
});
