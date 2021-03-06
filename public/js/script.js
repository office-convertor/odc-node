$(document).ready(function(){
    var form = $('form');
    var output = $('#output');
    var info = $('#info');
    var progress = $('.progress');
    var slider = $('.slider');
    var select = $('select');
    if(slider.length){
        slider.slider();
    }
    if(select.length){
        select.material_select();
    }
    $('form').on('submit', function(e){
        e.preventDefault();
        progress.removeClass('hide');
        $(this).ajaxSubmit({
            error: function(xhr) {
                output.html('Error: ' + xhr.status);
            },
            success: function(data) {
                window.location.href= '/output/' + data.timestamp + '/' + data.format;
            }
        });
    });
});
