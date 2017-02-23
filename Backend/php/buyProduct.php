<?php

/**
 * Created by PhpStorm.
 * User: minttu
 * Date: 22-Feb-17
 * Time: 21:01
 */

//in progress....
function buyProduct(){

    R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );

    $value = json_decode(file_get_contents('php://input'), true);
    $user_id = $value['user_id'];
    $product_id = $value['product_id'];

    //$user_coins = json_encode(R::getCell( 'SELECT coins FROM user WHERE id = :user_id', [':user_id' => $user_id]));
    $user_coins = R::getCell( 'SELECT coins FROM user WHERE id = :user_id', [':user_id' => $user_id]);
    $product_price = R::getCell( 'SELECT price FROM product WHERE id = :product_id', [':product_id' => $product_id]);
    if ($user_coins<$product_price){
        echo "You do not have enough coins to buy this product";
    }
    //order id, order row etc... is to be added below.... in progress...
    else{
        $coins_left = $user_coins-$product_price;
        R::exec( 'UPDATE user SET coins = :coins_left WHERE id = :user_id', [':coins_left' => $coins_left,':user_id' => $user_id]);
        echo "You have bought this product!";
    }
    //$msg[] = array("user_coins"=> $user_coins);
    //echo $user_coins; //$jsonformat=json_encode($msg);


}