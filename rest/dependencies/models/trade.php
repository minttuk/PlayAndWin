<?php
/**
* Adds new trade to the trades table
*
*@param seller id, product id, trade price, trade description
*@return message to inform if tradable product was added successfully
*/

function addNewTrade($userid, $productid, $tradeprice, $tradedescription) {
  if (userHasProduct($userid, $productid)) {
    if (notAlreadyForTrade($userid, $productid)) {
      $trade = R::dispense('trades');
      $trade->seller_id = $userid;
      $trade->product_id = $productid;
      $trade->price = $tradeprice;
      $trade->description = $tradedescription;
      R::store($trade);
      $msg = array("success" => "Product has been put for sale!");
    } else {
      $msg = array("error" => "Seems like you are already trading this product! Please choose another product to sell.");
    }
  } else {
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
  foreach ($products as $key => $value) {
    if ($key == $productid && $value > 0) {
      return true;
    }
  }
  return false;
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
  foreach ($products as $key => $value) {
    if ($key == $productid) {
      if ($value > $opentrades) {
        return true;
      }
    }
  }
  return false;
}

/**
* Counts how many trades the current user has for a specific product
*
*@param userid is the current user and productid is the id of the product
*@return int count of trades
*/

function countOpenTrades($userid, $productid) {
  $result = R::getAll('SELECT COUNT(*) AS count FROM trades WHERE seller_id = :userid AND product_id = :productid
    AND buyer_id IS NULL', [':userid' => $userid, ':productid' => $productid]);
  return $result[0]['count'];
}

/**
* Returns all trade rows where the current user is either a seller or buyer
*
*@param userid is the current user
*@return An array of trades
*/

function getTradeHistory($id,$lang=null) {
  $response = array(
    'opentrades' => formProperReturn(getOpenTrades($id),$lang),
    'buyinghistory' => formProperReturn(getTradeBuyingHistory($id),$lang),
    'sellinghistory' => formProperReturn(getTradeSellingHistory($id),$lang)
  );
  return $response;
}

/**
* Checks that the user has this product in the collection
*
*@param userid is the current user and productid is the id of the product
*@return boolean true or false
*/

function formProperReturn($trades,$lang=null) {
  if ($trades == null) {
    return null;
  }
  $result = array();
  foreach ($trades as $trade => $value) {
    $result[] = array(
      'id' => $value['id'],
      'name' => getProductAttribute($value['product_id'],'name',$lang),
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
    $result = R::getAll('SELECT * FROM trades WHERE (seller_id = :id AND buyer_id IS NULL)', [':id' => $id]);
  }
  else {
    $result = R::getAll('SELECT * FROM trades WHERE buyer_id IS NULL');
  }
  return $result;
}

function getActiveTrades($lang=null) {
  $trades = getOpenTrades(null);
  $active = array();
  foreach ($trades as $trade) {
    $trade['name'] = getProductAttribute($trade['product_id'],'name',$lang);
    $trade['image_url'] = getProductAttribute($trade['product_id'],'image_url');
    if ($trade['description']=='') $trade['description'] = getProductAttribute($trade['product_id'],'description',$lang);
    unset($trade['seller_id']);
    unset($trade['product_id']);
    unset($trade['buyer_id']);
    unset($trade['trade_time']);
    $active[] = $trade;
  }
  return $active;
}


/**
* Gets all the rows from database where current user is the buyer
*
*@param id is the current user
*@return An array of trades
*/

function getTradeBuyingHistory($id) {
  $result = R::getAll('SELECT * FROM trades WHERE buyer_id = :id', [':id' => $id]);
  return $result;
}

/**
* Gets all the rows from database where current user is the seller and buyer is not null
*
*@param id is the current user
*@return An array of trades
*/

function getTradeSellingHistory($id) {
  $result = R::getAll('SELECT * FROM trades WHERE (seller_id = :id AND buyer_id IS NOT NULL)', [':id' => $id]);
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
  //$response = array("error" => $price);
  if ($tradetoedit->seller_id == $userid && $tradetoedit->buyer_id == null) {
    $tradetoedit->price = $price;
    $tradetoedit->description = $description;
    R::store($tradetoedit);
    $response = array("success" => "Trade information edited successfully!");
  }
  return $response;
}

/**
 * When buying a traded product, this function makes changes to buyer's and seller's coins and
 * collection. Trade information is saved in the trades database table.
 *
 * @param int $buyer_id is the id number of the buyer.
 * @param int $trade_id is the id number of the trade.
 * @return string
 */
function buyTradeProduct($buyer_id, $trade_id){
  $trade = R::load('trades', $trade_id);
  $buyer = R::load('user', $buyer_id);
  //check if user has enough coins
  if($buyer->coins < $trade->price){
    return 'trade_buy_failure';
  }
  else{
    $seller_id = $trade->seller_id;
    $buyer->coins = $buyer->coins-$trade->price;
    $trade->buyer_id = $buyer_id;
    $trade->trade_time = date("Y-m-d H:i:s");//CURRENT_TIMESTAMP;
    //product added to buyer's collection
      addToCollection($trade->product_id, $buyer->coins, $buyer->id);
      R::store($buyer);
    //product removed from seller's collection
      removeFromCollection($trade->seller_id, $trade->product_id);
      addCoinsToUser($seller_id, $trade->price);
    R::store($trade);
    return 'You have bought this product!';
  }
}

/**
 * Removes a product from user's collection
 * @param int $user_id is the id number of the user
 * @param int $product_id is the id number of the product
 */
function removeFromCollection($user_id, $product_id){
    $collection = R::load('collection',$user_id);
    $products = json_decode($collection->products, true);
    $products[$product_id]--;
    $collection->products = json_encode($products);
    R::store($collection);
}

/**
 * Adds amount of coins given in the parameter to the user.
 * @param int $user_id is the id number of the user.
 * @param int $coins_added is the amount of coins to be added to the user.
 */
function addCoinsToUser($user_id, $coins_added){
  $user = R::load('user', $user_id);
  $user->coins = $user->coins + $coins_added;
  R::store($user);
}

?>
