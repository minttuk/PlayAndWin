<?php
require '/Users/sainipatala/Documents/PHP/playandwin/rb.php';
//require 'C:/Users/minttu/PhpstormProjects/PlayAndWin/rb.php';
R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );

class user {

//This method is used when a user registers
  function setUser ($username, $email, $password, $firstname, $lastname) {
    $user = R::dispense( 'user' );
    $user->username = $username;
    $user->email = $email;
    $user->password = $password;
    $user->firstname = $firstname;
    $user->lastname = $lastname;
    $newuser = R::store( $user );
  }

//This method is used to update an excisting user. So far only description will be updated, but other values will be updated later too
  function updateUser ($id, $description) {
    $user = getUser($id);
    $user->description = $description;
    R::store($user);
  }

//This method is used to get user data by id
  function getUser ($id) {
    $user = R::load( 'user', $id );
    return $user;
  }
}
?>
