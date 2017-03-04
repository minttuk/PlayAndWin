var prevResult = [{'id': 0}];
var colorshift = true;

$('#chatbox').perfectScrollbar();

$(document).ready(function() {
    setInterval(update, 1000);
    $.getJSON("../../Backend/php/getchat.php", function(result) {
        prevResult = result;
        for (i = Math.max(0,result.length - 30); i < result.length; i++) {
            $(".msg-wrap").append('' +
                '<div class="media msg" style='+cardColor()+'>' +
                '<div class="media-body">' +
                '<small class="pull-right time"><i class="fa fa-clock-o"></i>' + ' ' + result[i].ts + '</small>' +
                '<h4 class="media-heading">' + result[i].username + '</h4>' +
                '<p class="col-lg-10">' + result[i].msg + '</p>' +
                '</div>' +
                '</div>'
            );
        }
        $('#loading').remove();
        $('#padding').remove();
        $('.input-group').css('visibility','visible');
        $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
        $('#chatbox').perfectScrollbar('update');
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
        if (result[result.length - 1].id != prevResult[prevResult.length - 1].id) {
            prevResult = result;
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
