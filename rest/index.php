<?php
require 'flight/Flight.php';
require '../Backend/php/connection.php';
require '../Backend/php/user.php';
require '../Backend/php/product.php';
require '../Backend/php/chat.php';
require '../Backend/php/highscore.php';
require '../Backend/php/search.php';
require '../Backend/php/login.php';
session_start();

connect();

// api page redirect
Flight::route('/', function(){
    include '../api/index.html';
});

// ----------------------------   SESSION "REST" API   ---------------------------- //

//User
Flight::route('PUT /user', function(){
    if(isSession()) {
      echo setUserInfo(
        $_SESSION['id'],
        Flight::request()->data->firstname,
        Flight::request()->data->lastname,
        Flight::request()->data->description,
        Flight::request()->data->location
      );
    }
});
Flight::route('DELETE /user', function(){
    if (isSession()) echo deleteUser($_SESSION['id'],$_SESSION['id']);
});
Flight::route('DELETE /user/@id', function($id){
    if (isSession()) echo deleteUser($_SESSION['id'],$id);
});
Flight::route('/user/admin', function(){
    if (isset($_SESSION['id'])) echo getAdmin($_SESSION['id']);
});

// Friends
Flight::route('POST /friends', function(){
    if (isFriendParams())Flight::json(addFriend($_SESSION['id'], Flight::request()->query->id));
});
Flight::route('DELETE /friends', function(){
    if (isFriendParams()) Flight::json(deleteFriend($_SESSION['id'], Flight::request()->query->id));
});
Flight::route('GET /friends', function(){
    if (isFriendParams()) Flight::json(getFriendship($_SESSION['id'], Flight::request()->query->id));
});

//Product
Flight::route('POST /product', function(){
  addProduct(
    Flight::request()->data->name,
    Flight::request()->data->price,
    Flight::request()->data->description,
    Flight::request()->data->image_url
  );
});
Flight::route('/product/buy', function(){
    buyProduct();
});

// Highscore
Flight::route('PUT /score', function(){
    echo setHighscore();
});
Flight::route('/score', function(){
    if (isSession()) echo getHighscores($_SESSION['id']);
});

// Coins
Flight::route('/coins', function(){
    if (isSession()) echo getCoins($_SESSION['id']);
});


// --------------------------------   RESTful API   -------------------------------- //

// User
Flight::route('POST /user', function(){
    echo loginUser(
      Flight::request()->query->Username,
      Flight::request()->query->Password,
      Flight::request()->query->ConfirmPassword,
      Flight::request()->query->Email,
      Flight::request()->query->Firstname,
      Flight::request()->query->Lastname
    );
});
Flight::route('/user/@id', function($id){
    Flight::json(getUserInfo($id));
});
Flight::route('/user/logout', function($id){
    echo logOut();
});

// Users
Flight::route('/users/new', function(){
    Flight::json(getNewUsers());
});
Flight::route('/users/last', function(){
    Flight::json(getLastLoggedIn());
});

//Products
Flight::route('/products', function(){
    echo getProducts();
});

// Chat
Flight::route('PUT /chat', function(){
    echo addChat();
});
Flight::route('/chat', function(){
    echo getChat();
});

// Highscore
Flight::route('/score/@id', function($id){
    echo getHighscores(getUserID($id));
});

// Search
Flight::route('/search/@query', function($query){
    echo searchUsers($query);
});

// Friends
Flight::route('/friends/@id', function($id){
    Flight::json(getMutualFriends($id));
});
Flight::route('/friends/requests/@id', function($id){
    Flight::json(getFriendRequests($id));
});
Flight::route('/friends/pending/@id', function($id){
    Flight::json(getPendingFriends($id));
});

// ---------------------------------   END of API  --------------------------------- //

// 404 Error Redirect
Flight::map('notFound', function(){
    // Display custom 404 page
    include '../notfound/index.html';
});

Flight::start();

// Helper functions
function isFriendParams() {
    if (isset($_SESSION['id']) && Flight::request()->query->id != null) return true;
    else echo 'Incomplete request'; return false;
}

function isSession() {
    if (isset($_SESSION['id'])) return true;
    else echo 'No user is signed in.'; return false;
}
