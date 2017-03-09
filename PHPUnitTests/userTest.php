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

    public function testgetUserInfo() {
      $response = getUserInfo('1');
      $this->assertEquals("No user found", $response);
    }
*/
    public function testgetFriendsCount() {
      $this->assertEquals("0", getFriendsCount('1'));
    }
}
