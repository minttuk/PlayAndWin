<?php

/**
 * Returns users id, username, profile picture, firstname, lastname, age, gender, description, location, registration date, last time online time and a list of friends ids
 *
 * @param $id is the user id whose information is retrieved
 *
 * @return PHP array
 */

function getUserInfo($id) {
  $user = R::load('user',getUserID($id));
  if ($user->id != 0) {
    $friends = getFriendsCount($user->id);
    $response = array(
      'id' => $user->id,
      'username' => $user->username,
      'profilepicture' => $user->profilepicture,
      'firstname' => $user->firstname,
      'lastname' => $user->lastname,
        'age' => $user->age,
        'gender' => $user->gender,
      'description' => $user->description,
      'location' => $user->location,
      'reg_date' => $user->reg_date,
      'last_online' => $user->last_online,
      'friends' => $friends,
    );
  }
  if ($user->id != 0) {
    return $response;

  }
  else {
    //http_response_code(403);
    return array('error'=>'No user found');
  }
}

/**
 * Updates user's public information: description and location. Returns updated user
 *
 * @param $id is the user id that will be updated. $description and $location are the values to update the user table with
 *
 * @return PHP array
 */

function setUserPublicInfo($id, $description, $location) {
  $user = R::load( 'user', $id);
  $user->description = checkEmpty($description);
  $user->location = checkEmpty($location);
  R::store( $user );
}

/**
 * Updates user's private information: firstname, lastname and gender to the database.
 *
 * @param $id is the id number of the user
 * @param $firstname
 * @param $lastname
 * @param $gender
 * @return \RedBeanPHP\OODBBean
 */
function setUserPrivateInfo($id, $firstname, $lastname, $gender) {
    $user = R::load( 'user', $id);
    $user->firstname = $firstname;
    $user->lastname = $lastname;
    $user->gender = checkEmpty($gender);
    R::store( $user );
}

/**
 * Changes the password of a user.
 *
 * @param $id
 * @param $newpassword
 * @param $confirmpassword
 * @return string is the message informing user if password could not be changed
 */
function changePassword($id, $newpassword, $confirmpassword){
    global $message;
    $user = R::load( 'user', $id);
    if (validatePassword($newpassword, $confirmpassword)){
        $password = md5(md5($user->username.$newpassword));
        $user->password = $password;
        R::store($user);
    }
    return json_encode($message);
}

/**
 * Updates user's location.
 *
 * @param $id is the user id that will be updated. $firstname, $lastname, $description and $location are the values to update the user table with
 * @param $location is the location which will be stored in the database
 *
 * @return string location
 */

function setUserLocation($id,$location){
  $user = R::load('user', $id);
  $user->location = $location;
  R::store($user);
  return $location;
}

/**
 * Converts empty strings into null
 *
 * @param String $stringToCheck, string that will be converted into null if it contains only whitespace or no characters
 *
 * @return String or null
 */

function checkEmpty($stringToCheck) {
  //$stringToCheck = str_replace(' ', '', $stringToCheck);
  $stringToCheck = trim($stringToCheck);
  if ($stringToCheck == '') {
    return null;
  }
  else {
    return $stringToCheck;
  }
}

/**
 * Gets user id by username
 *
 * @param $id is the username
 *
 * @return int
 */

function getUserID($id) {
  $user = R::findOne( 'user', ' username = ? ', [$id]);
  return $user->id;
}

/**
 * Gets username by id
 *
 * @param $id is user id
 *
 * @return string
 */

function getUserName($id) {
  $user = R::findOne( 'user', ' id = ? ', [$id]);
  return $user->username;
}

/**
 * Gets the most resent logged in useres by last login time, returns max 8 users
 *
 * @return PHP array
 */

function getLastLoggedIn() {
  $users = R::findAll('user', 'ORDER BY last_online DESC LIMIT 8');
  $response = array();
  foreach ($users as $id => $user) {
    $response[] = array(
      'id' => $user->id,
      'username' => $user->username,
      'profilepicture' => $user->profilepicture,
    );
  }
  return $response;
}

