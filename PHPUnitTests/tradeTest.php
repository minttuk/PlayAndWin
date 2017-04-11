<?php


use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
require_once '../rest/dependencies/require_all.php';

final class tradeTest extends TestCase {

  public function testaddNewTrade() {
    $user = 1;
    $product = 1;
    $price = 999;
    $desc = 'test';
    // Testing to insert a new trade
    R::exec('DELETE FROM trades WHERE seller_id = :id', [':id' => $user]);
    $response = addNewTrade($user, $product, $price, $desc);
    $this->assertEquals('Product has been put for sale!', $response['success']);
    // Testing to insert the same trade twice
    $response = addNewTrade($user, $product, $price, $desc);
    $this->assertEquals('Seems like you are already trading this product! Please choose another product to sell.', $response['error']);
    // Testing to insert a trade with a product that user does not have
    $response = addNewTrade($user, 2, $price, $desc);
    $this->assertEquals('Oops! You don\'t seem to own this product. Make sure you filled in the right product!', $response['error']);
    // Test trade gets removed
    R::exec('DELETE FROM trades WHERE seller_id = :id', [':id' => $user]);
  }

  public function testcountOpenTrades() {
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

  public function testeditTrade() {
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

  public function testdeleteTrade() {
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

  public function testuserHasProduct() {
    $user = 1;
    $this->assertEquals(true, userHasProduct($user, 1));
    $this->assertEquals(false, userHasProduct($user, 2));
  }

}
