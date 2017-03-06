<?php
ini_set('display_errors', 1);
require 'rb.php';
session_start();

R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );

function highscore() {
  if (isset($_SESSION['id'])) {
    if (isset($_REQUEST['game'])) {
      if (isset($_REQUEST['score'])) {
        $tableName = 'hs_'.$_REQUEST['game'];
        $newScore = $_REQUEST['score'];
        try {
          R::exec( 'insert into '.$tableName.' (id) Values ('.$_SESSION['id'].')' );
        } catch(Exception $e) {}
        $id = $_SESSION['id'];
        $score = R::load( $tableName, $id );
        $curScore = $score->highscore;
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