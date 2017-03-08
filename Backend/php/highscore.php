<?php
require 'connection.php';
session_start();

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

$gamelist = array('snake'=>'Disco Snake','flappy'=>'Flutter Bird','reaction'=>'Speed Click','jumper'=>'Jumper Man');
if (isset($_SESSION['id']) || isset($_REQUEST['id'])) {
  if (isset($_REQUEST['id'])) {
    $user = $_REQUEST['id'];
  } else {
    $user = $_SESSION['id'];
  }
  foreach ($gamelist as $game => $name) {
    $json[] = jsonBuilder($game,$user);
  }
  if (isset($_REQUEST['table'])) {
    $html = '';
    foreach ($json as $game) {
      $gameID = array_keys($game)[0];
      $html .= '<tr><th><a href="game.html#'.$gameID.'">'.
      $gamelist[$gameID].'</a></th><td>'.$game[$gameID].'</td></tr>';
    }
    echo($html);
  } else {
    echo(json_encode($json));
  }

}


/*
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
