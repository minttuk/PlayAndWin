var prevResult = [{'id': 0}];
var colorshift = true;

$('#chatbox').perfectScrollbar();

$(document).ready(function() {
    setInterval(update, 1000);
    $.ajax({url: "/rest/chat?html",
    datatype: 'html',
    success: function(result){
        $(".msg-wrap").html(result);
        $('#loading').remove();
        $('#padding').remove();
        $('.input-group').css('visibility','visible');
        $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
        $('#chatbox').perfectScrollbar('update');
        $('.user_name').each(function() {
          if($(this).text()=='guest') $(this).text($.i18n.prop('chat_guest'),localStorage.getItem("lang"));
          emojify.run();
        });
    }});
    $.getJSON("/rest/chat", function(result) {
        prevResult = result[result.length - 1].id;
    });
});

function sendMsg() {
    $.post("/rest/chat", {
        message: $('#msgbox').val(),
    }, function(data) {
        $('#msgbox').val('');
        update();
    });
}

function update() {
    $.getJSON("/rest/chat", function(result) {
        if (result[result.length - 1].id != prevResult) {
            doOnce = true;
            prevResult = result[result.length - 1].id;
            var username = result[result.length - 1].username;
            if (username == 'guest') username = $.i18n.prop('chat_guest'),localStorage.getItem("lang");
            $(".msg-wrap").append('' +
                '<div class="media msg" style='+cardColor()+'>' +
                '<div>' +
                '<small class="pull-right time"><i class="fa fa-clock-o"></i>' + ' ' + result[result.length - 1].ts + '</small>' +
                '<h4 class="media-heading">' + username + '</h4>' +
                '<p class="col-lg-10">' + result[result.length - 1].msg + '</p>' +
                '</div>' +
                '</div>');
            $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
            $('#chatbox').perfectScrollbar('update');
            emojify.run();
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
