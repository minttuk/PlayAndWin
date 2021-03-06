<?php


use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
require_once '../rest/dependencies/require_all.php';

final class userTest extends TestCase {

  /*
  * Tests that checkEmpty() function turns empty space into null
  */
  public function testcheckEmpty() {
    $this->assertEquals(null, checkEmpty(''));
    $this->assertEquals('moi', checkEmpty('moi'));
    $this->assertEquals(null, checkEmpty('   '));
  }

  /*
  * Tests that getAdmin() returns 1 for a user that is an admin
  */
  public function testgetAdmin(){
        $this->expectOutputString(null, getAdmin(-1));
        $this->expectOutputString(1, getAdmin(2)['admin']);
  }

  /*
  * Tests that getUserInfo returns right information by username
  */
  public function testgetUserInfo() {
    $info = getUserInfo('Bobby');
    $this->assertEquals('Bobby', $info['username']);
  }

  /*
  * Tests that user information can be edited with setUserInfo() function
  */
  public function testsetUserPublicInfo() {
    setUserPublicInfo(2, ' ', 'Hong Kong');
    $user = getUserInfo('Boss');
    $this->assertEquals('Hong Kong', $user['location']);
    $this->assertEquals(null, $user['description']);
    setUserPublicInfo(2, '', '');
  }

    /**
     * Tests that user private information is rightly edited
     */
    public function testsetUserPrivateInfo() {
        setUserPrivateInfo(2, 'assert', 'equal', 'male');
        $user = getUserInfo('Boss');
        $this->assertEquals('assert', $user['firstname']);
        setUserPrivateInfo(2, 'admin', 'admin', '', '');
    }

  /*
  * Tests that getLastLoggedIn returns a bunch of users
  */
  public function testgetLastLoggedIn() {
    $this->assertTrue('1' < count(getLastLoggedIn()));
  }

  /*
  * Tests that getNewUsers returns a bunch of users
  */
  public function testgetNewUsers() {
    $this->assertTrue('1' < count(getNewUsers()));
  }
}
