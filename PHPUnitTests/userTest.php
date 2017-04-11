<?php


use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
require_once '../rest/dependencies/require_all.php';

final class userTest extends TestCase {

  public function testcheckEmpty() {
    $this->assertEquals(null, checkEmpty(''));
    $this->assertEquals('moi', checkEmpty('moi'));
    $this->assertEquals(null, checkEmpty('   '));
  }

  public function testgetAdmin(){
        $this->expectOutputString(null, getAdmin(-1));
        $this->expectOutputString(1, getAdmin(2)['admin']);
  }

  public function testgetUserInfo() {
    $info = getUserInfo('Bobby');
    $this->assertEquals('Bobby', $info['username']);
    /*$this->assertArrayHasKey('error', json_decode($info, true));
    $this->assertArrayNotHasKey('username', $info);
    $info = getUserInfo(1);
    $this->assertArrayHasKey('username', $info);
    $info = getUserInfo(100);
    $this->assertArrayHasKey('error', $info);
    $this->assertArrayNotHasKey('username', $info);*/
  }

  public function testsetUserInfo() {
    setUserInfo(2, 'assert', 'equal', '  ', 'Hong Kong');
    $user = getUserInfo('Boss');
    $this->assertEquals('assert', $user['firstname']);
    $this->assertEquals(null, $user['description']);
    setUserInfo(2, 'admin', 'admin', '', '');
  }

  public function testgetLastLoggedIn() {
    $this->assertTrue('1' < count(getLastLoggedIn()));
  }
  public function testgetNewUsers() {
    $this->assertTrue('1' < count(getNewUsers()));
  }
}
