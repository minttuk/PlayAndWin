var userId;
// Sainin
var model = "http://localhost/PlayAndWin/Backend/php/model.php?q=";
// Mintun
//var url = "../../Backend/php/model.php?q=";

// Work in progress... Not working yet
$( "#addfriendbutton" ).click(function() {
  console.log("addfriendbutton clicked");
  var str = "addFriend";
  $.ajax({
      url: model + str,
      type: "post",
      dataType: "json",
      data: JSON.stringify({"friendId": userId}),
      success: function (response){
        console.log(response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
  });
})

$( "#saveprofilebutton" ).click(function() {
  console.log("saveprofilebutton clicked");
  var str = "setUserInfo";
  var $newfirstname = $('input[name="newfirstname"]').val();
  var $newlastname = $('input[name="newlastname"]').val();
  var $newdescription = $('input[name="newdescription"]').val();
  var $newlocation = $('input[name="newlocation"]').val();

  $.ajax({
      url: model + str,
      type: "post",
      dataType: "json",
      data: JSON.stringify({"id": userId, "firstname": $newfirstname, "lastname": $newlastname, "description": $newdescription, "location": $newlocation}),
      success: function (response){
        console.log('success');
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
  });
})

//Work in progress... Not working yet.
function getFriends(){
  console.log('mentiin functioon getFriends()')
  var str = "getFriends";
  $.ajax({
      url: model + str,
      type: "post",
      dataType: "json",
      data: JSON.stringify({"id": userId}),
      success: function (response){
        console.log(response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
  });
}

$(document).ready(function() {
    userId = parseUri(window.location.search).queryKey['id'];
    if (!userId) {
      window.location = "index.html";
    }
    var str = "getUserInfo";
    $.ajax({
        url: model + str,
        type: "post",
        dataType: "json",
        data: JSON.stringify({"id": userId}),
        success: function (response){
          //usernmae
          $('#username').fadeOut(0, function() {
              $(this).text(response[0].username).fadeIn(500);
          });
          //registration date
          $('#regdate').fadeOut(0, function() {
              $(this).text(response[0].reg_date.slice(0,10)).fadeIn(500);
          });
          //registration date
          $('#membersince').fadeOut(0, function() {
              $(this).text('Member since: ' + response[0].reg_date.slice(0,10)).fadeIn(500);
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



getFriends();


// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License

// Valmis url:n parsetusscripti. Tätä hyödynnetään dog.html:n urlin parsettamisessa. Urlissa määritetään kenen koiran tiedot sivu näyttää dynaamisesti.

function parseUri (str) {
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
};

parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};
