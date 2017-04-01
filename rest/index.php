<?php
require 'dependencies/require_all.php';
session_start();

connect();

// api page redirect
Flight::route('/', function(){
    include '../api/index.html';
});

Flight::route('/test', function(){
    print_r(isToken());
});

// --------------------------   PRIVATE REST API   -------------------------- //

//User
Flight::route('PUT /user/location/@location', function($location){
    if(isToken()) echo setUserLocation(validateToken(),$location);
});
Flight::route('PUT /user', function(){
    if(isToken()) {
      echo setUserInfo(
        validateToken(),
        Flight::request()->data->firstname,
        Flight::request()->data->lastname,
        Flight::request()->data->description,
        Flight::request()->data->location
      );
    }
});
Flight::route('DELETE /user', function(){
    if (isToken()) echo deleteUser(validateToken(),validateToken());
});
Flight::route('DELETE /user/@id', function($id){
    if (isToken()) echo deleteUser(validateToken(),$id);
});
Flight::route('/user/admin', function(){
    if (isToken()) Flight::json(getAdmin(validateToken()));
});

// Friends
Flight::route('POST /friends', function(){
    if (isFriendParams())Flight::json(addFriend(validateToken(), Flight::request()->query->id));
});
Flight::route('DELETE /friends', function(){
    if (isFriendParams()) Flight::json(deleteFriend(validateToken(), Flight::request()->query->id));
});
Flight::route('GET /friends', function(){
    if (isFriendParams()) Flight::json(getFriendship(validateToken(), Flight::request()->query->id));
});

//Product
Flight::route('POST /product', function(){
    if (isToken()){
        addProduct(
            validateToken(),
            Flight::request()->data->name,
            Flight::request()->data->price,
            Flight::request()->data->description,
            Flight::request()->data->image_url,
            Flight::request()->data->amount
        );
    }

});
Flight::route('/product/buy', function(){
    if (isToken() && Flight::request()->query->product != null) {
      echo buyProduct(validateToken(),Flight::request()->query->product);
    }
});

// Highscore
Flight::route('POST /score', function(){
    if (isToken()) Flight::json(setHighscore(validateToken()));
});
Flight::route('/score', function(){
    if (isToken()) Flight::json(getHighscores(validateToken()));
});

// Coins
Flight::route('/coins', function(){
    if (isToken()) echo getCoins(validateToken());
});


// --------------------------------   PUBLIC REST API   -------------------------------- //

// User
Flight::route('POST /user', function(){
    echo loginUser(
      Flight::request()->data->Username,
      Flight::request()->data->Password,
      Flight::request()->data->ConfirmPassword,
      Flight::request()->data->Email,
      Flight::request()->data->Firstname,
      Flight::request()->data->Lastname
    );
});
Flight::route('/user/logout', function(){
    echo logOut();
});
Flight::route('/user/@id', function($id){
    Flight::json(getUserInfo($id));
});
Flight::route('/user', function(){
    echo loginUser(null,null,null,null,null,null);
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
    Flight::json(getProducts());
});

// Chat
Flight::route('POST /chat', function(){
    if(isToken()) echo addChat(validateToken());
    else echo addChat(null);
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
    Flight::json(searchUsers($query));
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

// Collection
Flight::route('/collection/@id', function($id){
    Flight::json(getCollection($id));
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
    if ((isset(getallheaders()['access_token']) || isset($_COOKIE['access_token'])) && Flight::request()->query->id != null) return true;
    else echo 'Incomplete request'; return false;
}

function isToken() {
    if (isset(getallheaders()['access_token'])||isset($_COOKIE['access_token'])) return true;
    else echo 'Not logged in or no access token provided.'; return false;
}
