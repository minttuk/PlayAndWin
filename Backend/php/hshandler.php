<?php
require 'connection.php';
session_start();

function highscore() {
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
          echo json_encode(array('highscore'=>$newScore,'message'=>'New High Score!'));
          return;
        }
        echo json_encode(array('highscore'=>$curScore,'message'=>''));
        return;
      }
    }
  }
  echo json_encode(array('highscore'=>'','message'=>'Highscore not saved! (No user signed in.)'));
}

highscore();

function coinAmount($id,$game,$score) {
    $newCoins = array('snake'=>round($score*0.2),'flappy'=>round($score*0.3),'reaction'=>round($score*0.006),'jumper'=>round($score*0.07));
    $user = R::load( 'user', $id );
    $coins = $user->coins + $newCoins[$game];
    $user->coins = $coins;
    R::store( $user );
}
