<?php
function searchUsers($query) {
  $results = R::getAll('SELECT * FROM user WHERE username LIKE :q1 ORDER BY IF( username LIKE :q2 ,0,1)', [':q1' => '%'.$query.'%',':q2'=>$query.'%']);
  $matches = array();
  foreach ($results as $result) {
    $matches[] = array('name'=>$result['username'],'image'=>$result['profilepicture']);
  }
  return $matches;
}

function searchCollection($query) {
  $results = R::getAll('SELECT * FROM collection WHERE id = 3');
  //$results_array = json_decode($results);
  $matches = array();
  /*foreach ($results as $result) {
    $product_info = R::getAll('SELECT * FROM product WHERE id = :product_id', [':product_id' => $results['product_id']])
    $matches[] = array('name'=>$product_info['name'],'picture'=>$product_info['image_url']);
  }*/
  return $results;
}
