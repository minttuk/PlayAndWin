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
  $id = $_REQUEST['id'];
  //R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );
  //$value = json_decode(file_get_contents('php://input'), true);
  //$id = $value['id'];
  //$id = '1';
  $friends = R::getAll( 'SELECT user1_id, user2_id FROM friendship WHERE user1_id = :id OR user2_id = :id AND approved = 1', [':id' => $id]);
  echo json_encode($friends);
}

function getFriendsCount($id) {
  $friends = R::getAll( 'SELECT COUNT(*) AS friendcount FROM friendship WHERE user1_id = :id OR user2_id = :id AND approved = 1', [':id' => $id]);
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
