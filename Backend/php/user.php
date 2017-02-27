<?php

function getUserInfo() {
  R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );

  $value = json_decode(file_get_contents('php://input'), true);
  $id = $value['id'];
  $user = json_encode(R::getAll( 'SELECT * FROM user WHERE id = :id', [':id' => $id]));
  //$user = json_encode(R::getAll( 'SELECT * FROM user WHERE id = 1'));
  if ($user != -1) {
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
  $user->description = $value['description'];
  $user->location = $value['location'];
  R::store( $user );
  echo $user;
}

// getFriends() gets all the friendship rows that have the userid and are approved
function getFriends() {
  R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );
  $value = json_decode(file_get_contents('php://input'), true);
  $id = $value['id'];
  $friends = json_encode(R::getAll( 'SELECT * FROM friendship WHERE user1_id = :id OR user2_id = :id AND approved = 1', [':id' => $id]));
  echo $friends;
?>
