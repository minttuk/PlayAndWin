<?php

$key = "5d439612ba3cffe8c801acbbde6e4277";
function generateToken($id,$name){
  global $key;
  $token = array(
    "iss" => "http://playtalk.win",
    "iat" => time(),
    "exp" => time()+60*60*24*14,
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
  if (isset($_COOKIE['access_token'])) $jwt = $_COOKIE['access_token'];
  else if (isset(getallheaders()['access_token'])) $jwt = getallheaders()['access_token'];
  global $key;
  try {
    $decoded = JWT::decode($jwt, $key, array('HS256'));
  }
  catch (ExpiredException $e) {
    echo "Access token expired! Please login for a new token.";
    if (isset($_COOKIE['access_token'])) setcookie("access_token","", time() - 3600,"/");
    die();
  }
  $decoded_array = (array) $decoded;
  $userData = (array) $decoded_array['data'];
  return $userData['userId'];
}
