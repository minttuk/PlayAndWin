<?php

use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();

require_once '../rest/dependencies/require_all.php';

/*
* Tests that database connection works
*/

final class connectionTest extends TestCase {
  public function testConnect() {
      $this->assertEquals(true, connect());
  }
}
