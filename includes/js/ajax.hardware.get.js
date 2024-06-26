function ajax_get_hw($) {
    $.ajax({
        type: 'post',
        url: get_hw_ajax_url,
        data: {
            'action': 'get_hw'
        },
        dataType: 'JSON',
        success: function(data) {
            hw_info = document.getElementById("hw-info");
            if (hw_info) {
                $("#hw-info").empty();
                $("#hw-info").html(data);
                setTimeout(function() { ajax_get_hw($); }, 1000);
            }
        },
        error: function(errorThrown) {
            //error stuff here.text
        }
    });
}

jQuery(document).ready(function($) {
    hw_info = document.getElementById("hw-info");
    if (hw_info) {
        ajax_get_hw($);
    }
});