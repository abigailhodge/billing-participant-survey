$(document).ready(function() {
    $('.btn').click(function() {
        if ($(this).hasClass('incorrect')) {
            $(this).removeClass('incorrect')
        } else {
            $(this).addClass('incorrect')
        }
    })
})