<?php
/**
 * Created by PhpStorm.
 * User: minttu
 * Date: 09-Mar-17
 * Time: 16:33
 */
use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
include './Backend/php/connection.php';
require './Backend/php/buyProduct.php';

final class buyProductTest extends TestCase{

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

    //function addToCollection($product_id, $coins_left, $session_id) ->(1,1,3)
    //To be finished later. This test expects that there is a user 3 and a collection_3 table.
    public function testaddToCollection(){
        $amount = R::getCell( 'SELECT amount FROM collection_3 WHERE id = 1');
        $this->expectOutputString('{"message":"You have bought this product! You have 1 coins left."}', addToCollection('1', '1', '3') );
        $newAmount = R::getCell( 'SELECT amount FROM collection_3 WHERE id = 1');
        $this->assertEquals($amount+1, $newAmount);
        R::exec( 'UPDATE collection_3 SET amount = '.$amount.' WHERE id = 1');


    }


}