var boxColor = ["plum", "chartreuse", "magenta", "springgreen", "gold", "cyan",
    "steelblue", "orange", "hotpink", "aqua", "coral", "tomato",
];
var token;

/**
 * Sets the css backround color of start button to a random value
 */
function startColor() {
    $('#start').css('background-color', boxColor[Math.round(Math.random() * boxColor.length)]);
}
/**
 * Hides the game menu
 */
function hideMenu() {
    $('#start').css('display', 'none');
    $('#text').css('display', 'none');
}
/**
 * Shows the game menu and sends the final score to the rest api
 */
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
    startColor();
    $('#result').html(score);
    $('#game_start').text($.i18n.prop('game_again'), localStorage.getItem("lang"));
    $('#start').css('display', 'block');
    $('#text').css('display', 'block');
}
/**
 * Sends the php scorer a token and the current time in millis
 */
function update() {
    $.post("scorer.php", {
        update: Date.now(),
        token: token
    }, function (response) {
        token = response;
    });
}
/**
 * Sends the php scorer a begin request and stores the returned token
 */
function begin() {
    $.post("scorer.php", {
        begin: Date.now()
    }, function (response) {
        token = response;
    });
}