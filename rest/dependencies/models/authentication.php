<?php

$key = "5d439612ba3cffe8c801acbbde6e4277";
function generateToken($id,$name){
  global $key;
  $token = array(
    "iss" => "http://playtalk.win",
    "iat" => time(),
    "exp" => time()+604800,
    'data' => [
      'userId'   => $id,
      'userName' => $name,
    ]
  );
  $jwt = JWT::encode($token, $key);
  $decoded = JWT::decode($jwt, $key, array('HS256'));
  $decoded_array = (array) $decoded;
  return $jwt;
}

function validateToken(){
  $jwt = $_SERVER['HTTP_ACCESS_TOKEN'];
  global $key;
  $decoded = JWT::decode($jwt, $key, array('HS256'));
  $decoded_array = (array) $decoded;
  $userData = (array) $decoded_array['data'];
  return $userData['userId'];
}
