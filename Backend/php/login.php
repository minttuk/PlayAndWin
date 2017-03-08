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
      if($_POST["Password"] != $_POST["ConfirmPassword"]) {
        $message = "Your Passwords Must Match!";
      } elseif (strlen($_POST["Password"]) <= '8') {
          $message = "Your Password Must Contain At Least 8 Characters!";
      }
      elseif(!preg_match("#[0-9]+#",$_POST["Password"])) {
          $message = "Your Password Must Contain At Least 1 Number!";
      }
      elseif(!preg_match("#[A-Z]+#",$_POST["Password"])) {
          $message = "Your Password Must Contain At Least 1 Capital Letter!";
      }
      elseif(!preg_match("#[a-z]+#",$_POST["Password"])) {
          $message = "Your Password Must Contain At Least 1 Lowercase Letter!";
     } else {
      $newuser = findUser($uname);
      if (!$newuser) {
        regUser($uname,$_POST['Email'],$password,$_POST['Firstname'],$_POST['Lastname']);
        $newuser = findUser($uname);
        startSession($newuser->id);
        R::exec('CREATE TABLE collection_'.$newuser->id.' (id INT(6) PRIMARY KEY NOT NULL, amount INT(6), FOREIGN KEY (id) REFERENCES product(id));');
      //$message = 'Welcome to Play and Win, '.$uname.'!';
      } else $message = 'Username taken, try again!';
    }
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
