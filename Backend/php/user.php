<?php

function getUserInfo() {
  R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );
  $id = $_REQUEST['id'];
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
    header('Content-Type: application/json');
    echo json_encode($response);
  }/*
  if ($user->id != 0) {
    echo $user;
  }*/
  else {
    http_response_code(403);
    echo json_encode(array('error'=>'No user found'));
  }
}

function setUserInfo() {
  R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );

  $value = json_decode(file_get_contents('php://input'), true);
  $id = $value['id'];
  $user = R::load( 'user', $id);
  $user->firstname = $value['firstname'];
  $user->lastname = $value['lastname'];
  $user->description = checkEmpty($value['description']);
  $user->location = checkEmpty($value['location']);
  R::store( $user );
  echo $user;
}

//TEST OK. If string is empty, it will be changed into NULL.
function checkEmpty($stringToCheck) {
  if ($stringToCheck == '') {
    return null;
  }
  else {
    return $stringToCheck;
  }
}

// getFriends() gets all the friendship rows that have the userid and are approved
function getMutualFriends() {
  R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );
  $id = $_REQUEST['id'];
  $friends = R::getAll('SELECT user2_id FROM friendship WHERE user1_id = :id AND approved = 1', [':id' => $id]);
  $response = getFriendsInfo($friends);
  echo json_encode($response);
}

function getPendingFriends() {
  R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );
  $id = $_REQUEST['id'];
  $pendingfriends = R::getAll( 'SELECT user2_id FROM friendship WHERE user1_id = :id AND approved = 0', [':id' => $id]);
  $response = getFriendsInfo($pendingfriends);
  echo json_encode($response);
}

function getFriendRequests() {
  R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );
  $id = $_REQUEST['id'];
  $friendrequests = R::getAll( 'SELECT user1_id FROM friendship WHERE user2_id = :id AND approved = 0', [':id' => $id]);
  $response = getFriendsInfo($friendrequests);
  echo json_encode($response);
}

function getFriendsInfo($friends) {
  $response = array();
  foreach ($friends as $friend) {
    if ($friend['user2_id']) {
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

function getFriendsCount($id) {
  $friends = R::getAll( 'SELECT COUNT(*) AS friendcount FROM friendship WHERE user1_id = :id AND approved = 1', [':id' => $id]);
  return $friends[0]['friendcount'];
}

//Work in progress... Not working yet
function addFriend() {
  R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );
  $value = json_decode(file_get_contents('php://input'), true);
  $friendId = $value['friendId'];
}

// returns at most 8 users that have the most recent date in last_online
function getLastLoggedIn() {
  R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );
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
  R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );
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
