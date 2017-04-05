<?php
/**
* Adds new trade to the trades table
*
*@param seller id, product id, trade price, trade description
*@return message to inform if tradable product was added successfully
*/

function addNewTrade($userid, $productid, $tradeprice, $tradedescription) {
  if (userHasProduct($userid, $productid)) {
    if (notALreadyForTrade($userid, $productid)) {
      $trade = R::dispense('trades');
      $trade->seller_id = $userid;
      $trade->product_id = $productid;
      $trade->price = $tradeprice;
      $trade->description = $tradedescription;
      R::store($trade);
      $msg = array("success" => "Product has been put for sale!");
    }
    else {
      $msg = array("error" => "Seems like you are already trading this product! Please choose another product to sell.");
    }
  }
  else {
    $msg = array("error" => "Oops! You don't seem to own this product. Make sure you filled in the right product!");
  }
  return $msg;
}

function userHasProduct($userid, $productid) {
  $products = collection($userid);
  $result = false;
  foreach ($products as $key => $value) {
    if ($key == $productid && $value > 0) {
      $result = true;
    }
  }
  return $result;
}

//Work in progress - Check that open trades do not exceed the amount of this product owned by the user
function notAlreadyForTrade($userid, $productid) {
  $products = collection($userid);
  $opentrades = countOpenTrades($userid, $productid);
  $result = false;
  foreach ($products as $key => $value) {
    if ($key == $productid) {
      if ($value > $opentrades) {
        $result = true;
      }
    }
  }
  return $result;
}

function countOpenTrades($userid, $productid) {
  $result = R::getAll('SELECT COUNT(*) AS count FROM trades WHERE seller_id = :userid AND product_id = :productid AND buyer_id IS NULL', [':userid' => $userid, ':productid' => $productid]);
  return $result[0]['count'];
}

function getTradeHistory($id) {
  $response = array(
    'opentrades' => formProperReturn(getOpenTrades($id)),
    'buyinghistory' => formProperReturn(getTradeBuyingHistory($id)),
    'sellinghistory' => formProperReturn(getTradeSellingHistory($id))
  );
  return $response;
}

function formProperReturn($trades) {
  if ($trades == null) {
    return null;
  }
  $result = array();
  foreach ($trades as $trade => $value) {
    $product = getProductById($value['product_id']);
    $result[] = array(
      'id' => $value['id'],
      'name' => $product->name,
      'price' => $value['price'],
      'description' => $value['description'],
      'time' => $value['trade_time']
    );
  }
  return $result;
}

function getOpenTrades($id) {
  if ($id != null) {
    $result = R::getAll('SELECT * FROM trades WHERE (seller_id = :sessionid AND buyer_id IS NULL)', [':sessionid' => $id]);
  }
  else {
    $result = R::getAll('SELECT * FROM trades WHERE buyer_id IS NULL');
  }
  return $result;
}

function getTradeBuyingHistory($id) {
  $result = R::getAll('SELECT * FROM trades WHERE buyer_id = :sessionid', [':sessionid' => $id]);
  return $result;
}

function getTradeSellingHistory($id) {
  $result = R::getAll('SELECT * FROM trades WHERE (seller_id = :sessionid AND buyer_id IS NOT NULL)', [':sessionid' => $id]);
  return $result;
}

?>
