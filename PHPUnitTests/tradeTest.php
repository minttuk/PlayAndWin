<?php


use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
require_once '../rest/dependencies/require_all.php';

final class tradeTest extends TestCase {
  /*
  * Tests that addNewTrade adds a new trade to the database
  */

  public function testaddNewTrade() {
    R::exec('UPDATE collection set products = '{"1": 1}' WHERE id = :id', [':id' => $user]);
    //R::exec('insert into collection VALUES(1, "{"1": 1}")');
    $user = 1;
    $product = 1;
    $price = 999;
    $desc = 'test';
    // Testing to insert a new trade

    R::exec('DELETE FROM trades WHERE seller_id = :id', [':id' => $user]);
    $response = addNewTrade($user, $product, $price, $desc);
    $this->assertEquals('Product has been put for sale!', $response['success']);
    // Testing to insert a trade with a product that user does not have
    $response = addNewTrade($user, 2, $price, $desc);
    $this->assertEquals('Oops! You don\'t seem to own this product. Make sure you filled in the right product!', $response['error']);
    // Test trade gets removed
    R::exec('DELETE FROM trades WHERE seller_id = :id', [':id' => $user]);
  }

  /*
  * Tests that countOpenTrades returns the right amount of trades by user.
  */

  public function testcountOpenTrades() {
    R::exec('UPDATE collection set products = '{"1": 1}' WHERE id = :id', [':id' => $user]);
    $user = 1;
    $product = 1;
    $price = 999;
    $desc = 'test';
    R::exec('DELETE FROM trades WHERE seller_id = :id', [':id' => $user]);
    // Counts rows where seller is user and product is 5
    $this->assertEquals(0, countOpenTrades($user, $product));
    $response = addNewTrade($user, $product, $price, $desc);
    $this->assertEquals(1, countOpenTrades($user, $product));
    R::exec('DELETE FROM trades WHERE seller_id = :id', [':id' => $user]);
    $this->assertEquals(0, countOpenTrades($user, $product));
  }

  /*
  * Tests that a trades price and description can be edited with editTrade()
  */

  public function testeditTrade() {
    R::exec('UPDATE collection set products = '{"1": 1}' WHERE id = :id', [':id' => $user]);
    $user = 1;
    $product = 1;
    $price = 999;
    $newprice = 500;
    $desc = 'test';
    $newdesc = 'uusi testi';
    R::exec('DELETE FROM trades WHERE seller_id = :id', [':id' => $user]);
    addNewTrade($user, $product, $price, $desc);
    $trades = getOpenTrades($user);
    editTrade($user, $trades[0]['id'], $newprice, $newdesc);
    $trades = getOpenTrades($user);
    $this->assertEquals($newprice, $trades[0]['price']);
    $this->assertEquals($newdesc, $trades[0]['description']);
    R::exec('DELETE FROM trades WHERE seller_id = :id', [':id' => $user]);
  }

  /*
  * Tests that a trade can be deleted from database with deleteTrade()
  */

  public function testdeleteTrade() {
    R::exec('UPDATE collection set products = '{"1": 1}' WHERE id = :id', [':id' => $user]);
    $user = 1;
    $product = 1;
    $price = 999;
    $desc = 'test';
    R::exec('DELETE FROM trades WHERE seller_id = :id', [':id' => $user]);
    addNewTrade($user, $product, $price, $desc);
    $trades = getOpenTrades($user);
    $this->assertEquals(1, countOpenTrades($user, $product));
    deleteTrade($user, $trades[0]['id']);
    $this->assertEquals(0, countOpenTrades($user, $product));
    R::exec('DELETE FROM trades WHERE seller_id = :id', [':id' => $user]);
  }

  /*
  * Tests that userHasProduct() returns true if user has the product and false if user doesn't have it.
  */

  public function testuserHasProduct() {
    R::exec('UPDATE collection set products = '{"1": 1}' WHERE id = :id', [':id' => $user]);
    $user = 1;
    $this->assertEquals(true, userHasProduct($user, 1));
    $this->assertEquals(false, userHasProduct($user, 2));
  }

    /**
     * Tests that coins are added corrected to the user.
     */

  public function testaddCoinsToUser(){
      $old_coins = R::getCell('SELECT coins FROM user WHERE id = 1');
      addCoinsToUser(1, 50);
      $new_coins = R::getCell('SELECT coins FROM user WHERE id = 1');
      $this->assertEquals($old_coins + 50, $new_coins);
      R::exec('UPDATE user SET coins = '.$old_coins.' WHERE id = 1');
  }

    /**
     * Tests that a product is removed from collection.
     */

  public function testremoveFromCollection(){
      R::exec('UPDATE collection set products = '{"1": 1}' WHERE id = :id', [':id' => $user]);
      $collection = R::load('collection', 1);
      $products = json_decode($collection->products, true);
      $amount = $products["1"];
      removeFromCollection(1,1);
      $collection2 = R::load('collection',1);
      $products2 = json_decode($collection2->products, true);
      $newAmount = $products2["1"];
      $this->assertEquals($amount-1, $newAmount);
      $products2["1"]++;
      $collection2->products = json_encode($products2);
      R::store($collection2);
  }

}