/**
 * Gets the most resent new users by registration time, returns max 8 users
 *
 * @return PHP array
 */

 function getNewUsers() {
  $users = R::findAll('user', 'ORDER BY reg_date DESC LIMIT 8');
  $response = array();
  foreach ($users as $id => $user) {
    $response[] = array(
      'id' => $user->id,
      'username' => $user->username,
      'profilepicture' => $user->profilepicture,
    );
  }
  return $response;
}

/**
 * Checks the admin status of the user signed in.
 *
 * @param int $id is the id number of the user
 * @return Array with the value of the admin cell from the user table
 */
function getAdmin($id){
    if ($id != -1){
        $user = R::load('user', $id);
        $admin = $user->admin;
    }
    else{
        $admin = null;
    }
    return array('admin'=>$admin);
}

/**
 * Checks the admin status of the user signed in. Returns a boolean value of the admin status.
 *
 * @param int $id is the id number of the user
 */
function isAdmin($id){
    return R::getCell('select admin from user where id= :id',[':id'=>$id]) === '1';
}

/**
 * Gets the amount of coins associated with a given user ID from the database.
 *
 * @param int $id is the ID number of the user.
 * @return int Number of coins
 */
function getCoins($id) {
    $user = R::load( 'user', $id);
    return $user->coins;
}

/**
 * Returns the bought items of a user with product name, amount, picture and price
 *
 * @param int $id is the ID number of the user.
 * @param String $lang is the language being used
 * @return List of products
 */
function getCollection($id,$lang=null) {
  $products = collection($id);
  //$response = array();
  if (empty($products)) return;
  foreach ($products as $id => $amount) {
    if ($amount > 0) {
        //$response = R::getAll('SELECT * FROM product INNER JOIN product_en ON product.id = product_en.id INNER JOIN product_fi ON product.id = product_fi.id  WHERE product.id = :id', [':id'=>$id]);
        //tästä palautuu väärä amount arvo!!!!
        $response[] = array(
        'id' => getProductAttribute($id,'id'),
        'name' => getProductAttribute($id,'name',$lang),
        'description' => getProductAttribute($id,'description',$lang),
        'amount' => $amount,
        'picture' => getProductAttribute($id,'image_url'),
        'price' => getProductAttribute($id,'price')
       );
    }
  }
  return $response;
}

/**
 * Returns the bought items of a user (product ids and amounts)
 *
 * @param int $id is the ID number of the user.
 * @return List of products
 */
function collection($id) {
  return json_decode(R::getCell('SELECT products FROM collection WHERE id = :id',[':id' => $id]),true);
}
/**
 * Returns a users specified cell value from user table
 * @param int $id is the ID number of the user.
 * @param String $attribute is the cell name
 * @return Value of cell
 */
function getUserAttribute($id,$attribute) {
  return R::getCell('SELECT '.$attribute.' FROM user WHERE id = :id',[':id' => $id]);
}
/**
 * Function returns array of all users showing the id, username,
 * email, coins, firstname, lastname, reg_date last_online, banned of all users.
 *
 * @return Array with RedBean objects of the users
 */
function getUsers(){
  return R::getAll( 'SELECT id, username,
  email, coins, firstname, lastname, reg_date last_online, banned FROM user' );
}
/**
 * Function toggles wether the user is banned or not by setting the "banned" value in the user table.
 *
 * @param int $id is the ID number of the user.
 * @return banned int value from user table
 */
function banUser($id){
  $user = R::load('user',$id);
  $user->banned == 0 ? $user->banned = 1 : $user->banned = 0;
  R::store($user);
  return $user->banned;
}
/**
 * Checks if the user has been banned.
 *
 * @param int $id is the ID number of the user.
 * @return boolean
 */
function isBanned($id){
  if (R::getCell('select banned from user where id= :id',[':id'=>$id]) > 0) {
    logout();
    return false;
  }
    return true;
}

?>
