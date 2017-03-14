<?php

use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();

require_once '../Backend/php/connection.php';

final class connectionTest extends TestCase {
  public function testConnect() {
      $this->assertEquals(true, connect());
  }
}
