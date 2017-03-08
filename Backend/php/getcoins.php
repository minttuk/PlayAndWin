<?php
require 'connection.php';
session_start();
if (isset($_SESSION['id'])) {
  $user = R::load( 'user', $_SESSION['id']);
  echo $user->coins;
}
