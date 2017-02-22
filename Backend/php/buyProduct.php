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
    $product_prise = R::getCell( 'SELECT prise FROM product WHERE id = :product_id', [':product_id' => $product_id]);
    echo $user_coins;

}