<?php


use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
//include './Backend/php/connection.php';
//require './Backend/php/rb.php';
require_once '../rest/dependencies/libraries/rb.php';
require_once '../rest/dependencies/models/connection.php';
require_once '../rest/dependencies/models/user.php';

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

  public function testgetFriendsCount() {
    deleteFriend(1, 'Boss');
    $this->assertEquals(0, getFriendsCount(1));
    addFriend(1, 'Boss');
    $this->assertEquals(0, getFriendsCount(1));
    addFriend(2, 'Bobby');
    $this->assertEquals(1, getFriendsCount(1));
    deleteFriend(1, 'Boss');
    $this->assertEquals(0, getFriendsCount(1));
  }

  public function testaddFriend() {
    $this->assertEquals(addFriend(null, 'Boss'), ['message' => 'No session id']);
    $this->assertEquals(addFriend(1, 'Boss'), ['message' => 'Friend added succesfully!']);
    $this->assertEquals(addFriend(1, 'Boss'), ['message' => 'Friend has already been added']);
  }

  public function testdeleteFriend() {
    $this->assertEquals(deleteFriend(null, 'Boss'), ['message' => 'No session id']);
    $this->assertEquals(deleteFriend(1, 'Boss'), ['message' => 'Friend deleted succesfully!']);
  }

  public function testgetFriendship() {
    $friendship = getFriendship(1, 'Boss');
    $rows = count($friendship);
    $this->assertEquals(0, $rows);
    addFriend(1, 'Boss');
    $friendship = getFriendship(1, 'Boss');
    $rows = count($friendship);
    $this->assertEquals(1, $rows);
    addFriend(2, 'Bobby');
    $friendship = getFriendship(1, 'Boss');
    $rows = count($friendship);
    $this->assertEquals(2, $rows);
    deleteFriend(1, 'Boss');
  }

  public function testgetMutualFriends() {
    deleteFriend(1, 'Boss');
    $this->assertEquals(0, count(getMutualFriends('Bobby')));
    addFriend(1, 'Boss');
    $this->assertEquals(0, count(getMutualFriends('Bobby')));
    addFriend(2, 'Bobby');
    $this->assertEquals(1, count(getMutualFriends('Bobby')));
    $this->assertEquals('Boss', getMutualFriends('Bobby')[0]['username']);
    deleteFriend(1, 'Boss');
  }

  public function testgetFriendRequests() {
    deleteFriend(1, 'Boss');
    $this->assertEquals(0, count(getFriendRequests('Bobby')));
    addFriend(2, 'Bobby');
    $this->assertEquals(1, count(getFriendRequests('Bobby')));
    $this->assertEquals('Boss', getFriendRequests('Bobby')[0]['username']);
    addFriend(1, 'Boss');
    $this->assertEquals(0, count(getFriendRequests('Bobby')));
    deleteFriend(1, 'Boss');
  }

  public function testgetPendingFriends() {
    deleteFriend(1, 'Boss');
    $this->assertEquals(0, count(getPendingFriends('Bobby')));
    addFriend(2, 'Bobby');
    $this->assertEquals(0, count(getPendingFriends('Bobby')));
    deleteFriend(1, 'Boss');
    addFriend(1, 'Boss');
    $this->assertEquals(1, count(getPendingFriends('Bobby')));
    $this->assertEquals('Boss', getPendingFriends('Bobby')[0]['username']);
    addFriend(2, 'Bobby');
    $this->assertEquals(0, count(getPendingFriends('Bobby')));
    deleteFriend(1, 'Boss');
  }

  public function testgetLastLoggedIn() {
    $this->assertTrue('1' < count(getLastLoggedIn()));
  }
  public function testgetNewUsers() {
    $this->assertTrue('1' < count(getNewUsers()));
  }
}
