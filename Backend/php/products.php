<?php

 R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );

 /*$user = R::dispense( 'user' );

 $user->username = 'Tuomas';
 $user->email = 'tuomas@tuomas.com';
 $user->password = 'salasana';

 R::store( $user );*/

 $products = json_encode(R::getAll( 'SELECT * FROM product' ));

echo $products;
