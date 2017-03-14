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

final class addProductTest extends TestCase{

    public function testgetAdmin(){
        $this->expectOutputString('{"admin":"0"}', getAdmin(1));
        //$this->expectOutputString('{"admin":"1"}', getAdmin(2));
    }

}