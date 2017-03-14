<?php

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

    $product = R::dispense( 'product' );

    $product->name = $name;
    $product->price = $price;
    $product->description = $description;
    $product->image_url = $image_url;

    R::store( $product );

}

/**
 * Checks the admin status of the user signed in. Returns a boolean value of the admin status.
 *
 * @param int $id is the id number of the user
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
