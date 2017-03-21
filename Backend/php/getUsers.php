<?php
require 'connection.php';
connect();
$results = R::getAll('SELECT * FROM user');
$matches = array();
foreach ($results as $result) {
  $matches[] = array('name'=>$result['username'],'image'=>$result['profilepicture']);
}
