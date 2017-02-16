<?php

require 'rb.php';

 R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );

$user = R::dispense( 'user' );

$user->username = 'Tuomas';
$user->email = 'tuomas@tuomas.com';
$user->password = 'salasana';

R::store( $user );

$user = R::load( 'user', 1 );

echo $user;
