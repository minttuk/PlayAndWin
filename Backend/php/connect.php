<?php

    $servername = "localhost";
    $username = "root";
    $password = "";
    $database = "playandwin";
    //$dbport = 3306;

    // connect
    $db= new mysqli($servername, $username, $password, $database, $dbport);
    // Check connection
    if ($db->connect_error) {
        die("Connection failed: " . $db->connect_error);
    }
    else {
      echo "Connected successfully (".$db->host_info.")";
    }

    mysqli_set_charset($db, "utf8");


?>
