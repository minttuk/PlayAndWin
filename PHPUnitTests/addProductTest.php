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
connect();

final class addProductTest extends TestCase{

    public function testgetAdmin(){
        $this->expectOutputString('{"admin":"0"}', getAdmin(1));
        //$this->expectOutputString('{"admin":"1"}', getAdmin(2));
    }

    public function testaddProduct(){
        addProduct('testname', '1000', 'testdescription', 'testurl');
        $id = R::getCell( 'SELECT MAX(ID) FROM product');

        $name = R::getCell( 'SELECT name FROM product WHERE id = '.$id);
        $this->assertEquals('testname', $name);

        $price = R::getCell( 'SELECT price FROM product WHERE id = '.$id);
        $this->assertEquals('1000', $price);

        $description = R::getCell( 'SELECT description FROM product WHERE id = '.$id);
        $this->assertEquals('testdescription', $description);

        $url = R::getCell( 'SELECT image_url FROM product WHERE id = '.$id);
        $this->assertEquals('testurl', $url);

        R::exec( 'DELETE FROM product WHERE id = '.$id);

    }

}
