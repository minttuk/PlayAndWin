<?php
require '../../rb.php';
R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );
//if (isset($_SESSION['id'])) {
$results=R::getAll('select * from chatroom');
echo json_encode($results);
//}
