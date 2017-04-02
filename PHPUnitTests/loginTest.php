
<?php

use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
require_once '../rest/dependencies/require_all.php';

final class loginTest extends TestCase {
  public function loginUserTest() {
      $this->assertEquals(-1, json_decode(loginUser(null, null, null, null, null, null)));
      $this->assertEquals('[{"data":"Username taken, try again!"}]',loginUser('Bobby', 'moiMoir3', 'moiMoir3', 'trololo@trol.com',null, null));
      $this->assertEquals('[{"data":"Nope, wrong username or password!"}]',loginUser('Fake', 'moiMoir3', 'moiMoir3', null, null, null));
  }
  public function logOutTest() {
      $this->assertEquals('You have been logged out.', logOut());
  }
  public function regUserTest() {
      $this->assertEquals(true, regUser('Fake', 'moiMoir3', 'moiMoir3', 'testi@testi.com', 'Php', 'UnitTest'));
  }
  public function findUserTest(){
      $this->assertEquals('Fake', findUser('Fake')->username);
  }
  public function getUserTest() {
      $this->assertEquals('Fake', getUser(findUser('Fake')->id)->username);
  }
  public function deleteUserTest() {
      $delID = findUser('Fake')->id;
      $this->assertEquals('User '.$delID.' deleted.', deleteUser(2, $delID));
  }
  public function validatePasswordTest() {
      $this->assertEquals(true, validatePassword('moiMoimoir3','moiMoimoir3'));
  }
}
