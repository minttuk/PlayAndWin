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
    }});
    $.getJSON("/rest/chat", function(result) {
        prevResult = result[result.length - 1].id;
    });
});

function sendMsg() {
    if($.cookie('access_token')) {
      $.ajax({url: "/rest/chat",
      type: 'POST',
      data : {message: $('#msgbox').val()},
      headers:{'access_token':$.cookie('access_token')},
      success: function(data){
        $('#msgbox').val('');
        update();
      }});
    } else {
      $.post("/rest/chat", {
          message: $('#msgbox').val(),
      }, function(data) {
          $('#msgbox').val('');
          update();
      });
    }
}

function update() {
    $.getJSON("/rest/chat", function(result) {
        if (result[result.length - 1].id != prevResult) {
            doOnce = true;
            prevResult = result[result.length - 1].id;
            $(".msg-wrap").append('' +
                '<div class="media msg" style='+cardColor()+'>' +
                '<div>' +
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
