$(document).ready(function () {
    $('#body').keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            $(this).val($(this).val() + '<br/>');
        }
    });
});