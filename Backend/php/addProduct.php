<?php
/**
 * Created by PhpStorm.
 * User: minttu
 * Date: 19-Feb-17
 * Time: 10:14
 */

function addProduct(){

    R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );

    $value = json_decode(file_get_contents('php://input'), true);
    $name = $value['name'];
    $price = $value['price'];
    $description = $value['description'];
    $image_url = $value['image_url'];

    $product = R::dispense( 'product' );

    $product->name = $name;
    $product->price = $price;
    $product->description = $description;
    $product->image_url = $image_url;

    R::store( $product );

}
