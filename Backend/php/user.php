<?php

/**
 * Returns users id, username, profile picture, firstname, lastname, description, location, registration date, last time online time and a list of friends ids
 *
 * @return json PHP array
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
 * Updates user firstname, lastname, description and location
 *
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
 * @param String $stringToCheck
 *
 * @return String or null
 */

function checkEmpty($stringToCheck) {
  $stringToCheck = str_replace(' ', '', $stringToCheck);
  if ($stringToCheck == '') {
    return null;
  }
  else {
    return $stringToCheck;
  }
}

/**
 * Gets the friends of a user by the user id. Passes friends ids to function getFriendsInfo
 *
 * @return json formatted string
 */

function getMutualFriends() {
  $id = $_REQUEST['id'];
  $friends = R::getAll('SELECT user2_id FROM friendship WHERE user1_id = :id AND approved = 1', [':id' => $id]);
  $response = getFriendsInfo($friends);
  echo json_encode($response);
}

/**
 * Gets the peding friends of a user by the user id. Passes peding friends ids to function getFriendsInfo
 *
 * @return json formatted string
 */

function getPendingFriends() {
  $id = $_REQUEST['id'];
  $pendingfriends = R::getAll( 'SELECT user2_id FROM friendship WHERE user1_id = :id AND approved = 0', [':id' => $id]);
  $response = getFriendsInfo($pendingfriends);
  echo json_encode($response);
}

/**
 * Gets the peding friends of a user by the user id. Passes peding friends ids to function getFriendsInfo
 *
 * @return json formatted string
 */

function getFriendRequests() {
  $id = $_REQUEST['id'];
  $friendrequests = R::getAll( 'SELECT user1_id FROM friendship WHERE user2_id = :id AND approved = 0', [':id' => $id]);
  $response = getFriendsInfo($friendrequests);
  echo json_encode($response);
}

// retrieves the id, username and profilepicture of friends (mutual, pending and requests)
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

// counts how many friends a user has
function getFriendsCount($id) {
  $friends = R::getAll('SELECT COUNT(*) AS friendcount FROM friendship WHERE user1_id = :id AND approved = 1', [':id' => $id]);
  return $friends[0]['friendcount'];
}

// sends a friend request to a user or makes the friendship mutual if both have added/ accepted each other
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

// deletes friendship or requests
function deleteFriend($myId, $friendId) {
  R::exec('DELETE FROM friendship WHERE (user1_id = :sessionid AND user2_id = :friendid) OR (user2_id = :sessionid AND user1_id = :friendid)', [':friendid' => $friendId, ':sessionid' => $myId]);
  $response = array('message' => 'Friend deleted succesfully!');
  return $response;
}

//retrieves the friendship between session id and profiles user id. if returns 2 rows, its a mutual friendship, if returns only one row its a request
function getFriendship($myId, $friendId) {
  $result = R::getAll('SELECT * FROM friendship WHERE (user1_id = :sessionid AND user2_id = :friendid) OR (user2_id = :sessionid AND user1_id = :friendid)', [':friendid' => $friendId, ':sessionid' => $myId]);
  return $result;
}

// returns at most 8 users that have the most recent date in last_online
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
  header('Content-Type: application/json');
  echo json_encode($response);
}

// returns at most 8 users that have the most recent date in reg_date
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
  header('Content-Type: application/json');
  echo json_encode($response);
}

?>
