boxColor = ["plum", "chartreuse", "magenta", "springgreen", "gold", "cyan",
    "steelblue", "orange", "hotpink", "aqua", "coral", "tomato",
];

function startColor() {
    $('#start').css('background-color', boxColor[Math.round(Math.random() * boxColor.length)]);
}

function hideMenu() {
    $('#start').css('display', 'none');
    $('#text').css('display', 'none');
}

function showMenu(gameID) {
    $.post("../../Backend/php/hshandler.php", {
        game: gameID,
        score: score
    }, function(data) {
        $('#score').html(data.highscore);
        window.parent.updateCoins();
        if (data.message != '') {
            alert(data.message);
        }
    }, 'json');
    startColor();
    $('#result').html(score);
    $('#start').css('display', 'block');
    $('#text').css('display', 'block');
}
