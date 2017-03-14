<?php
require 'rb.php';

$database = 'playandwin';
$username = 'root';
$password = '';

$errorMsg = null;

R::setup( 'mysql:host=localhost;dbname='.$database, $username, $password );

$isConnected = R::testConnection();
if (!$isConnected) {
  R::setup( 'mysql:host=10.114.32.140;dbname='.$database, 'jenkins', 'jenkins' );
}



/*
try {
  R::setup( 'mysql:host=localhost;dbname='.$database, $username, $password );
} catch (SQLException $e) {
  try {
    R::setup( 'mysql:host=10.114.32.140;dbname='.$database, 'jenkins', 'jenkins' );
  } catch (SQLException $e1) {
        e1.printStackTrace();
    }
  }*/
?>
