<?php


use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
//include './Backend/php/connection.php';
//require './Backend/php/rb.php';
require_once '../rest/dependencies/models/chat.php';

final class chatTest extends TestCase {
  public function testcardColor() {
      $this->assertEquals('background-color:#d2e2fa;', cardColor());
  }
}
