<?php
require 'rb.php';

$database = 'playandwin';
$username = 'root';
$password = '';

R::setup( 'mysql:host=localhost;dbname='.$database, $username, $password );

// Establish database for Jenkins
if (!R::testConnection()) {
  R::addDatabase('jenkinsDB','mysql:host=10.114.32.140;dbname='.$database, 'jenkins', 'jenkins' );
  R::selectDatabase('jenkinsDB');
}

?>
