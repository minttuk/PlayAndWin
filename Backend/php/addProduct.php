<?php

/**
 * Adds a product to the webstore.
 *
 * The product information is passed through the body of an ajax call. The new product is added to the
 * database table of products with the information given.
 */
function addProduct(){

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

/**
 * Checks the admin status of the user signed in. Returns a boolean value of the admin status.
 */
function getAdmin($id){
    if ($id != -1){
        $user = R::load('user', $id);
        $admin = $user->admin;
    }
    else{
        $admin = null;
    }
    echo json_encode(array('admin'=>$admin));
}
