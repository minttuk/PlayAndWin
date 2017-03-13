<?php
require 'rb.php';
session_start();

if ($_SESSION['id']) {
  $target_dir = "../../images/user/";
  $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
  $extension = end(explode(".", $_FILES["fileToUpload"]["name"]));
  $uploadOk = 1;
  $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
  // Check if image file is a actual image or fake image
  if(isset($_POST["submit"])) {
      $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
      if($check !== false) {
          //echo "File is an image - " . $check["mime"] . ".";
          $uploadOk = 1;
      } else {
          echo "File is not an image.";
          $uploadOk = 0;
      }
  }
  // Check file size
  if ($_FILES["fileToUpload"]["size"] > 500000) {
      echo "Sorry, your file is too large.";
      $uploadOk = 0;
  }
  // Allow certain file formats
  if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
  && $imageFileType != "gif" ) {
      echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed." . $imageFileType . $target_file;
      $uploadOk = 0;
  }
  // Check if $uploadOk is set to 0 by an error
  if ($uploadOk == 0) {
      echo "Sorry, your file was not uploaded.";
  // if everything is ok, try to upload file
  }

  else {
      if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_dir . $_SESSION['id'] . "." . $extension)) {
          R::setup( 'mysql:host=localhost;dbname=playandwin', 'root', '' );
          $user = R::load('user', $_SESSION['id']);
          $newfilename = $_SESSION['id'] . "." .  $extension;
          $user->profilepicture = $newfilename;
          R::store($user);
          header('Location: /PlayAndWin/profile.html');
      }
      else {
          echo "Sorry, there was an error uploading your file.";
      }
  }
}
?>
