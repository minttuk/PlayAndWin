<?php


/**
 * Buying a product from the webstore.
 *
 * Gets the product id through the body of an ajax call. If the user is signed in, it checks if the user
 * has enough coins to buy the product. If the user has enough coins, it calls functions: makeShopOrder(),
 * makeOrderRow(), and addToCollection().
 *
 */
function buyProduct(){

    $value = json_decode(file_get_contents('php://input'), true);
    $product_id = $value['product_id'];
    //checks if the user is signed in or not.
    if (isset($_SESSION['id'])) {
        $user = R::load('user',$_SESSION['id']);
        $user_id = $user->id;
        $user_coins = R::getCell( 'SELECT coins FROM user WHERE id = :user_id', [':user_id' => $user_id]);
        $product_price = R::getCell( 'SELECT price FROM product WHERE id = :product_id', [':product_id' => $product_id]);

        // Does the user have enough coins to buy this product?
        if ($user_coins<$product_price){
            echo json_encode(array('message'=>'You cannot buy this yet. You need more coins.'));
        }
        //If the user can buy the product:
        else{
            //subtract price from user's coins
            $coins_left = $user_coins-$product_price;
            R::exec( 'UPDATE user SET coins = :coins_left WHERE id = :user_id', [':coins_left' => $coins_left,':user_id' => $user_id]);

            makeShopOrder($user_id);
            makeOrderRow($product_id);
            addToCollection($product_id, $coins_left,$_SESSION['id'] );
        }
    }
    else {
        echo json_encode(array('message'=>'You need to sign in first!'));
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
function addToCollection($product_id, $coins_left, $session_id){
    //$row = R::getCell( 'SELECT products FROM collection WHERE id = :id', [':id' => $session_id]);
    $collection = R::load('collection',$session_id);

    //$row will be in form {"product_id":amount, "product_id:amount...}
    $products = json_decode($collection->products, true);
    //$dataObject = json_decode($row, true);

    if ($products == null){
        //$arr = array("$product_id"=>"1");
        $products = array($product_id=>1);
    }
    else if (array_key_exists($product_id, $products)){
        //$amount = $dataObject[$product_id];
        //$newAmount = $amount+1;
        $products[$product_id]++;
    }
    else{
        $products[$product_id] = 1;
        //array_push($dataObject, 1);
    }
    //$newRow = json_encode($dataObject);
    $collection->products = json_encode($products);
    R::store($collection);
    //R::exec( 'UPDATE collection SET products = :newRow WHERE id = :id', [':newRow' => $newRow, ':id' => $session_id]);

    echo json_encode(array('message'=>'You have bought this product! You have '.$coins_left.' coins left.' ));
}
