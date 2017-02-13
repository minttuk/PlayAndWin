$( "#saveprofilebutton" ).click(function() {
  console.log("saveprofilebutton clicked");
});

// WORK IN PROGRESS / NOT WORKING YET
$(document).ready(function() {
    var $str = "getUserInfo";
    $.ajax({
        url: "http://localhost/PlayAndWin/Backend/php/model.php?q=" + $str,
        type: "post",
        //dataType: "json",
        data: JSON.stringify('{"id": "1"}'),
        success: function(response){
          console.log(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
        }
    });
})
