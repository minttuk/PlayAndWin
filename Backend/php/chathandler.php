<?php
$colorshift = true;

/**
 * Get the 30 latest chatroom entries.
 * Returns results in either JSON or HTML format, depending on POST parameters.
 *
 * @return string JSON or HTML
 */
function getChat(){
  $results=R::getAll('select * from chatroom');
  $html = '';
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

/**
 * Add a new chat entry to the database.
 *
 * Stores a chat entry into the database based on the users Session ID and
 * a message in recieved as a POST parameter.
 */
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

/**
 * Alternates between generating two possible CSS background colors based on a boolean value.
 *
 * @return string CSS formatted background-color
 */
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
