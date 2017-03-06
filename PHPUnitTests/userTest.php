<?php


use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
require './Backend/php/user.php';

final class userTest extends TestCase
{
    public function testcheckEmpty()
    {
        $this->assertEquals(null, checkEmpty(''));
        $this->assertEquals('moi', checkEmpty('moi'));
    }

/*
    public function testCannotBeCreatedFromInvalidEmailAddress()
    {
        $this->expectException(InvalidArgumentException::class);

        Email::fromString('invalid');
    }

    public function testCanBeUsedAsString()
    {
        $this->assertEquals(
            'user@example.com',
            Email::fromString('user@example.com')
        );
    }
    */
}
