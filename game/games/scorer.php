<?php
session_start();

if(isset($_REQUEST['begin'])) {
  $_SESSION['score'] = 0;
}
if(isset($_REQUEST['update'])) {
  $_SESSION['score']=$_SESSION['score']+1;
}

?>
