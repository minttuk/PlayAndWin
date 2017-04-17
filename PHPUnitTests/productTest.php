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

final class productTest extends TestCase{

    /**
     * Tests that a product is added to the database.
     */
    public function testaddProduct(){
        addProduct(2, 'testname', '1000', 'testdescription', 'testurl', '50', 'en');
        $id = R::getCell( 'SELECT MAX(ID) FROM product');

        $name = R::getCell( 'SELECT name_en FROM product_en WHERE id = '.$id);
        $this->assertEquals('testname', $name);

        $price = R::getCell( 'SELECT price FROM product WHERE id = '.$id);
        $this->assertEquals('1000', $price);

        $description = R::getCell( 'SELECT description_en FROM product_en WHERE id = '.$id);
        $this->assertEquals('testdescription', $description);

        $url = R::getCell( 'SELECT image_url FROM product WHERE id = '.$id);
        $this->assertEquals('testurl', $url);

        R::exec( 'DELETE FROM product WHERE id = '.$id);
        R::exec( 'DELETE FROM product_en WHERE id = '.$id);

    }

    /**
     * Tests that a shoporder row is correctly added.
     */
    public function testmakeShopOrder(){
        makeShopOrder(1, 1);
        $id = R::getCell( 'SELECT MAX(ID) FROM shoporder');
        $user_id = R::getCell( 'SELECT user_id FROM shoporder WHERE id = '.$id);
        $this->assertEquals(1, $user_id);
        $product_id = R::getCell('SELECT product_id FROM shoporder WHERE id = '.$id);
        $this->assertEquals(1, $product_id);

        R::exec( 'DELETE FROM shoporder WHERE id = '.$id );
    }


    /**
     * Test that the product amount in product table can be updated correctly.
     */
    public function testupdateProductAmount(){
        $old_amount = R::getCell('SELECT amount FROM product WHERE id = 1');
        updateProductAmount(1, 20);
        $new_amount = R::getCell('SELECT amount FROM product WHERE id = 1');
        $this->assertEquals(20, $new_amount);
        R::exec('UPDATE product SET amount = '.$old_amount.' WHERE id = 1');

    }

    /**
     * Tests that a product is added to user's collection.
     */
    //function addToCollection($product_id, $coins_left, $session_id) ->(1,1,1)
    public function testaddToCollection(){
        $collection = R::load('collection',1);
        $products = json_decode($collection->products, true);
        $amount = $products["1"];
        $this->assertEquals('You have bought this product! You have 1 coins left.',addToCollection('1', '1', '1') );
        $collection2 = R::load('collection',1);
        $products2 = json_decode($collection2->products, true);
        $newAmount = $products2["1"];
        $this->assertEquals($amount+1, $newAmount);
        $products2["1"]--;
        $collection2->products = json_encode($products2);
        R::store($collection2);

    }

}
