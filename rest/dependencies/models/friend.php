<?php

/**
 * Gets the friends of a user by the user id. Returns a PHP array that contains the friends information
 *
 * @param $id is the users id whose friends are being retrieved
 *
 * @return PHP array
 */

function getMutualFriends($id) {
  //$friends = R::getAll('SELECT friend_id FROM friendship WHERE user_id = :id AND approved = 1', [':id' => getUserID($id)]);
  $friendsrow1 = R::getAll('SELECT friend_id FROM friendship WHERE user_id = :id', [':id' => getUserID($id)]);
  $friendsrow2 = R::getAll('SELECT user_id FROM friendship WHERE friend_id = :id', [':id' => getUserID($id)]);
  $friends = array();
  foreach ($friendsrow1 as $friend_id => $row1) {
    foreach ($friendsrow2 as $user_id => $row2) {
      if ( $row1['friend_id'] == $row2['user_id']) {
        $friends[] = array(
          'id' => $row1['friend_id'],
        );
      }
    }
  }
  $response = getFriendsInfo($friends);
  return $response;
}

/**
 * Gets the peding friends of a user by the user id. Returns a PHP array that contains the pending friends information
 *
 * @param $id is the users id whose peding friend requests are being retrieved
 *
 * @return PHP array
 */

function getPendingFriends($id) {
  //$pendingfriends = R::getAll( 'SELECT friend_id FROM friendship WHERE user_id = :id AND approved = 0', [':id' => getUserID($id)]);
  $friendsrow1 = R::getAll('SELECT friend_id FROM friendship WHERE user_id = :id', [':id' => $id]);
  $friendsrow2 = R::getAll('SELECT user_id FROM friendship WHERE friend_id = :id', [':id' => $id]);
  $friends = array();
  foreach ($friendsrow1 as $friend_id => $row1) {
    $mutual = false;
    foreach ($friendsrow2 as $user_id => $row2) {
      if ( $row1['friend_id'] == $row2['user_id']) {
        $mutual = true;
      }
    }
    if (!$mutual) {
      $friends[] = array(
        'id' => $row1['friend_id'],
      );
    }
  }
  $response = getFriendsInfo($friends);
  return $response;
}

/**
 * Gets the peding friends of a user by the user id. Returns a PHP array that contains the friend requests information
 *
 * @param $id is the users id whose friend requests are being retrieved
 *
 * @return PHP array
 */

function getFriendRequests($id) {
  //$friendrequests = R::getAll( 'SELECT user_id FROM friendship WHERE friend_id = :id AND approved = 0', [':id' => getUserID($id)]);
  $friendsrow1 = R::getAll('SELECT friend_id FROM friendship WHERE user_id = :id', [':id' => $id]);
  $friendsrow2 = R::getAll('SELECT user_id FROM friendship WHERE friend_id = :id', [':id' => $id]);
  $friends = array();
  foreach ($friendsrow2 as $user_id => $row1) {
    $mutual = false;
    foreach ($friendsrow1 as $friend_id => $row2) {
      if ( $row1['user_id'] == $row2['friend_id']) {
        $mutual = true;
      }
    }
    if (!$mutual) {
      $friends[] = array(
        'id' => $row1['user_id'],
      );
    }
  }
  $response = getFriendsInfo($friends);
  return $response;
}

/**
 * Returns the id, username and profilepicture of some an array of users
 *
 * @param $friends is an array of users
 *
 * @return PHP array
 */

 function getFriendsInfo($friends) {
   //echo json_encode($friends);
   $response = array();
   foreach ($friends as $id => $friend) {
     $friendsinfo = R::getAll('SELECT id, username, profilepicture FROM user WHERE id = :id', [':id' => $friend['id']]);
     $response[] = array(
       'id' => $friendsinfo[0]['id'],
       'username' => $friendsinfo[0]['username'],
       'profilepicture' => $friendsinfo[0]['profilepicture'],
     );
   }
   return $response;
 }

/*
function getFriendsInfo($friends) {
  $response = array();
  foreach ($friends as $friend) {
    if (array_key_exists('friend_id',$friend)) {
      $userid = $friend['friend_id'];
    }
    else {
      $userid = $friend['user_id'];
    }
    $friendsinfo = R::getAll('SELECT id, username, profilepicture FROM user WHERE id = :id', [':id' => $userid]);
    $response[] = array(
      'id' => $friendsinfo[0]['id'],
      'username' => $friendsinfo[0]['username'],
      'profilepicture' => $friendsinfo[0]['profilepicture'],
    );
  }
  return $response;
}
*/

