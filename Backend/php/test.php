<?php
require 'rb.php';
R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );
$friends = R::getAll( 'SELECT * FROM friendship WHERE user1_id = 1 OR user2_id = 2 AND approved = 1');
echo json_encode($friends);
