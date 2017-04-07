var boxColor = ["plum", "chartreuse", "magenta", "springgreen", "gold", "cyan",
    "steelblue", "orange", "hotpink", "aqua", "coral", "tomato",
];
var token;

function startColor() {
    $('#start').css('background-color', boxColor[Math.round(Math.random() * boxColor.length)]);
}

function hideMenu() {
    $('#start').css('display', 'none');
    $('#text').css('display', 'none');
}

function showMenu(gameID) {

    $.post("/rest/score", {
        game: gameID,
        score: score
    }, function (data) {
        $('#score').html(data.highscore);
        window.parent.updateCoins();
        if (data.message != '')
            alert(data.message);
    },'json');

    // $.ajax({
    //     url: "/rest/score",
    //     type: "POST",
    //     dataType: "JSON",
    //     data: {
    //         game: gameID,
    //         score: score
    //     },
    //     success: function (data) {
    //         $('#score').html(data.highscore);
    //         window.parent.updateCoins();
    //         if (data.message != '') {
    //             alert(data.message);
    //         }
    //     }
    // });

    startColor();
    $('#result').html(score);
    $('#game_start').text($.i18n.prop('game_again'), localStorage.getItem("lang"));
    $('#start').css('display', 'block');
    $('#text').css('display', 'block');
}

function update() {
    $.post("scorer.php", {
        update: Date.now(),
        token: token
    }, function (response) {
        token = response;
    });
}

function begin() {
    $.post("scorer.php", {
        begin: Date.now()
    }, function (response) {
        token = response;
    });
}