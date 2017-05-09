
<?php

use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
require_once '../rest/dependencies/require_all.php';

final class loginTest extends TestCase {

    /**
     * Tests that user login returns the right messages.
     */
    public function testloginUser() {
      //$this->assertEquals(-1, json_decode(loginUser(null, null, null, null, null, null)));
      $this->assertEquals('{"data":"Username taken, try again!"}',loginUser('Bobby', 'moiMoir3', 'moiMoir3', 'trololo@trol.com',null, null, '1950-10-10'));
      $this->assertEquals('{"data":"Nope, wrong username or password!"}',loginUser('Fake', 'moiMoir3', 'moiMoir3', null, null, null, '1950-10-10'));
  }

    /**
     * Tests that the function returns the user id number, which is type int.
     */
  public function testregUser() {
      $this->assertInternalType('int', regUser('Fake', 'moiMoir3', 'moiMoir3', 'testi@testi.com', 'Php', 'UnitTest', '1950-10-10'));
  }

    /**
     * Tests that findUser function works and returns right user.
     */
  public function testfindUser(){
      $this->assertEquals('Fake', findUser('Fake')->username);
  }

    /**
     * Tests that getUser returns the right user.
     */
  public function testgetUser() {
      $this->assertEquals('Fake', getUser(findUser('Fake')->id)->username);
  }

    /**
     * Tests that deleteUser function returns the right message.
     */
  public function testdeleteUser() {
      $delID = findUser('Fake')->id;
      $this->assertEquals('User '.$delID.' deleted.', deleteUser(2, $delID));
  }

    /**
     * Tests that validatePassword returns true if passwords are valid.
     */
  public function testvalidatePassword() {
      $this->assertEquals(true, validatePassword('moiMoimoir3','moiMoimoir3'));
  }
}
