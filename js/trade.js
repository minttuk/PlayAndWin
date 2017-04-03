/**
 * An ajax call to show all the products the user has.
 *
 * @returns
 */

function getCollection() {
  $.ajax({
      url:'/rest/collection/'+userId,
      dataType: "json",
      success: function (response){
        console.log(response);
        },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
  });
}
