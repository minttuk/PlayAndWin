<?php
ini_set('display_errors', 1);
require 'rb.php';
R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );
//if (isset($_SESSION['id'])) {
$results=R::getAll('select * from chatroom');
$html = '';
$colorshift = true;
if (isset($_REQUEST['html'])) {
  for ($i = max(0,sizeof($results) - 30); $i < sizeof($results); $i++) {
      $html .=
          '<div class="media msg" style='.cardColor().'>'.
          '<div class="media-body">'.
          '<small class="pull-right time"><i class="fa fa-clock-o"></i>'.' '.$results[$i]['ts'].'</small>'.
          '<h4 class="media-heading">'.$results[$i]['username'].'</h4>'.
          '<p class="col-lg-10">'.$results[$i]['msg'].'</p>'.
          '</div></div>';
  }
  echo $html;
} else {
  echo json_encode($results);
}
//}
function cardColor() {
  global $colorshift;
  if ($colorshift) {
    $colorshift = !$colorshift;
    return 'background-color:#d2e2fa;';
  } else {
    $colorshift = !$colorshift;
    return 'background-color:#def7fe;';
  }
}
