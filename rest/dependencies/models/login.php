<?php
$message = array('data'=>'');
/**
 *Registers the user or sign's one in, depending on which paramaters are set.
 *If no parameters are set then returns the $_SESSION['id'] value if set, otherwise return -1.
 *
 *@param string $username is the user's username.
 *@param string $email is the user's email address.
 *@param string $password is the user's password.
 *@param string $confirmPass the user's confirm password.
 *@param string $firstname is the user's first name.
 *@param string $lastname is the user's last name.
 *
 *@return string Message of success or errors
 */
function loginUser($uname, $password, $confirmPass, $email, $firstname, $lastname) {
  global $message;
  if ($uname)  {
    $plainPass = $password;
    $password = md5(md5($uname.$password));
  }

  if ($email) {
    if (validatePassword($plainPass, $confirmPass)) {
        $newuser = findUser($uname);
        if (!$newuser) {
          $id = regUser($uname,$email,$password,$firstname,$lastname);
          setcookie("access_token",generateToken($id,$uname), time()+60*60*24*14, '/');
          return json_encode(array('token'=>generateToken($id,$uname)));
        } else $message['data'] = 'Username taken, try again!';
    }
  } else if ($uname) {
    $player = findUser($uname);

    if($player ? ($player->password==$password) : false) {
      updateLastOnline($player->id);
      setcookie("access_token",generateToken($player->id,$uname), time()+60*60*24*14, '/');
      return json_encode(array('token'=>generateToken($player->id,$uname)));
    } else  $message['data'] = 'Nope, wrong username or password!';
  } else {
    $message = isset(getallheaders()['access_token'])||isset($_COOKIE['access_token']) ? array('id'=>validateToken(),'name'=>R::getCell('SELECT username FROM user WHERE id='.validateToken())) : -1;
  }
  return json_encode($message);
}


//---------------funktiot:

/**
 *Destroys the session, effectively logging out the user.
 *
 *@return string Message of success
 */
function logOut() {
  setcookie("access_token","", time() - 3600,"/");
  return 'You have been logged out.';
}

/**
 *Registers the user by sending a query to the database to form a row in the user table for the user.
 *Also adds user rows to all the different hs_ tables.
 *
 *@param int $username is the user's username.
 *@param string $email is the user's email address.
 *@param string $password is the user's password.
 *@param string $firstname is the user's first name.
 *@param string $lastname is the user's last name.
 */
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
    R::exec('INSERT INTO collection (id) VALUES (:id)', [':id' => $newuser]);
    return $newuser;
  }

/**
 *This method is used to update last_online in user table
 *
 */
  function updateLastOnline($id) {
    R::exec( 'update user set last_online=NOW() where id = :id', [':id' => $id]);
  }

/**
 *This method is used to get user data by id
 *
 *@param int $id is the user's id.
 *
 *@return database object
 */
  function getUser ($id) {
    $user = R::load( 'user', $id );
    return $user;
  }

/**
 *Queries the database by username and returns the user's information.
 *
 *@param string $username is the user's username.
 *
 *@return database object
 */
  function findUser($username) {
    $user = R::findOne('user',
        ' username = ? ',array($username));
    return $user;
  }

/**
 *Validates the password submitted by the user by checking that the password meets the password criteria and that the ConfirmPassword input field matches the Password field.
 *
 *@param string $password is the user's password.
 *@param string $confirmPass is the user's confirm password.
 *
 *@return boolean Password is valid of not
 */
  function validatePassword($password, $confirmPass) {
    global $message;
    $accepted = true;
    if($password != $confirmPass) {
        $message['data'] .= "Your passwords must match!</br>";
        $accepted = false;
    }
    if (strlen($password) <= 5) {
        $message['data'] .= "Your password must contain at least 6 characters!</br>";
        $accepted = false;
    }
    if(!preg_match("#[0-9]+#",$password)) {
        $message['data'] .= "Your password must contain at least 1 number!</br>";
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

  /**
   *This function is used to delete a user from the database
   *
   *@param int $id The user id of the user authorizing the delete.
   *@param int $id The user id of the user to be deleted.
   *
   *@return string Message of success or failure.
   */
  function deleteUser($id,$deleteID) {
    $gamelist = array('snake','flappy','reaction','jumper');
    $user = R::load( 'user',$id);
    if ($user->admin == 1 || $id == $deleteID) {
      foreach ($gamelist as $game) {
        R::exec('DELETE FROM hs_'.$game.' WHERE id=:id', [':id' => $deleteID]);
      }
      R::exec('DELETE FROM collection WHERE id=:id', [':id' => $deleteID]);
      R::exec('DELETE FROM user WHERE id=:id', [':id' => $deleteID]);
      if ($id == $deleteID) logout();
      return 'User '.$deleteID.' deleted.';
    }
    return 'Missing privileges.';
  }
