<?php


use phpunit\Framework\TestCase;
echo "xxxxx" . getcwd();
require_once '../rest/dependencies/require_all.php';

final class tradeTest extends TestCase {

  public function testaddNewTrade() {
    $user = 1;
    $product = 5;
    $price = 999;
    $desc = 'test';
    // Testing to insert a new trade
    deleteTradeForTest($user, $product, $price, $desc);
    $response = addNewTrade($user, $product, $price, $desc);
    $this->assertEquals('Product has been put for sale!', $response['success']);
    // Testing to insert the same trade twice
    $response = addNewTrade($user, $product, $price, $desc);
    $this->assertEquals('Seems like you are already trading this product! Please choose another product to sell.', $response['error']);
    // Testing to insert a trade with a product that user does not have
    $response = addNewTrade($user, 1, $price, $desc);
    $this->assertEquals('Oops! You don\'t seem to own this product. Make sure you filled in the right product!', $response['error']);
    // Test trade gets removed
    deleteTradeForTest($user, $product, $price, $desc);
  }

  public function testcountOpenTrades() {
    $user = 1;
    $product = 5;
    $price = 999;
    $desc = 'test';
    deleteTradeForTest($user, $product, $price, $desc);
    // Counts rows where seller is user and product is 5
    $this->assertEquals(0, countOpenTrades($user, $product));
    $response = addNewTrade($user, $product, $price, $desc);
    $this->assertEquals(1, countOpenTrades($user, $product));
    deleteTradeForTest($user, $product, $price, $desc);
    $this->assertEquals(0, countOpenTrades($user, $product));
  }
}
