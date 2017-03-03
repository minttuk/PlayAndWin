<?php

function getUserInfo() {
  R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );
  $value = json_decode(file_get_contents('php://input'), true);
  $id = $value['id'];
  $user = R::load('user', $id);
  if ($user->id != 0) {
    echo $user;
  }
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

//make a test of this
function checkEmpty($stringToCheck) {
  if ($stringToCheck == '') {
    return null;
  }
  else {
    return $stringToCheck;
  }
}

// getFriends() gets all the friendship rows that have the userid and are approved
function getFriends() {
  R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );
  $value = json_decode(file_get_contents('php://input'), true);
  $id = $value['id'];
  $friends = json_encode(R::getAll( 'SELECT * FROM friendship WHERE user1_id = :id OR user2_id = :id AND approved = 1', [':id' => $id]));
  echo $friends;
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
