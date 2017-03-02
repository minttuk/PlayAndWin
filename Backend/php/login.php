<?php
require 'rb.php';

session_start();

R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );

if (isset($_POST['Username']))  {
  $uname = $_POST['Username'];
  $password = md5(md5($uname.$_POST['Password']));
}

$message;

if (isset($_POST['Email'])) {
  $newuser = findUser($uname);
  if (!$newuser) {
    regUser($uname,$_POST['Email'],$password,$_POST['Firstname'],$_POST['Lastname']);
    $newuser = findUser($uname);
    startSession($newuser->id);
    $message = 'Welcome to Play and Win, '.$uname.'!';
  } else $message = 'Username taken, try again!';

} else if (isset($_POST['Username'])) {
  $player = findUser($uname);

  if($player->password==$password) {
    $message = 'Logged in!';
    startSession($player->id);
  } else  $message = 'Nope, wrong password!';
} else {
  $message = isset($_SESSION['id']) ? $_SESSION['id'] : -1;
}
echo $message;
//---------------funktiot:
  function startSession($id) {
    $_SESSION['id'] = $id;
  }

  function regUser ($username, $email, $password, $firstname, $lastname) {
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

  function findUser($username) {
    $user = R::findOne('user',
        ' username = ? ',array($username));
    return $user;
  }
