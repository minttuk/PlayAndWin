<?php


use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
//include './Backend/php/connection.php';
//require './Backend/php/rb.php';
require_once '../rest/dependencies/require_all.php';

final class userTest extends TestCase {

  public function testcheckEmpty() {
    $this->assertEquals(null, checkEmpty(''));
    $this->assertEquals('moi', checkEmpty('moi'));
    $this->assertEquals(null, checkEmpty('   '));
  }

  public function testgetAdmin(){
        $this->expectOutputString('', getAdmin(-1));
        //$this->expectOutputString('{"admin":"1"}', getAdmin(2));
  }

  public function testgetUserInfo() {
    $id = -1;
    $this->assertEquals(array('error'=>'No user found'), getUserInfo($id));
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
    $user = getUserInfo('assert');
    $this->assertEquals('assert', $user['firstname']);
    $this->assertEquals(null, $user['description']);
    setUserInfo(2, 'admin', 'admin', '', '');
  }

  public function testgetFriendsCount() {
    deleteFriend(1, 2);
    $this->assertEquals(0, getFriendsCount(1));
    addFriend(1, 2);
    $this->assertEquals(0, getFriendsCount(1));
    addFriend(2, 1);
    $this->assertEquals(1, getFriendsCount(1));
    deleteFriend(1, 2);
    $this->assertEquals(0, getFriendsCount(1));
  }

  public function testaddFriend() {
    $this->assertEquals(addFriend(-1, 2), ['message' => 'No session id']);
    $this->assertEquals(addFriend(1, 2), ['message' => 'Friend added succesfully!']);
    $this->assertEquals(addFriend(1, 2), ['message' => 'Friend has already been added']);
  }

  public function testdeleteFriend() {
    $this->assertEquals(deleteFriend(-1, 2), ['message' => 'No session id']);
    $this->assertEquals(deleteFriend(1, 2), ['message' => 'Friend deleted succesfully!']);
  }

  public function testgetFriendship() {
    $friendship = getFriendship(1, 2);
    $rows = count($friendship);
    $this->assertEquals(0, $rows);
    addFriend(1, 2);
    $friendship = getFriendship(1, 2);
    $rows = count($friendship);
    $this->assertEquals(1, $rows);
    addFriend(2, 1);
    $friendship = getFriendship(1, 2);
    $rows = count($friendship);
    $this->assertEquals(2, $rows);
    deleteFriend(1, 2);
  }

  public function testgetMutualFriends() {
    deleteFriend(1, 2);
    $this->assertEquals(0, count(getMutualFriends(1)));
    addFriend(1, 2);
    $this->assertEquals(0, count(getMutualFriends(1)));
    addFriend(2, 1);
    $this->assertEquals(1, count(getMutualFriends(1)));
    $this->assertEquals('Boss', getMutualFriends(1)[0]['username']);
    deleteFriend(1, 2);
  }

  public function testgetFriendRequests() {
    deleteFriend(1, 2);
    $this->assertEquals(0, count(getFriendRequests(1)));
    addFriend(2, 1);
    $this->assertEquals(1, count(getFriendRequests(1)));
    $this->assertEquals('Boss', getFriendRequests(1)[0]['username']);
    addFriend(1, 2);
    $this->assertEquals(0, count(getFriendRequests(1)));
    deleteFriend(1, 2);
  }

  public function testgetPendingFriends() {
    deleteFriend(1, 2);
    $this->assertEquals(0, count(getPendingFriends(1)));
    addFriend(2, 1);
    $this->assertEquals(0, count(getPendingFriends(1)));
    deleteFriend(1, 2);
    addFriend(1, 2);
    $this->assertEquals(1, count(getPendingFriends(1)));
    $this->assertEquals('Boss', getPendingFriends(1)[0]['username']);
    addFriend(2, 1);
    $this->assertEquals(0, count(getPendingFriends(1)));
    deleteFriend(1, 2);
  }

  public function testgetLastLoggedIn() {
    $this->assertTrue('1' < count(getLastLoggedIn()));
  }

  public function testgetNewUsers() {
    $this->assertTrue('1' < count(getNewUsers()));
  }

}
