<?php

function getProducts(){
  return json_encode(R::getAll( 'SELECT * FROM product' ),JSON_PRETTY_PRINT);
}

/**
 * Buying a product from the webstore.
 *
 * Gets the product id through the body of an ajax call. If the user is signed in, it checks if the user
 * has enough coins to buy the product. If the user has enough coins, it calls functions: makeShopOrder(),
 * makeOrderRow(), and addToCollection().
 *
 */

function buyProduct($id,$product_id){
    $user = R::load('user',$id);
    $product_price = R::getCell( 'SELECT price FROM product WHERE id = :product_id', [':product_id' => $product_id]);
    // Does the user have enough coins to buy this product?
    if ($user->coins<$product_price){
        return 'You cannot buy this yet. You need more coins.';
    } else {
        //If the user can buy the product subtract price from user's coins
        $user->coins = $user->coins-$product_price;
        makeShopOrder($user->id);
        makeOrderRow($product_id);
        R::store($user);
        return addToCollection($product_id, $user->coins,$id);
    }
}

/**
 * Inserts a line into shoporder table in database with user id given by parameter.
 *
 * @param int $user_id is the id number of the user signed in.
 */
function makeShopOrder($user_id){
    $shoporder = R::dispense( 'shoporder' );
    $shoporder->user_id = $user_id;
    R::store( $shoporder );
}

/**
 * Inserts a line into order_row table in database.
 *
 * @param int $product_id is the id number of the product bought.
 */
function makeOrderRow($product_id){
    R::exec( 'INSERT INTO order_row (order_id, product_id, amount) VALUES (LAST_INSERT_ID(), :product_id, 1)', [':product_id' => $product_id]);
}

/**
 * Adds a line to the user's collection table in the database.
 *
 * @param int $product_id is the id number of the product bought.
 * @param int $coins_left is the amount of coins the user has left after buying the product.
 * @param int $session_id is the id number of the user who has bought the product.
 */
function addToCollection($product_id, $coins, $session_id){
    $collection = R::load('collection',$session_id);
    $products = json_decode($collection->products, true);

    if ($products == null){
        $products = array($product_id=>1);
    } else if (array_key_exists($product_id, $products)){
        $products[$product_id]++;
    } else {
        $products[$product_id] = 1;
    }
    $collection->products = json_encode($products);
    R::store($collection);
    return 'You have bought this product! You have '.$coins.' coins left.';
}

/**
 * Adds a product to the webstore.
 *
 * The product information is passed through the parameters. The new product is added to the
 * database table of products with the information given.
 *
 * @param String $name
 * @param int $price
 * @param String $description
 * @param String $image_url
 *
 */
function addProduct($name, $price, $description, $image_url){
    $product = R::dispense('product');
    $product->name = $name;
    $product->price = $price;
    $product->description = $description;
    $product->image_url = $image_url;
    R::store($product);
}
