var userId;
var sessionId;
// Sainin
var model = "../Backend/php/model.php?q=";
// Mintun
//var url = "../../Backend/php/model.php?q=";
getSession();


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
  var inputOk = checkEditedProfile($newfirstname, $newlastname);
  if (inputOk) {
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
  }
  else {
    $('.errormessage').text("Please fill in your first and last name.");
  }
})

function checkEditedProfile(firstname, lastname) {
  if (firstname.length > 0 && lastname.length > 0) {
    return true;
  }
  return false;
}

function getSession() {
  $.ajax({
      url: "../Backend/php/login.php",
      type: "get",
      dataType: "json",
      //data: JSON.stringify({"id": userId}),
      success: function (response){
        //console.log(response);
        sessionId = response;
        console.log('session is ' + sessionId);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        sessionId = null;
      }
  });
}

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
    userId = parseUri(window.location.search).queryKey['user'];
    if (!userId && !sessionId) {
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
          $('#membersince').fadeOut(0, function() {
              $(this).text('Member since: ' + response[0].reg_date.slice(0,10)).fadeIn(500);
          });
          //last online time
          $('#lastonline').fadeOut(0, function() {
            //$(this).text('Last seen: ' + response[0].last_online).fadeIn(500);
            var d = new Date();
            $(this).text('Last seen: ' + d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate() + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds()).fadeIn(500);
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
              if (response[0].location == null) {
                $(this).text("N/A").fadeIn(500);
              }
              else {
                $(this).text(response[0].location).fadeIn(500);
              }
          });
          //editprofilebutton, only visible in your own profile
          if (userId == sessionId) {
            $('#editprofilebutton').fadeOut(0, function() {
              $(this).css('display', 'inline-block').fadeIn(500);
            });
          }
          //addfriendbutton and sendmessagebutton only visible in other users profiles
          if (userId != sessionId) {
            $('#sendmessagebutton').fadeOut(0, function() {
              $(this).css('display', 'inline-block').fadeIn(500);
            });
            $('#addfriendbutton').fadeOut(0, function() {
              $(this).css('display', 'inline-block').fadeIn(500);
            });
          }
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

//getFriends();



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
