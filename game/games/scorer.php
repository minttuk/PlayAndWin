<?php
session_start();

$maxTime = 30000;
$minTime = 500;

if(isset($_REQUEST['begin'])) {
  begin($_REQUEST['begin']);
}
if(isset($_REQUEST['update']) && isset($_REQUEST['token'])) {
  update($_REQUEST['update'], $_REQUEST['token']);
}

function begin($time) {
  $_SESSION['score'] = 0;
  $_SESSION['time'] = $time;
  setToken();
}

function update($time, $token) {
  if ($time - $_SESSION['time'] >= $GLOBALS['minTime'] &&
  $time - $_SESSION['time'] <= $GLOBALS['maxTime'] &&
  $token == $_SESSION['token'] &&
  $time/1000-time() < 2) {
    $_SESSION['score']=$_SESSION['score']+1;
    $_SESSION['time'] = $time;
    setToken();
  }
}

function setToken() {
  $_SESSION['token'] = sha1(rand());
  echo $_SESSION['token'];
}
?>