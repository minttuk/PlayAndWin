var prevResult = [{
    'id': 0
}];
var colorshift = true;

$('#chatbox').perfectScrollbar();

$.get("emoji.html", function (data) {
    $('.modal-body').html(data);
    $('.emoji_option').click(function () {
        $('#msgbox').val($('#msgbox').val() + ' ' + $(this).text());
        $(".modal").modal('hide');
    });
});

$("#emoji_search").keyup(function (e) {
    var query = $("#emoji_search").val().toLowerCase();
    $('.emoji_option').each(function (i) {
        if ($(this).attr('title').includes(query)) $(this).show();
        else $(this).hide();
    });
});

$("#msgbox").keydown(function (e) {
    if (e.which == 13) sendMsg();
    if (e.which == 17) $(".modal").modal('show');
});

$('.modal-body').keydown(function (e) {
    if (e.which == 13) {
        $('#msgbox').val($('#msgbox').val() + ' ' + $(':focus').text());
        $(".modal").modal('hide');
    }
});

$('.modal').on('hidden.bs.modal', function () {
    setTimeout(inputFocus, 10);
});

$('.modal').on('shown.bs.modal', function (e) {
    $('#emoji_search').focus();
})

$(document).ready(function () {
    setInterval(updateChat, 1000);
    loadChat();
});

/**
 * Loads and appends the user table to the page html
 */
function loadChat() {
    $.ajax({
        url: "/rest/chat?html",
        datatype: 'html',
        success: function (result) {
            $(".msg-wrap").html(result);
            $('#loading').remove();
            $('#padding').remove();
            $('.input-group').css('visibility', 'visible');
            $('.user_name').each(function () {
                if ($(this).text() == 'guest') $(this).text($.i18n.prop('chat_guest'), localStorage.getItem("lang"));
            });
            $('.timestamp').each(function () {
                $(this).text(localizeDateTime($(this).text()));
            });
            $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
            $('#chatbox').perfectScrollbar('update');
            inputFocus();
        }
    });
    $.getJSON("/rest/chat", function (result) {
        prevResult = result[result.length - 1].id;
    });
}

/**
 * Sends a chat message to the rest api
 */
function sendMsg() {
    $.post("/rest/chat", {
        message: $('#msgbox').val().emojify(),
    }, function (data) {
        $('#msgbox').val('');
        inputFocus();
        updateChat();
    });
}

/**
 * Updates the chat and appends new chat messages to the page html
 */
function updateChat() {
    $.getJSON("/rest/chat", function (result) {
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
            $('#chatbox').scrollTop($('#chatbox')[0].scrollHeight);
            $('#chatbox').perfectScrollbar('update');
        }
    });
}

/**
 * Places focus on the chat message input field
 */
function inputFocus() {
    $('#msgbox').focus();
}

/**
 * Alternates between generating two possible CSS background colors based on a boolean value.
 *
 * @return string CSS formatted background-color
 */
function cardColor() {
    if (colorshift) {
        colorshift = !colorshift;
        return 'background-color:#d2e2fa;';
    } else {
        colorshift = !colorshift;
        return 'background-color:#def7fe;';
    }
}
