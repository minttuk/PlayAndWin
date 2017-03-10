<?php
header("Access-Control-Allow-Origin: *");
session_start();
include 'user.php';
include 'addProduct.php';
include 'buyProduct.php';
require 'connection.php';


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

    $q = $_REQUEST["q"];

    if ($q == "getUserInfo"){
      $id = $_REQUEST['id'];
      echo json_encode(getUserInfo($id));
    }

    if ($q == "setUserInfo"){
      $value = json_decode(file_get_contents('php://input'), true);
      setUserInfo($value);
    }

    if ($q == "addProduct"){
        addProduct();
    }
    if ($q == "buyProduct"){
        buyProduct();
    }

    if ($q == "getMutualFriends"){
        getMutualFriends();
    }

    if ($q == "getFriendRequests") {
        getFriendRequests();
    }

    if ($q == "getPendingFriends"){
        getPendingFriends();
    }

    if ($q == "addFriend"){
      $myId = $_SESSION['id'];
      $friendId = $_REQUEST['id'];
      echo addFriend($myId, $friendId);
    }

    if ($q == "deleteFriend"){
      $myId = $_SESSION['id'];
      $friendId = $_REQUEST['id'];
      echo deleteFriend($myId, $friendId);
    }

    if ($q == "getLastLoggedIn"){
        getLastLoggedIn();
    }

    if ($q == "getFriendship"){
        getFriendship();
    }

    if ($q == "getNewUsers"){
      getNewUsers();
    }
    if ($q == "getAdmin"){
      getAdmin();
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