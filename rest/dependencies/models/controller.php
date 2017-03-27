<?php
header("Access-Control-Allow-Origin: *");
session_start();
require 'connection.php';
require 'user.php';
require 'product.php';
require 'chat.php';
require 'highscore.php';
require 'search.php';
require 'login.php';

connect();
include 'api.php';

$resource = getResource();
$request_method = getMethod();
$parameters = getParameters();

//Methods used with REST

# Redirect to appropriate handlers.
if ($resource[0]=="playandwin") {
    // These below are left just for an example of how to handle REST calls

    /*if ($request_method=="GET" && $resource[1]=="buyProduct") {
        buyProduct($parameters);
    }
    else if ($request_method=="GET" && $resource[1]=="getDogs") {
        getDogs();
    }
    else {
        http_response_code(405); # Method not allowed
    }*/
}
else {

    //Methods without rest
    if(isset($_REQUEST["q"])) {
    $q = $_REQUEST["q"];

    if ($q == 'getHighscores') {
      if (isset($_SESSION['id']) || isset($_REQUEST['id'])) {
        if (isset($_REQUEST['id'])) $userID = getUserID($_REQUEST['id']);
        else $userID = $_SESSION['id'];
        echo getHighscores($userID);
      }
    }

    if ($q == 'searchUsers') {
      if (isset($_REQUEST['query'])) {
        echo searchUsers($_REQUEST['query']);
      }

    }

    if ($q == 'setHighscore') {
      echo setHighscore();
    }

    if ($q == 'getCoins') {
      if (isset($_SESSION['id']))
        echo getCoins($_SESSION['id']);
    }

    if ($q == 'getChat') {
      echo getChat();
    }

    if ($q == 'addChat') {
      addChat();
    }

    if ($q == "getUserInfo"){
      $id = $_REQUEST['id'];
      echo json_encode(getUserInfo($id));
    }

    if ($q == "setUserInfo"){
      $value = json_decode(file_get_contents('php://input'), true);
      echo json_encode(setUserInfo($_SESSION['id'], $value['firstname'], $value['lastname'], $value['description'], $value['location']));
    }

    if ($q == "addProduct"){
      $value = json_decode(file_get_contents('php://input'), true);
      addProduct($value['name'], $value['price'], $value['description'], $value['image_url']);
    }

    if ($q == "buyProduct"){
      if (isset($_SESSION['id'])) {
        echo buyProduct($_SESSION['id'],$_REQUEST['product']);
      } else {
        echo 'You need to sign in first!';
      }
    }

    if ($q == "getProducts"){
      echo getProducts();
    }

    if ($q == "login") {
      $username = null;
      $password = null;
      $confirmPass = null;
      $email = null;
      $firstname = null;
      $lastname = null;
      if (isset($_REQUEST['Username'])) $username = $_REQUEST['Username'];
      if (isset($_REQUEST['Password'])) $password = $_REQUEST['Password'];
      if (isset($_REQUEST['ConfirmPassword'])) $confirmPass = $_REQUEST['ConfirmPassword'];
      if (isset($_REQUEST['Email'])) $email = $_REQUEST['Email'];
      if (isset($_REQUEST['Firstname'])) $firstname = $_REQUEST['Firstname'];
      if (isset($_REQUEST['Lastname'])) $lastname = $_REQUEST['Lastname'];
      echo loginUser($username, $password, $confirmPass, $email, $firstname, $lastname);
    }

    if ($q == "logout") {
      echo logOut();
    }

    if ($q == "getMutualFriends"){
        echo json_encode(getMutualFriends($_REQUEST['id']));
    }

    if ($q == "getFriendRequests") {
      echo json_encode(getFriendRequests($_REQUEST['id']));
    }

    if ($q == "getPendingFriends"){
      echo json_encode(getPendingFriends($_REQUEST['id']));
    }

    if ($q == "addFriend"){
      echo json_encode(addFriend($_SESSION['id'], $_REQUEST['id']));
    }

    if ($q == "deleteFriend"){
      echo json_encode(deleteFriend($_SESSION['id'], $_REQUEST['id']));
    }

    if ($q == "getLastLoggedIn"){
      echo json_encode(getLastLoggedIn());
    }

    if ($q == "getFriendship"){
      echo json_encode(getFriendship($_SESSION['id'], $_REQUEST['id']));
    }

    if ($q == "getNewUsers"){
      echo json_encode(getNewUsers());
    }
    if ($q == "getAdmin"){
      echo getAdmin($_SESSION['id']);
    }

    if ($q == "deleteUser"){
      if (isset($_SESSION['id']) && isset($_REQUEST['deleteID'])){
        $id = $_SESSION['id'];
        $deleteID = $_REQUEST['deleteID'];
        echo deleteUser($_SESSION['id'],$_REQUEST['deleteID']);
      } else {
      echo 'Missing Information.';
      }
    }
  }
}

// Tästä alkaa varsinaiset metodit.

//Pilkoo URI:n listaksi, jota voidaan tarkastella.
function getResource() {
    # returns numerically indexed array of URI parts
    $resource_string = $_SERVER['REQUEST_URI'];
    if (strstr($resource_string, '?')) {
        $resource_string = substr($resource_string, 0, strpos($resource_string, '?'));
    }
    $resource = array();
    $resource = explode('/', $resource_string);
    array_shift($resource);
    return $resource;
}

//hakee parametrit
function getParameters() {
    # returns an associative array containing the parameters
    $resource = $_SERVER['REQUEST_URI'];
    $param_string = "";
    $param_array = array();
    if (strstr($resource, '?')) {
        # URI has parameters
        $param_string = substr($resource, strpos($resource, '?')+1);
        $parameters = explode('&', $param_string);
        foreach ($parameters as $single_parameter) {
            $param_name = substr($single_parameter, 0, strpos($single_parameter, '='));
            $param_value = substr($single_parameter, strpos($single_parameter, '=')+1);
            $param_array[$param_name] = $param_value;
        }
    }
    return $param_array;
}

//Hakee metodin tyypin.
function getMethod() {
    # returns a string containing the HTTP method
    $method = $_SERVER['REQUEST_METHOD'];
    return $method;
}
?>