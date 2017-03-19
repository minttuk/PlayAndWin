<?php

/**
 * Sets a new highscore for a user if the new score is greater than the stored value and
 * returns JSON formatted string with a message and the new highscore.
 * The game and score are recieved as POST parameters and the user ID is retrieved from a session variable.
 * @return JSON formatted string.
 */
function setHighscore() {
  if (isset($_SESSION['id'])) {
    if (isset($_REQUEST['game'])) {
      if (isset($_REQUEST['score'])) {
        $tableName = 'hs_'.$_REQUEST['game'];
        $newScore = $_REQUEST['score'];
        $id = $_SESSION['id'];
        $score = R::load( $tableName, $id );
        $curScore = $score->highscore;
        coinAmount($id,$_REQUEST['game'],$newScore);
        if ($newScore > $curScore) {
          $score->highscore=$newScore;
          R::store( $score );
          return json_encode(array('highscore'=>$newScore,'message'=>''));
        }
        return json_encode(array('highscore'=>$curScore,'message'=>''));
      }
    }
  }
  return json_encode(array('highscore'=>'','message'=>'Highscore not saved! (No user signed in.)'));
}

/**
 * Gets the amount of coins associated with a given user ID from the database.
 *
 * @param int $id is the ID number of the user.
 * @return int Number of coins
 */
function getCoins($id) {
    $user = R::load( 'user', $id);
    return $user->coins;
}

/**
 * Sets the amount of new coins accquired by the user into the database.
 *
 * @param int $id is the ID number of the user.
 * @param string $game a the name of a game for using the correct score multiplier.
 * @param int $score is the score achieved by the user.
 */

function coinAmount($id,$game,$score) {
    $newCoins = array('snake'=>round($score*0.2),'flappy'=>round($score*0.3),'reaction'=>round($score*0.006),'jumper'=>round($score*0.07));
    $user = R::load( 'user', $id );
    $coins = $user->coins + $newCoins[$game];
    $user->coins = $coins;
    R::store( $user );
}

/**
 * Gets the highscores associated with a user in either JSON or HTML format based on a POST parameter.
 *
 * @param int $user is the ID number of the user.
 * @return string JSON or HTML
 */
function getHighscores($user) {
  $gamelist = array('snake'=>'Disco Snake','flappy'=>'Flutter Bird','reaction'=>'Speed Click','jumper'=>'Jumper Man');
  foreach ($gamelist as $game => $name) {
  $json[] = jsonBuilder($game,$user);
  }
  if (isset($_REQUEST['table'])) {
    $html = '';
    foreach ($json as $game) {
      $gameID = array_keys($game)[0];
      $html .= '<tr><th><a href="/game.html#'.$gameID.'">'.
      $gamelist[$gameID].'</a></th><td>'.$game[$gameID].'</td></tr>';
    }
    return ($html);
  } else {
    return json_encode($json);
  }
}

/**
 * Builds an array of highscores achieved by the user.
 *
 * @param int $userid is the ID number of the user.
 * @param string $game a the name of a game.
 * @return array User Highscores
 */
function jsonBuilder($game,$userid) {
  $tableName = 'hs_'.$game;
  $score = R::load( $tableName, $userid );
  if ($score->highscore == '') {
    $hs = 0;
  } else {
    $hs = $score->highscore;
  }
  $json[$game] =  $hs;
  return $json;
}

/*
Alternative methods kept in case of future usefulness

Javascript

<script src="js/gamelist.js"></script>
$.getJSON("../Backend/php/highscore.php"+userId, function(result){
    $.each(result, function(i, field){
      $("#highscores").append('<tr><th><a href="game.html#'+Object.keys(field)[0]+'">'+
      gamelist[Object.keys(field)[0]]+'</a></th><td>'+field[Object.keys(field)[0]]+'</td></tr>');
    });
});

PHP

$gamelist = array('reaction','snake','flappy','jumper');
if (isset($_SESSION['id']) || isset($_REQUEST['id'])) {
  if (isset($_REQUEST['id'])) {
    $user = $_REQUEST['id'];
  } else {
    $user = $_SESSION['id'];
  }
  foreach ($gamelist as $game) {
    $json[] = jsonBuilder($game,$user);
}
  echo(json_encode($json));
}
*/
