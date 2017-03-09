<?php


use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
include './Backend/php/connection.php';
//require './Backend/php/rb.php';
require './Backend/php/user.php';

final class userTest extends TestCase {
  public function testcheckEmpty() {
      $this->assertEquals(null, checkEmpty(''));
      $this->assertEquals('moi', checkEmpty('moi'));
      $this->assertEquals(null, checkEmpty('   '));
  }
/*
    public function testgetNewUsers() {

    }
    */
/*
    public function testgetUserInfo() {
      $response = getUserInfo('1');
      $this->assertEquals("No user found", $response['message']);
    }
*/
  public function testgetFriendsCount() {
    deleteFriend('1', '2');
    $this->assertEquals("0", getFriendsCount('1'));
    addFriend('1', '2');
    $this->assertEquals("0", getFriendsCount('1'));
    addFriend('2', '1');
    $this->assertEquals("1", getFriendsCount('1'));
    deleteFriend('1', '2');
    $this->assertEquals("0", getFriendsCount('1'));
  }

  public function testaddFriend() {
    $this->assertJsonStringEqualsJsonString(
    addFriend('1,', '2'),
    json_encode(['message' => 'Friend added succesfully!'])
    );
  }

  public function testdeleteFriend() {
    $this->assertJsonStringEqualsJsonString(
    deleteFriend('1,', '2'),
    json_encode(['message' => 'Friend deleted succesfully!'])
    );
  }
}
