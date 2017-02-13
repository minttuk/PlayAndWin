<?php

require 'rb.php';

R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );

$user = R::dispense( 'user' );

$user->username = 'Ali';
$user->email = 'ali@ali.com';
$user->password = 'moi';

$id = R::store( $user );

$user = R::load( 'user', 1 );
echo $user;
$user = R::load( 'user' , 2);

echo $user;
