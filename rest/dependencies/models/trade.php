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

/**
* Checks that the user has this product in the collection
*
*@param userid is the current user and productid is the id of the product
*@return boolean true or false
*/

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

/**
* Checks if the user has already as mane trades for some product as he owns them
*
*@param userid is the current user and productid is the id of the product
*@return boolean true or false
*/

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

/**
* Counts how many trades the current user has for a specific product
*
*@param userid is the current user and productid is the id of the product
*@return int count of trades
*/

function countOpenTrades($userid, $productid) {
  $result = R::getAll('SELECT COUNT(*) AS count FROM trades WHERE seller_id = :userid AND product_id = :productid AND buyer_id IS NULL', [':userid' => $userid, ':productid' => $productid]);
  return $result[0]['count'];
}

/**
* Returns all trade rows where the current user is either a seller or buyer
*
*@param userid is the current user
*@return An array of trades
*/

function getTradeHistory($id) {
  $response = array(
    'opentrades' => formProperReturn(getOpenTrades($id)),
    'buyinghistory' => formProperReturn(getTradeBuyingHistory($id)),
    'sellinghistory' => formProperReturn(getTradeSellingHistory($id))
  );
  return $response;
}

/**
* Checks that the user has this product in the collection
*
*@param userid is the current user and productid is the id of the product
*@return boolean true or false
*/

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

/**
* Gets all the rows from database where current user is the seller and buyer is null
*
*@param id is the current user
*@return An array of trades
*/

function getOpenTrades($id) {
  if ($id != null) {
    $result = R::getAll('SELECT * FROM trades WHERE (seller_id = :sessionid AND buyer_id IS NULL)', [':sessionid' => $id]);
  }
  else {
    $result = R::getAll('SELECT * FROM trades WHERE buyer_id IS NULL');
  }
  return $result;
}

/**
* Gets all the rows from database where current user is the buyer
*
*@param id is the current user
*@return An array of trades
*/

function getTradeBuyingHistory($id) {
  $result = R::getAll('SELECT * FROM trades WHERE buyer_id = :sessionid', [':sessionid' => $id]);
  return $result;
}

/**
* Gets all the rows from database where current user is the seller and buyer is not null
*
*@param id is the current user
*@return An array of trades
*/

function getTradeSellingHistory($id) {
  $result = R::getAll('SELECT * FROM trades WHERE (seller_id = :sessionid AND buyer_id IS NOT NULL)', [':sessionid' => $id]);
  return $result;
}

/**
* Deletes trade by id Checks that product has not been bought yet before deleting.
*
*@param userid is the current user and tradeid is the id of the traderow
*@return An array with success or error message
*/

function deleteTrade($userid, $tradeid) {
  $tradetoremove = R::load('trades', $tradeid);
  $response = array("error" => "Could not delete trade.");
  if ($tradetoremove->seller_id == $userid && $tradetoremove->buyer_id == null) {
    R::trash($tradetoremove);
    $response = array("success" => "Trade deleted successfully!");
  }
  return $response;
}

/**
* Edits trade by id. Checks that product has not been bought yet before editing.
*
*@param userid is the current user and tradeid is the id of the traderow
*@return An array with success or error message
*/

function editTrade($userid, $id, $price, $description) {
  $tradetoedit = R::load('trades', $id);
  $response = array("error" => "Could not edit trade.");
  //$response = array("error" => $trade["id"]);
  if ($tradetoedit->seller_id == $userid && $tradetoedit->buyer_id == null) {
    $tradetoedit->price = $price;
    $tradetoedit->description = $description;
    R::store($tradetoedit);
    $response = array("success" => "Trade information edited successfully!");
  }
  return $response;
}

?>
