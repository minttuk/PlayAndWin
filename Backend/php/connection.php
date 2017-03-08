<?php
require 'rb.php';

$database = 'playandwin';
$username = 'root';
$password = '';

R::setup( 'mysql:host=localhost;dbname='.$database, $username, $password );
?>
