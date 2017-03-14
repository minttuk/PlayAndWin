<?php
/**
 * Created by PhpStorm.
 * User: minttu
 * Date: 14-Mar-17
 * Time: 13:12
 */

use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
include '../Backend/php/connection.php';
require '../Backend/php/addProduct.php';

final class buyProductTest extends TestCase{

    public function testgetAdmin(){
        $this->assertEquals(0, getAdmin(1));
        $this->assertEquals(1, getAdmin(2));

    }

}