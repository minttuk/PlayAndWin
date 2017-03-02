<?php
ini_set('display_errors', 1);
require 'rb.php';
session_start();

R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );

function jsonBuilder($game) {
  $tableName = 'hs_'.$game;
  $score = R::load( $tableName, $_SESSION['id'] );
  if ($score->highscore == '') {
    $hs = 0;
  } else {
    $hs = $score->highscore;
  }
  $json[$game] =  $hs;
  return $json;
}

$gamelist = array('reaction','snake','flappy');
if (isset($_SESSION['id'])) {
  foreach ($gamelist as $game) {
    $json[] = jsonBuilder($game);
}
  echo(json_encode($json));
}
