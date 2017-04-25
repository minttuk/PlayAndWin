<?php

function getProducts($lang = null){
    if ($lang && array_search('product_'.$lang,R::inspect())!='') {
        $arr1 = R::getAll('SELECT * FROM product JOIN product_'.$lang.' ON product.id = product_'.$lang.'.id WHERE amount > 0');
        $arr2 = R::getAll('SELECT * FROM product WHERE  product.id NOT IN (SELECT product_'.$lang.'.id FROM product_'.$lang.') AND amount > 0');
        return array_merge($arr1,$arr2);
    }
  return R::getAll( 'SELECT * FROM product WHERE amount > 0');
}

/**
 * Selects all the products in the database for admins
 *
 * @return array of products
 */

function getAllProducts() {
  return R::getAll('SELECT * FROM product');
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
            return addToCollection($product_id, $id);
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
function addToCollection($product_id, $id){
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
    return 'You have bought this product!';
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

function updateProduct($id, $name, $price, $description, $image_url, $amount) {
  $product = R::load('product', $id);
  $product->name = $name;
  $product->price = $price;
  $product->description = $description;
  $product->image_url = $image_url;
  $product->amount = $amount;
  R::store($product);
}

/**
* Gets the product information by id
*
*@param product id
*@return array with product information
*/

function getProductById($id, $lang=null) {
    //return R::getAll('SELECT * FROM product INNER JOIN product_en ON product.id = product_en.id INNER JOIN product_fi ON product.id = product_fi.id  WHERE product.id = :id', [':id'=>$id]);
    $product = R::load('product', $id);
    if ($lang && array_search('product_'.$lang,R::inspect())!='') {
        $trans = R::load('product_'.$lang, $id);
        if ($trans!=''){
            $product['name'] = $trans->name;
            $product['description'] = $trans->description;
        }
    }

    //$fin = R::load('product_fi', $id);
    //$eng = R::load('product_en', $id);
    //$product['name_en'] = $eng->name_en;
    //$product['name_fi'] = $fin->name_fi;
    //$product['description_en'] = $eng->description_en;
    //$product['description_fi'] = $fin->description_fi;

  return $product;
}

function getProductAttribute($id,$attribute,$lang=null) {
  if ($lang && array_search('product_'.$lang,R::inspect())!='' && ($attribute == 'name' || $attribute == 'description')) {
    $attr = R::getCell('SELECT '.$attribute.' FROM product_'.$lang.' WHERE id = '.$id);
  }
  if (isset($attr) && $attr)  return $attr;
  return R::getCell('SELECT '.$attribute.' FROM product WHERE id = :id',[':id' => $id]);
}

function redeemProduct($id,$product) {
    $collection = R::load('collection',$id);
    $arr = json_decode($collection->products,true);
    $arr[$product]--;
    $amount = $arr[$product];
    if ($amount < 1) unset($arr[$product]);
    $collection->products = json_encode($arr);
    R::store($collection);
    sendEmail(getUserAttribute($id,'email'),getUserAttribute($id,'username'),'redeem', getProductAttribute($product,'name'));
    return $amount;
}

function getTranslations($lang) {
  $products = getAllProducts();
  $response = array();
  foreach ($products as $id => $product) {
    $trans = getProductTranslationByLanguage($lang, $product[id]);
    $response[] = array(
      'id' => $product[id],
      'name' => $product[name],
      'description' => $product[description],
      'trans_name' => $trans[name],
      'trans_description' => $trans[description]
    );
  }
  return $response;
}

function getTranslation($lang, $id) {
  $product = getProductById($id);
  $trans = getProductTranslationByLanguage($lang, $id);
  $response = array(
    'id' => $product[id],
    'name' => $product[name],
    'description' => $product[description],
    'trans_name' => $trans[name],
    'trans_description' => $trans[description]
  );
  return $response;
}

function updateTranslation($id, $lang, $name, $description) {
  if ($lang && array_search('product_' . $lang,R::inspect())!='') {
    $row  = R::findOne( 'product_' . $lang, ' id = ? ', [ $id ] );
    if ($row || $row != null) {
      $translation = R::load('product_' . $lang, $id);
      $translation->name = $name;
      $translation->description = $description;
      R::store($translation);
      return array('message'=>'Translation saved.');
    }
    else {
      return createNewTranslation($id, $lang, $name, $description);
    }
  }
  else {
    return array('message'=>'Could not save translation.');
  }
}

function createNewTranslation($id, $lang, $name, $description) {
  R::exec('INSERT INTO product_'.$lang.' VALUES (:id, :name, :description)', [':id' => $id, ':name' => $name, ':description' => $description]);
  return array('message'=>'Translation saved.');
}

function getProductTranslationByLanguage($lang, $id) {
  if ($lang && array_search('product_'.$lang,R::inspect())!='') {
    return R::load('product_' . $lang . '', $id);
  }
  return null;
}
