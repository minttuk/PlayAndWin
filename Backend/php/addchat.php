<?php
require 'connection.php';
session_start();

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
