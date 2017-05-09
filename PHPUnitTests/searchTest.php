<?php


use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
//include './Backend/php/connection.php';
//require './Backend/php/rb.php';
require_once '../rest/dependencies/require_all.php';

final class searchTest extends TestCase {

    /**
     * Tests that function searchUsers returns user
     */
    public function testsearchUsers() {
      $this->assertEquals('Bobby',searchUsers('bob')[0]['name']);
  }
}
