<?php
/**
 * Created by PhpStorm.
 * User: minttu
 * Date: 14-Mar-17
 * Time: 13:12
 */

use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
require_once '../rest/dependencies/require_all.php';

final class addProductTest extends TestCase{

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

    //function makeShopOrder($user_id) -> 1
    //function makeOrderRow($product_id) ->1
    public function testmakeShopOrder(){
        makeShopOrder(1);
        $id = R::getCell( 'SELECT MAX(ID) FROM shoporder');
        $user_id = R::getCell( 'SELECT user_id FROM shoporder WHERE id = '.$id);
        $this->assertEquals(1, $user_id);

        makeOrderRow(1);
        $product_id = R::exec( 'SELECT product_id FROM order_row WHERE order_id = '.$id );
        $this->assertEquals(1, $product_id);

        R::exec( 'DELETE FROM order_row WHERE order_id = '.$id );
        R::exec( 'DELETE FROM shoporder WHERE id = '.$id );
    }

    //function addToCollection($product_id, $coins_left, $session_id) ->(3,1,1)
    public function testaddToCollection(){
        $collection = R::load('collection',1);
        $products = json_decode($collection->products, true);
        $amount = $products[3];
        $this->expectOutputString('{"message":"You have bought this product! You have 1 coins left."}', addToCollection('1', '1', '1') );
        $collection2 = R::load('collection',1);
        $products2 = json_decode($collection2->products, true);
        $newAmount = $products2[3];
        $this->assertEquals($amount+1, $newAmount);
        $products2[3]--;
        $collection2->products = json_encode($products2);
        R::store($collection2);

    }

}
