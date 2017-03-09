<?php
require 'connection.php';
session_start();

if (isset($_POST['Username']))  {
  $uname = $_POST['Username'];
  $password = md5(md5($uname.$_POST['Password']));
}

$message = 'success';

if (isset($_POST['Email'])) {
  if (validatePassword($_POST['Password'])) {
      $newuser = findUser($uname);
      if (!$newuser) {
        regUser($uname,$_POST['Email'],$password,$_POST['Firstname'],$_POST['Lastname']);
        $newuser = findUser($uname);
        startSession($newuser->id);
        R::exec('CREATE TABLE collection_'.$newuser->id.' (id INT(6) PRIMARY KEY NOT NULL, amount INT(6), FOREIGN KEY (id) REFERENCES product(id));');
        $message = 'success';
      //$message = 'Welcome to Play and Win, '.$uname.'!';
      } else $message = 'Username taken, try again!';
    }
} else if (isset($_POST['Username'])) {
  $player = findUser($uname);

  if(isset($player) ? ($player->password==$password) : false) {
    //$message = 'Logged in!';
    startSession($player->id);
    updateLastOnline();
  } else  $message = 'Nope, wrong username or password!';
} else {
  $message = isset($_SESSION['id']) ? $_SESSION['id'] : -1;
}
if(isset($_REQUEST['logout'])) {
  session_destroy();
  $message  = 'You have been logged out.';
}
echo $message;
//---------------funktiot:
  function startSession($id) {
    $_SESSION['id'] = $id;
  }

  function regUser ($username, $email, $password, $firstname, $lastname) {
    $gamelist = array('snake','flappy','reaction','jumper');
    $user = R::dispense( 'user' );
    $user->username = $username;
    $user->email = $email;
    $user->password = $password;
    $user->firstname = $firstname;
    $user->lastname = $lastname;
    $newuser = R::store( $user );
    R::exec( 'update user set reg_date=NOW() where username = :username', [':username' => $username]);
    R::exec( 'update user set last_online=NOW() where username = :username', [':username' => $username]);
    foreach ($gamelist as $game) {
      R::exec('INSERT INTO hs_'.$game.' (id,highscore) VALUES (:id,0)', [':id' => $newuser]);
    }
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

  function validatePassword($password) {
    global $message;
    $message = '';
    $accepted = true;
    if($password != $_POST["ConfirmPassword"]) {
        $message .= "Your passwords must match!</br>";
        $accepted = false;
    }
    if (strlen($password) <= '6') {
        $message .= "Your password must contain at least 6 characters!</br>";
        $accepted = false;
    }
    if(!preg_match("#[0-9]+#",$password)) {
        $message .= "Your password must contain at least 1 number!</br>";
        $accepted = false;
    }
    /*if(!preg_match("#[a-z]+#",$password)) {
        $message .= "Your password must contain at least 1 lowercase letter!</br>";
        $accepted = false;
   }
    if(!preg_match("#[A-Z]+#",$password)) {
        $message .= "Your password must contain at least 1 capital letter!</br>";
        $accepted = false;
    }*/
    return $accepted;
  }
