
<?php

use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
require_once '../rest/dependencies/require_all.php';

final class highscoreTest extends TestCase {

  /*
  * Tests that highscore gives a specific message when a user is not signed in
  */

  public function testSetHS() {
      $response = json_encode(setHighscore(null));
      $this->assertEquals(json_encode(array('highscore'=>'','message'=>'Highscore not saved! (No user signed in.)')), $response);
  }

  /*
  * Tests that highscore is retrieved succesfully from database
  */

  public function testGetHS() {
      $this->assertEquals('[{"snake":"1"},{"flappy":"1"},{"reaction":"1"},{"jumper":"1"}]', getHighscores(1));
  }

  /*
  * Tests that highscore array is built in the right way
  */

  public function testarrayBuilder() {
      $this->assertEquals(Array('snake'=>'1'), arrayBuilder('snake',1));
  }

  /*
  * Tests that getCoins function returns the right amount of coins
  */

  public function testGetCoins() {
      R::exec('UPDATE user SET coins=5000 WHERE id=1;');
      $this->assertEquals(5000, getCoins(1));
  }
}
