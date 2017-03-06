<?php
ini_set('display_errors', 1);
require 'rb.php';
session_start();

R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );

if (isset($_SESSION['id'])) {
  $user = R::load('user',$_SESSION['id']);
  $username = $user->username;
} else {
  $username = 'guest';
}
if (isset($_REQUEST['message']) && $_REQUEST['message'] != '') {
  $message = R::dispense('chatroom');
  $message->username = $username;
  $message->msg = $_REQUEST['message'];
  R::store( $message );
}
