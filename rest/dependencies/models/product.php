<?php

function getProducts(){
  //return R::getAll( 'SELECT * FROM product WHERE amount > 0' );
  return R::getAll('SELECT * FROM product INNER JOIN product_en ON product.id = product_en.id INNER JOIN product_fi ON product.id = product_fi.id  WHERE amount > 0');
    //missing japanese cause could not get product_ja to work in mysql
}

/**
 * Buying a product from the webstore.
 *
 * Gets the product id through the body of an ajax call. If the user is signed in, it checks if the user
 * has enough coins to buy the product. If the user has enough coins, it calls functions: makeShopOrder()
 * and addToCollection().
 *
 */
function buyProduct($id,$product_id){
    $user = R::load('user',$id);
    $product_price = R::getCell( 'SELECT price FROM product WHERE id = :product_id', [':product_id' => $product_id]);
    $product_amount = R::getCell( 'SELECT amount FROM product WHERE id = :product_id', [':product_id' => $product_id]);
    //if there are products left to buy
    if($product_amount>0){
        // Does the user have enough coins to buy this product?
        if ($user->coins<$product_price){
            return 'You cannot buy this yet. You need more coins.';
        } else {
            //If the user can buy the product subtract price from user's coins
            $user->coins = $user->coins-$product_price;
            makeShopOrder($user->id, $product_id);
            updateProductAmount($product_id, $product_amount-1);
            R::store($user);
            return addToCollection($product_id, $user->coins,$id);
        }
    }
}

/**
 * Inserts a line into shoporder table in database with user id given by parameter.
 *
 * @param int $user_id is the id number of the user signed in.
 * @param int $product_id is the id number of the product bought.
 */
function makeShopOrder($user_id, $product_id){
    $shoporder = R::dispense( 'shoporder' );
    $shoporder->user_id = $user_id;
    $shoporder->product_id = $product_id;
    $shoporder->amount = 1;
    R::store( $shoporder );
}


/**
 * Updates product amount in the database
 *
 * @param int $product_id is the id number of the product
 * @param int $newAmount is the amount of the product to be inserted in the database
 */
function updateProductAmount($product_id, $newAmount){
    R::exec('UPDATE product SET amount = :newAmount WHERE id = :product_id', [':newAmount' => $newAmount, ':product_id' => $product_id] );
}

/**
 * Adds a line to the user's collection table in the database.
 *
 * @param int $product_id is the id number of the product bought.
 * @param int $coins_left is the amount of coins the user has left after buying the product.
 * @param int $id is the id number of the user who has bought the product.
 */
function addToCollection($product_id, $coins, $id){
    $collection = R::load('collection',$id);
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
function addProduct($id, $name, $price, $description, $image_url, $amount){
    $data = getAdmin($id);
    if ($data['admin'] == 1){
        $product = R::dispense('product');
        $product->name = $name;
        $product->price = $price;
        $product->description = $description;
        $product->image_url = $image_url;
        $product->amount = $amount;
        R::store($product);
    }

}

/**
* Gets the product information by id
*
*@param product id
*@return array with product information
*/

function getProductById($id) {
    //return R::getAll('SELECT * FROM product INNER JOIN product_en ON product.id = product_en.id INNER JOIN product_fi ON product.id = product_fi.id  WHERE product.id = :id', [':id'=>$id]);

    $product = R::load('product', $id);
    $fin = R::load('product_fi', $id);
    $eng = R::load('product_en', $id);
    $product['name_en'] = $eng->name_en;
    $product['name_fi'] = $fin->name_fi;
    $product['description_en'] = $eng->description_en;
    $product['description_fi'] = $fin->description_fi;

  return $product;
}
