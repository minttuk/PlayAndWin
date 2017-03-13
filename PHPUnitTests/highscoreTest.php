
<?php

use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
//include './Backend/php/connection.php';
//require './Backend/php/rb.php';
require_once '../Backend/php/hshandler.php';
require_once '../Backend/php/connection.php';

final class highscoreTest extends TestCase {
  public function testSetHS() {
      $this->assertEquals(json_encode(array('highscore'=>'','message'=>'Highscore not saved! (No user signed in.)')), setHighscore());
  }
  public function testGetHS() {
      $this->assertEquals('[{"snake":"1"},{"flappy":"1"},{"reaction":"1"},{"jumper":"1"}]', getHighscores(1));
  }
  public function testJsonBuilder() {
      $this->assertEquals(Array('snake'=>'1'), jsonBuilder('snake',1));
  }
  public function testGetCoins() {
      R::exec('UPDATE user SET coins=5000 WHERE id=1;');
      $this->assertEquals(5000, getCoins(1));
  }
}
