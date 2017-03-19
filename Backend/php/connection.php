<?php
require 'rb.php';

/**
 *Sets up the database connection
 *If default connection fails, fallback to Jenkins Server connection
 *
 *@return boolean Connection successful or not
 */
function connect() {
  $database = 'playandwin';
  $username = 'root';
  $password = '';

  R::setup( 'mysql:host=localhost;dbname='.$database, $username, $password );

  // Establish database for Jenkins
  if (!R::testConnection()) {
    R::addDatabase('jenkinsDB','mysql:host=10.114.32.140;dbname='.$database, 'jenkins', 'jenkins' );
    R::selectDatabase('jenkinsDB');
  }
  return R::testConnection();
}
?>
