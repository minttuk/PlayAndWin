<?php
header('Access-Control-Allow-Origin: *');
echo file_get_contents("http://ipinfo.io/json");

/*

$('#userlocation').click(function(){

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(location,fallback,{timeout:10000});
    function fallback(er){
      console.log(er.message+'\nUsing fallback location...');
      $.getJSON("/rest/dependencies/models/location.php", function(loc){
          console.log("Found location ["+loc.city+"]");
          $('#userlocation').html(loc.city);
      });
    }
     function location(pos){
       console.log('pos.coords.latitude');
       $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng="
         +pos.coords.latitude+","
         +pos.coords.longitude+"&key=AIzaSyDvCgxjSDBrtcbsLc2nUAco0ObaYGeO3f4",
         function(data){
           console.log("Found location ["+console.log(data.results[1].address_components)+"]");
           location = data.results[1].address_components;
           $('#userlocation').html( location[0].long_name);
       });
     }
  } else {
    console.log("Your browser doesn't support geolocation");
  }
});

*/
