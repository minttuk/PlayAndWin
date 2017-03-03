<?php
ini_set('display_errors', 1);
require 'rb.php';
session_start();

R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );

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

$gamelist = array('reaction','snake','flappy');
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
