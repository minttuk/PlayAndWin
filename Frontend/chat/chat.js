var prevResult = [{'id': 0}];
var colorshift = true;

$('#chatbox').perfectScrollbar();

$(document).ready(function() {
    setInterval(update, 1000);
    $.ajax({url: "../../Backend/php/getchat.php?html",
    datatype: 'html',
    success: function(result){
        $(".msg-wrap").html(result);
        $('#loading').remove();
        $('#padding').remove();
        $('.input-group').css('visibility','visible');
        $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
        $('#chatbox').perfectScrollbar('update');
    }});
    $.getJSON("../../Backend/php/getchat.php", function(result) {
        prevResult = result[result.length - 1].id;
    });
});

function sendMsg() {
    $.post("../../Backend/php/addchat.php", {
        message: $('#msgbox').val(),
    }, function(data) {
        $('#msgbox').val('');
        update();
    });
}

function update() {
    $.getJSON("../../Backend/php/getchat.php", function(result) {
        if (result[result.length - 1].id != prevResult) {
            doOnce = true;
            prevResult = result[result.length - 1].id;
            $(".msg-wrap").append('' +
                '<div class="media msg" style='+cardColor()+'>' +
                '<div class="media-body">' +
                '<small class="pull-right time"><i class="fa fa-clock-o"></i>' + ' ' + result[result.length - 1].ts + '</small>' +
                '<h4 class="media-heading">' + result[result.length - 1].username + '</h4>' +
                '<p class="col-lg-10">' + result[result.length - 1].msg + '</p>' +
                '</div>' +
                '</div>');
            $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
            $('#chatbox').perfectScrollbar('update');
        }
    });
}

$(function() {
    $('#msgbox').keypress(function(e) {
        if (e.which == 13) {
            sendMsg();
        }
    });
});

function cardColor() {
  if (colorshift) {
    colorshift = !colorshift;
    return 'background-color:#d2e2fa;';
  } else {
    colorshift = !colorshift;
    return 'background-color:#def7fe;';
  }
}
