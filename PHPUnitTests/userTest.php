<?php


use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
require './Backend/php/user.php';

final class userTest extends TestCase {
    public function testcheckEmpty() {
        $this->assertEquals(null, checkEmpty(''));
        $this->assertEquals('moi', checkEmpty('moi'));
        $this->assertEquals(null, checkEmpty('   '));
    }
}
