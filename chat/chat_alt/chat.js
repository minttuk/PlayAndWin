var prevResult = [{
    'id': 0
}];
var colorshift = true;

$('#chatbox').perfectScrollbar();

$.get("emoji.html", function(data) {
    $('.modal-body').html(data);
    emojify.run($('.modal-body')[0]);
    $('.emoji').click(function() {
        $('#msgbox').val($('#msgbox').val() + ' ' + $(this).attr('alt'));
        $(".modal").modal('hide');
    });
});

$("#emoji_search").keyup(function(e) {
    var query = $("#emoji_search").val().toLowerCase();
    $('.emoji').each(function(i) {
        if ($(this).attr('alt').includes(query)) $(this).parents('em').show();
        else $(this).parents('em').hide();
    });
});

$("#msgbox").keydown(function(e) {
    if (e.which == 13) sendMsg();
    if (e.which == 17) $(".modal").modal('show');
});

$('.modal-body').keydown(function(e) {
    if (e.which == 13) {
        $('#msgbox').val($('#msgbox').val() + ' ' + $(':focus').children(':first').attr('alt'));
        $(".modal").modal('hide');
    }
});

$('.modal').on('hidden.bs.modal', function() {
    setTimeout(inputFocus, 10);
});

$('.modal').on('shown.bs.modal', function(e) {
    $('#emoji_search').focus();
})

$(document).ready(function() {
    setInterval(update, 1000);
    $.ajax({
        url: "/rest/chat?html",
        datatype: 'html',
        success: function(result) {
            $(".msg-wrap").html(result);
            $('#loading').remove();
            $('#padding').remove();
            $('.input-group').css('visibility', 'visible');
            $('.user_name').each(function() {
                if ($(this).text() == 'guest') $(this).text($.i18n.prop('chat_guest'), localStorage.getItem("lang"));
            });
            $('.timestamp').each(function() {
                $(this).text(localizeDateTime($(this).text()));
            });
            emojify.run();
            $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
            $('#chatbox').perfectScrollbar('update');
            inputFocus();
        }
    });
    $.getJSON("/rest/chat", function(result) {
        prevResult = result[result.length - 1].id;
    });
});

function sendMsg() {
    $.post("/rest/chat", {
        message: $('#msgbox').val(),
    }, function(data) {
        $('#msgbox').val('');
        inputFocus();
        update();
    });
}

function update() {
    $.getJSON("/rest/chat", function(result) {
        if (result[result.length - 1].id != prevResult) {
            doOnce = true;
            prevResult = result[result.length - 1].id;
            var username = result[result.length - 1].username;
            if (username == 'guest') username = $.i18n.prop('chat_guest'), localStorage.getItem("lang");
            $(".msg-wrap").append('' +
                '<div class="media msg" style=' + cardColor() + '>' +
                '<div>' +
                '<small class="pull-right time"><i class="fa fa-clock-o"></i>' + ' ' + localizeDateTime(result[result.length - 1].ts) + '</small>' +
                '<h4 class="media-heading">' + username + '</h4>' +
                '<p class="col-lg-10">' + result[result.length - 1].msg + '</p>' +
                '</div>' +
                '</div>');
            emojify.run();
            $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
            $('#chatbox').perfectScrollbar('update');
        }
    });
}

function inputFocus() {
    $('#msgbox').focus();
}

function cardColor() {
    if (colorshift) {
        colorshift = !colorshift;
        return 'background-color:#d2e2fa;';
    } else {
        colorshift = !colorshift;
        return 'background-color:#def7fe;';
    }
}
