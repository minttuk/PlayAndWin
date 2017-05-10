<?php

use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
require_once '../rest/dependencies/require_all.php';

final class friendTest extends TestCase {

    /*
    * Tests that getFriendsCount returns the amount of mutual friends by a user
    */

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

    /*
    * Tests that a friend can be added and that it can't be added many times
    */

    public function testaddFriend() {
      $this->assertEquals(addFriend(null, 'Boss'), ['message' => 'No session id']);
      $this->assertEquals(addFriend(1, 'Boss'), ['message' => 'Friend added succesfully!']);
      $this->assertEquals(addFriend(1, 'Boss'), ['message' => 'Friend has already been added']);
    }

    /*
    * Tests that a friend can be deleted
    */

    public function testdeleteFriend() {
      $this->assertEquals(deleteFriend(null, 'Boss'), ['message' => 'No session id']);
      $this->assertEquals(deleteFriend(1, 'Boss'), ['message' => 'Friend deleted succesfully!']);
    }

    /*
    * Tests that getFriendship returns the right amount of rows.
    * 0 row means no requests or friendship. 1 means that a request has been sent
    * and 2 means that it's a mutual friendship
    */

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

    /*
    * Tests that getMutualFriends returns friends with mutual friendship
    */

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

    /*
    * Tests that getFriendRequests returns only users information that have sent a friend request to the user in test case
    */

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

    /*
    * Tests that getPendingFriends() returns only users information of the users
    * that the test case user has sent a friend requet to
    */

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
