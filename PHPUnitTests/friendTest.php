<?php

use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
require_once '../rest/dependencies/require_all.php';

final class friendTest extends TestCase {

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
      $this->assertEquals(0, count(getFriendRequests(1)));
      addFriend(2, 'Bobby');
      $this->assertEquals(0, count(getFriendRequests(2)));
      $this->assertEquals(1, count(getFriendRequests(1)));
      $this->assertEquals('Boss', getFriendRequests(1)[0]['username']);
      addFriend(1, 'Boss');
      $this->assertEquals(0, count(getFriendRequests(1)));
      deleteFriend(1, 'Boss');
    }

    public function testgetPendingFriends() {
      deleteFriend(1, 'Boss');
      $this->assertEquals(0, count(getPendingFriends(1)));
      addFriend(2, 'Bobby');
      $this->assertEquals(0, count(getPendingFriends(1)));
      deleteFriend(1, 'Boss');
      addFriend(1, 'Boss');
      $this->assertEquals(1, count(getPendingFriends(1)));
      $this->assertEquals('Boss', getPendingFriends(1)[0]['username']);
      addFriend(2, 'Bobby');
      $this->assertEquals(0, count(getPendingFriends(1)));
      deleteFriend(1, 'Boss');
    }
}
