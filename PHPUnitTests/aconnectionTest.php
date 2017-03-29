<?php

use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();

require_once '../rest/dependencies/models/connection.php';

final class connectionTest extends TestCase {
  public function testConnect() {
      $this->assertEquals(true, connect());
  }
}
