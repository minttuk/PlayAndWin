<?php

function getChat(){
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
    return $html;
  } else {
    return json_encode($results);
  }
}

function addChat() {
  if (isset($_SESSION['id'])) {
    $user = R::load('user',$_SESSION['id']);
    $username = $user->username;
  } else {
    $username = 'guest';
  }
  if (isset($_REQUEST['message']) && $_REQUEST['message'] != '') {
    $message = R::dispense('chatroom');
    $message->username = $username;
    $message->msg = $_REQUEST['message'];
    R::store( $message );
  }
}

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
