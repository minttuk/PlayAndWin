<?php
function searchUsers($query) {
  $results = R::getAll('SELECT * FROM user WHERE username LIKE :q1 ORDER BY IF( username LIKE :q2 ,0,1)', [':q1' => '%'.$query.'%',':q2'=>$query.'%']);
  $matches = array();
  foreach ($results as $result) {
    $matches[] = array('name'=>$result['username'],'image'=>$result['profilepicture']);
  }
  return $matches;
}
