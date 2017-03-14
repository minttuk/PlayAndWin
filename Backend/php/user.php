<?php

/**
 * Returns users id, username, profile picture, firstname, lastname, description, location, registration date, last time online time and a list of friends ids
 *
 * @param $id is the user id whose information is retrieved
 *
 * @return PHP array
 */

function getUserInfo($id) {
  $user = R::load('user', $id);
  if ($user->id != 0) {
    $friends = getFriendsCount($id);
    $response = array(
      'id' => $user->id,
      'username' => $user->username,
      'profilepicture' => $user->profilepicture,
      'firstname' => $user->firstname,
      'lastname' => $user->lastname,
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
 * Updates user firstname, lastname, description and location. Returns updated user
 *
 * @param $id is the user id that will be updated. $firstname, $lastname, $description and $location are the values to update the user table with
 *
 * @return PHP array
 */

function setUserInfo($id, $firstname, $lastname, $description, $location) {
  $user = R::load( 'user', $id);
  $user->firstname = $firstname;
  $user->lastname = $lastname;
  $user->description = checkEmpty($description);
  $user->location = checkEmpty($location);
  R::store( $user );
  return $user;
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
 * Gets the friends of a user by the user id. Returns a PHP array that contains the friends information
 *
 * @param $id is the users id whose friends are being retrieved
 *
 * @return PHP array
 */

function getMutualFriends($id) {
  $friends = R::getAll('SELECT user2_id FROM friendship WHERE user1_id = :id AND approved = 1', [':id' => $id]);
  $response = getFriendsInfo($friends);
  return $response;
}

/**
 * Gets the peding friends of a user by the user id. Returns a PHP array that contains the pending friends information
 *
 * @param $id is the users id whose peding friend requests are being retrieved
 *
 * @return PHP array
 */

function getPendingFriends($id) {
  $pendingfriends = R::getAll( 'SELECT user2_id FROM friendship WHERE user1_id = :id AND approved = 0', [':id' => $id]);
  $response = getFriendsInfo($pendingfriends);
  return $response;
}

/**
 * Gets the peding friends of a user by the user id. Returns a PHP array that contains the friend requests information
 *
 * @param $id is the users id whose friend requests are being retrieved
 *
 * @return PHP array
 */

function getFriendRequests($id) {
  $friendrequests = R::getAll( 'SELECT user1_id FROM friendship WHERE user2_id = :id AND approved = 0', [':id' => $id]);
  $response = getFriendsInfo($friendrequests);
  return $response;
}

/**
 * Returns the id, username and profilepicture of some an array of users
 *
 * @param $friends is an array of users
 *
 * @return PHP array
 */

function getFriendsInfo($friends) {
  $response = array();
  foreach ($friends as $friend) {
    if (array_key_exists('user2_id',$friend)) {
      $userid = $friend['user2_id'];
    }
    else {
      $userid = $friend['user1_id'];
    }
    $friendsinfo = R::getAll('SELECT id, username, profilepicture FROM user WHERE id = :id', [':id' => $userid]);
    $response[] = array(
      'id' => $friendsinfo[0]['id'],
      'username' => $friendsinfo[0]['username'],
      'profilepicture' => $friendsinfo[0]['profilepicture'],
    );
  }
  return $response;
}

/**
 * Returns the number of mutual friend rows
 *
 * @param $id is the users id whose friend cout is being retrieved
 *
 * @return PHP array
 */

function getFriendsCount($id) {
  $friends = R::getAll('SELECT COUNT(*) AS friendcount FROM friendship WHERE user1_id = :id AND approved = 1', [':id' => $id]);
  return $friends[0]['friendcount'];
}

/**
 * Adds a friend request or approves a friendship. If no previous rows exist for the users passed as parameters, a new row is added. If a request exists already from the other user its updated as approved and another row is added with ids other way
 *
 * @param $myId is the session user id and $friendId is the friend id
 *
 * @return PHP array
 */

function addFriend($myId, $friendId) {
  $approved = 0;
  $mutualAdd =  R::getAll('SELECT * FROM friendship WHERE user1_id = :friendid AND user2_id = :sessionid', [':friendid' => $friendId, ':sessionid' => $myId]);
  if ($mutualAdd != null) {
    $approved = 1;
    R::exec('UPDATE friendship SET approved = :approved WHERE user1_id = :friendid AND user2_id = :sessionid', [':sessionid' => $myId, ':friendid' => $friendId, ':approved' => $approved]);
  }
  R::exec('INSERT INTO friendship (user1_id, user2_id, approved) VALUES (:sessionid, :friendid, :approved)', [':sessionid' => $myId, ':friendid' => $friendId, ':approved' => $approved]);
  $response = array('message' => 'Friend added succesfully!');
  return $response;
}

/**
 * Deletes all friendship rows with the two parameter ids
 *
 * @param $myId is the session user id and $friendId is the friends id
 *
 * @return PHP array
 */

function deleteFriend($myId, $friendId) {
  R::exec('DELETE FROM friendship WHERE (user1_id = :sessionid AND user2_id = :friendid) OR (user2_id = :sessionid AND user1_id = :friendid)', [':friendid' => $friendId, ':sessionid' => $myId]);
  $response = array('message' => 'Friend deleted succesfully!');
  return $response;
}

/**
 * Returns the friendship of the session user and another user. Two rows of result means mutual friendship. 1 row means either user has sent a friend request. 0 rows means no friend requests sent.
 *
 * @return PHP array
 */

function getFriendship($myId, $friendId) {
  $result = R::getAll('SELECT * FROM friendship WHERE (user1_id = :sessionid AND user2_id = :friendid) OR (user2_id = :sessionid AND user1_id = :friendid)', [':friendid' => $friendId, ':sessionid' => $myId]);
  return $result;
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

?>
