$( "#saveprofilebutton" ).click(function() {
  console.log("saveprofilebutton clicked");
  var str = "setUserInfo";
  var $newfirstname = $('input[name="newfirstname"]').val();
  var $newlastname = $('input[name="newlastname"]').val();
  var $newdescription = $('input[name="newdescription"]').val();
  var $newlocation = $('input[name="newlocation"]').val();

  $.ajax({
      url: "http://localhost/PlayAndWin/Backend/php/model.php?q=" + str,
      type: "post",
      dataType: "json",
      data: JSON.stringify({"id": "1", "firstname": $newfirstname, "lastname": $newlastname, "description": $newdescription, "location": $newlocation}),
      success: function (response){
        console.log('success');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
  });
})

$(document).ready(function() {
    var str = "getUserInfo";
    $.ajax({
        url: "http://localhost/PlayAndWin/Backend/php/model.php?q=" + str,
        type: "post",
        dataType: "json",
        data: JSON.stringify({"id": "1"}),
        success: function (response){
          //usernmae
          $('#username').fadeOut(0, function() {
              $(this).text(response[0].username).fadeIn(500);
          });
          //registration date
          $('#regdate').fadeOut(0, function() {
              $(this).text(response[0].reg_date.slice(0,10)).fadeIn(500);
          });
          //description
          if (response[0].description != null) {
            $('#userdescription').fadeOut(0, function() {
                $(this).text(response[0].description).fadeIn(500);
            });
            $('input[name="newdescription"]').val(response[0].description);
          }
          //location
          $('#userlocation').fadeOut(0, function() {
              $(this).text(response[0].location).fadeIn(500);
          });
          //firstname
          if (response[0].firstname != null) {
            $('input[name="newfirstname"]').val(response[0].firstname);
          }
          //lastname
          if (response[0].lastname != null) {
            $('input[name="newlastname"]').val(response[0].lastname);
          }
          //location
          if (response[0].location != null) {
            $('input[name="newlocation"]').val(response[0].location);
          }
          console.log(response[0].id);
          console.log(response[0].username);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
        }
    });
})