/**
 * Returns the number of mutual friend rows
 *
 * @param $id is the users id whose friend cout is being retrieved
 *
 * @return PHP array
 */

function getFriendsCount($id) {
  //echo $id;
  //$friends = R::getAll('SELECT COUNT(*) AS friendcount FROM friendship WHERE user_id = :id AND approved = 1', [':id' => $id]);
  //return $friends[0]['friendcount'];
  $friendsrow1 = R::getAll('SELECT friend_id FROM friendship WHERE user_id = :id', [':id' => $id]);
  $friendsrow2 = R::getAll('SELECT user_id FROM friendship WHERE friend_id = :id', [':id' => $id]);
  $friendscount = 0;
  foreach ($friendsrow1 as $friend_id => $row1) {
    foreach ($friendsrow2 as $user_id => $row2) {
      if ( $row1['friend_id'] == $row2['user_id']) {
        $friendscount++;
      }
    }
  }
  return $friendscount;
}

/**
 * Adds a friend request or approves a friendship. If no previous rows exist for the users passed as parameters, a new row is added. If a request exists already from the other user its updated as approved and another row is added with ids other way
 *
 * @param $myId is the session user id and $friendId is the friend id
 *
 * @return PHP array
 */

function addFriend($myId, $friendId) {
  $friendId = getUserID($friendId);
  $response = array('message' => 'No session id');
  if ($myId != -1 && $myId != null) {
    /*
    $approved = 0;
    $mutualAdd =  R::getAll('SELECT * FROM friendship WHERE user_id = :friendid AND friend_id = :sessionid', [':friendid' => $friendId, ':sessionid' => $myId]);
    if ($mutualAdd != null) {
      $approved = 1;
      R::exec('UPDATE friendship SET approved = :approved WHERE user_id = :friendid AND friend_id = :sessionid', [':sessionid' => $myId, ':friendid' => $friendId, ':approved' => $approved]);
    }
    */
    $alreadyExists =  R::getAll('SELECT * FROM friendship WHERE user_id = :sessionid AND friend_id = :friendid', [':friendid' => $friendId, ':sessionid' => $myId]);
    if (!$alreadyExists) {
      R::exec('INSERT INTO friendship (user_id, friend_id) VALUES (:sessionid, :friendid)', [':sessionid' => $myId, ':friendid' => $friendId]);
      $response = array('message' => 'Friend added succesfully!');
      $user = R::load('user',$myId);
      $friend = R::load('user',$friendId);
      //sendEmail($friend->email,$friend->username,'friend',$user->username);
    }
    else {
      $response = array('message' => 'Friend has already been added');
    }
  }
  return $response;
}

/**
 * Deletes all friendship rows with the two parameter ids
 *
 * @param $myId is the session user id and $friendId is the friends id
 *
 * @return PHP array
 */

function deleteFriend($myId, $friendId) {
  $friendId = getUserID($friendId);
  $response = array('message' => 'No session id');
  if ($myId != -1 && $myId != null) {
    R::exec('DELETE FROM friendship WHERE (user_id = :sessionid AND friend_id = :friendid) OR (friend_id = :sessionid AND user_id = :friendid)', [':friendid' => $friendId, ':sessionid' => $myId]);
    $response = array('message' => 'Friend deleted succesfully!');
  }
  return $response;
}

/**
 * Returns the friendship of the session user and another user. Two rows of result means mutual friendship. 1 row means either user has sent a friend request. 0 rows means no friend requests sent.
 *
 * @return PHP array
 */

function getFriendship($myId, $friendId) {
  $friendId = getUserID($friendId);
  $result = R::getAll('SELECT * FROM friendship WHERE (user_id = :sessionid AND friend_id = :friendid) OR (friend_id = :sessionid AND user_id = :friendid)', [':friendid' => $friendId, ':sessionid' => $myId]);
  if ($result) {
    for ($i = 0; $i < count($result); $i++) {
      $result[$i]['user_id'] = getUserName($result[$i]['user_id']);
      $result[$i]['friend_id'] = getUserName($result[$i]['friend_id']);
    }
  }
  return $result;
}
