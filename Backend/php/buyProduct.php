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
    //$user_id = $value['user_id'];
    $product_id = $value['product_id'];

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

            //make shoporder
            $shoporder = R::dispense( 'shoporder' );
            $shoporder->user_id = $user_id;
            R::store( $shoporder );

            //make order row
            R::exec( 'INSERT INTO order_row (order_id, product_id, amount) VALUES (LAST_INSERT_ID(), :product_id, 1)', [':product_id' => $product_id]);

            //add product to user's collection


            $collection = 'collection_'.$_SESSION['id'];

            $product = R::load( 'collection_'.$_SESSION['id'], $product_id );
            $id = $product->id;
            if ($id == 0){
                R::exec( 'INSERT INTO '.$collection.'(id, amount) VALUES (:product_id, 1)', [':product_id' => $product_id]);
            }
            else{
                $amount = R::getCell( 'SELECT amount FROM '.$collection.' WHERE id = '.$product_id.'');
                $newAmount = $amount+1;
                R::exec( 'UPDATE '.$collection.' SET amount = '.$newAmount.' WHERE id = '.$product_id.'');
            }


            echo json_encode(array('message'=>'You have bought this product! You have '.$coins_left.' coins left.' .$id ));
        }
    }
    else {
        echo json_encode(array('message'=>'You need to sign in first!'));
    }


}