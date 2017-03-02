<?php
require 'rb.php';

session_start();

R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );

if (isset($_POST['Username']))  {
  $uname = $_POST['Username'];
  $password = md5(md5($uname.$_POST['Password']));
}

$message = 'success';

if (isset($_POST['Email'])) {
  $newuser = findUser($uname);
  if (!$newuser) {
    regUser($uname,$_POST['Email'],$password,$_POST['Firstname'],$_POST['Lastname']);
    $newuser = findUser($uname);
    startSession($newuser->id);
    R::exec('CREATE TABLE collection_'.$newuser->id.' (product_id INT(6) PRIMARY KEY NOT NULL, amount INT(6) NOT NULL);');
    //$message = 'Welcome to Play and Win, '.$uname.'!';
  } else $message = 'Username taken, try again!';

} else if (isset($_POST['Username'])) {
  $player = findUser($uname);

  if(isset($player) ? ($player->password==$password) : false) {
    //$message = 'Logged in!';
    startSession($player->id);
    updateLastOnline();
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
    R::exec( 'update user set reg_date=NOW() where username = :username', [':username' => $username]);
    R::exec( 'update user set last_online=NOW() where username = :username', [':username' => $username]);
  }

//This method is used to update last_online in user table
  function updateLastOnline() {
    R::exec( 'update user set last_online=NOW() where id = :id', [':id' => $_SESSION['id']]);
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
