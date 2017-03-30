<?php


use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
//include './Backend/php/connection.php';
//require './Backend/php/rb.php';
require_once '../rest/dependencies/require_all.php';

final class searchTest extends TestCase {
  public function searchUsersTest() {
      $this->assertEquals('Bobby',json_decode(searchUsers('bob'))['name'];
  }
}
