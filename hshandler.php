<?php
require 'rb.php';

R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', 'moi' );

function highscore() {
  //if ($_SESSION['id']) {
    if (isset($_REQUEST['game'])) {
      if (isset($_REQUEST['score'])) {
        $tableName = 'hs_'.$_REQUEST['game'];
        $newScore = $_REQUEST['score'];
        $id = 1;
        $score = R::load( $tableName, $id );
        $curScore = $score->highscore;
        if ($newScore > $curScore) {
          $score->highscore=$newScore;
          R::store( $score );
          echo 'New Highscore!';
          return;
        }
        echo 'Not a highscore!';
        return;
      }
    }
  //}
  echo 'Highscore not saved! (No user signed in.)';
}

highscore();
