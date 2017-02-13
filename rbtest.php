<?php

require 'rb.php';

 R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', 'moi' );

 $user = R::dispense( 'user' );

 $user->username = 'Ali';
 $user->email = 'ali@ali.com';
 $user->password = 'moi';

 $id = R::store( $user );

 $user = R::load( 'username', $id );

echo $user;
