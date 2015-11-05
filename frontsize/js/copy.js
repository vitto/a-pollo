$(function(){
    $(document).on('click', '.code-example', function(){
        console.log($(this).prev().prev().find('.html-example__inner').html());
        // var clipboard = new Clipboard('.btn');
    });
});
