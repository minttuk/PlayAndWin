<?php
function searchUsers($query) {
  $results = R::getAll('SELECT * FROM user WHERE username LIKE :q', [':q' => '%'.$query.'%']);
  $matches = array();
  foreach ($results as $result) {
    $matches[] = array('name'=>$result['username'],'image'=>$result['profilepicture']);
  }
  return json_encode($matches);
}
