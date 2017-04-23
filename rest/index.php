<?php
require 'dependencies/require_all.php';

connect();

Flight::set('flight.log_errors', true);

// api page redirect
Flight::route('/', function(){
    include '../api/index.html';
});

Flight::route('/test', function(){
     getActiveTrades();
});

// --------------------------   PRIVATE REST API   -------------------------- //

//Referrals
Flight::route('POST /refer', function(){
    if (isToken()) echo referFriend(validateToken(),
        Flight::request()->data->email,
        Flight::request()->data->name
    );
});

//User
Flight::route('PUT /user/location/@location', function($location){
    if(isToken()) echo setUserLocation(validateToken(),$location);
});
/*Flight::route('PUT /user', function(){
    if(isToken()) {
      echo setUserInfo(
        validateToken(),
        Flight::request()->data->firstname,
        Flight::request()->data->lastname,
        Flight::request()->data->description,
        Flight::request()->data->location
      );
    }
});*/
Flight::route('PUT /user/public', function(){
    if(isToken()) {
        echo setUserPublicInfo(
            validateToken(),
            Flight::request()->data->description,
            Flight::request()->data->location
        );
    }
});
Flight::route('PUT /user/private', function(){
    if(isToken()) {
        echo setUserPrivateInfo(
            validateToken(),
            Flight::request()->data->firstname,
            Flight::request()->data->lastname,
            Flight::request()->data->age,
            Flight::request()->data->gender
        );
    }
});

Flight::route('POST /user/image', function(){
    if (isToken()) echo uploadImage(validateToken());
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

// Collection
Flight::route('POST /collection/redeem', function(){
    if (isToken() && Flight::request()->data->product != null)
        echo redeemProduct(validateToken(),Flight::request()->data->product);
});
Flight::route('/collection/@lang', function($lang){
    if (isToken()) Flight::json(getCollection(validateToken(),$lang));
});
Flight::route('/collection', function(){
    if (isToken()) Flight::json(getCollection(validateToken()));
});


// Friends
Flight::route('POST /friends', function(){
    if (isFriendParams())Flight::json(addFriend(validateToken(), Flight::request()->query->id));
});
Flight::route('DELETE /friends', function(){
    if (isFriendParams()) Flight::json(deleteFriend(validateToken(), Flight::request()->query->id));
});
Flight::route('/friends/requests/@id', function($id){
    Flight::json(getFriendRequests(validateToken()));
});
Flight::route('/friends/pending/@id', function($id){
    Flight::json(getPendingFriends(validateToken()));
});
Flight::route('GET /friends', function(){
    if (isFriendParams()) Flight::json(getFriendship(validateToken(), Flight::request()->query->id));
});

// Product
Flight::route('POST /product', function(){
    if (isToken() && getAdmin(validateToken())){
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

Flight::route('PUT /product', function(){
    if (isToken() && getAdmin(validateToken())){
        updateProduct(
            Flight::request()->data->id,
            Flight::request()->data->name,
            Flight::request()->data->price,
            Flight::request()->data->description,
            Flight::request()->data->image_url,
            Flight::request()->data->amount
        );
    }
});

Flight::route('/products', function() {
  if (isToken() && getAdmin(validateToken())) {
    Flight::json(getAllProducts());
  }
});

Flight::route('/product/@id', function($id) {
  if (isToken()) {
    Flight::json(getProductById($id));
  }
});

Flight::route('/product/buy', function(){
    if (isToken() && Flight::request()->query->product != null)
      echo buyProduct(validateToken(),Flight::request()->query->product);
});

// Translation

Flight::route('/translations/@lang', function($lang) {
  if (isToken() && getAdmin(validateToken())) {
    Flight::json(getTranslations($lang));
  }
});

Flight::route('/translation/@lang/@id', function($lang, $id) {
  if (isToken() && getAdmin(validateToken())) {
    Flight::json(getTranslation($lang, $id));
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

// Trade
Flight::route('POST /trades/new', function() {
  Flight::json(addNewTrade(
    validateToken(),
    Flight::request()->data->product,
    Flight::request()->data->price,
    Flight::request()->data->description
  ));
});

flight::route('/trades/history/@lang', function($lang) {
  Flight::json(getTradeHistory(validateToken(),$lang));
});

flight::route('/trades/history', function() {
  Flight::json(getTradeHistory(validateToken()));
});

flight::route('PUT /trades', function(){
  if(isToken()) {
    Flight::json(editTrade(
      validateToken(),
      Flight::request()->data->id,
      Flight::request()->data->price,
      Flight::request()->data->description
    ));
  }
});

flight::route('DELETE /trades', function(){
  Flight::json(deleteTrade(validateToken(), Flight::request()->query->tradeid));
});

Flight::route('/trades/buy', function(){
    if (isToken() && Flight::request()->query->trade != null) {
        echo buyTradeProduct(validateToken(),Flight::request()->query->trade);
    }
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

Flight::route('/products/@lang', function($lang){
    Flight::json(getProducts($lang));
});

Flight::route('/products/@id', function($id) {
    Flight::json(getProductById($id));
});

// Trade

flight::route('GET /trades', function() {
  Flight::json(getActiveTrades());
});

flight::route('GET /trades/@lang', function($lang) {
  Flight::json(getActiveTrades($lang));
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
