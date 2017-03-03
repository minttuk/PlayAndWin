var userId;
var model = "../Backend/php/model.php?q=";
var sessionId;

function getSession() {
  $.ajax({
      url: "../Backend/php/login.php",
      type: "get",
      dataType: "json",
      async: false,
      success: function (response){
        sessionId = response;
        console.log('session is ' + response);
        return response;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        sessionId = null;
      }
  });
}

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

/*
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
        window.location = "index.html";
      }
  });
}
*/

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

function getUserInfo() {
    if (parseUri(window.location.search).queryKey['user']) {
      userId = parseUri(window.location.search).queryKey['user']
      console.log('parse ' + userId);
    }
    else if (sessionId != -1) {
      userId = sessionId;
      console.log('else if ' + userId);
    }
    else {
      console.log('else');
      window.location = "index.html";
    }
    var str = "getUserInfo";
    $.ajax({
        url: model + str,
        type: "post",
        dataType: "json",
        data: JSON.stringify({"id": userId}),
        success: function (response){
          console.log(response);
          updateProfile(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
          window.location = "index.html";
        }
    });
}

function updateProfile(response) {
  $('#username').fadeOut(0, function() {
      $(this).text(response.username).fadeIn(500);
  });
  //registration date
  $('#membersince').fadeOut(0, function() {
      $(this).text('Member since: ' + response.reg_date.slice(0,10)).fadeIn(500);
  });
  //last online time
  $('#lastonline').fadeOut(0, function() {
    $(this).text('Last seen: ' + response.last_online).fadeIn(500);
  });
  //description
  if (response.description != null) {
    $('#userdescription').fadeOut(0, function() {
        $(this).text(response.description).fadeIn(500);
    });
    $('input[name="newdescription"]').val(response.description);
  }
  //location
  $('#userlocation').fadeOut(0, function() {
      if (response.location == null) {
        $(this).text("N/A").fadeIn(500);
      }
      else {
        $(this).text(response.location).fadeIn(500);
      }
  });
  if (response.profilepicture != 'default.png') {
    $('.profilepicture').fadeOut(0, function() {
      $(this).attr("src", "images/user/" + response.profilepicture).fadeIn(500);
    });
  }
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
  if (response.firstname != null) {
    $('input[name="newfirstname"]').val(response.firstname);
  }
  //lastname
  if (response.lastname != null) {
    $('input[name="newlastname"]').val(response.lastname);
  }
  //location
  if (response.location != null) {
    $('input[name="newlocation"]').val(response.location);
  }
}

function getLastLoggedIn() {
  var str = 'getLastLoggedIn';
  $.ajax({
      url: model + str,
      type: "get",
      dataType: "json",
      success: function (response){
        console.log(response);
        showLastLoggedIn(response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
  });
}

function showLastLoggedIn(response) {
  for (var i in response) {
    console.log(i);
    console.log(response[i].username);
    console.log(response[i].profilepicture);
    var div = $('<div></div>');
    div.addClass('col-md-3 img-w3-agile');
    var a = $('<a></a>');
    a.attr("href", "profile.html?user=" + response[i].id);
    a.attr("target", "_blank");
    var img = $('<img></img>');
    img.attr("src", "images/user/" + response[i].profilepicture);
    img.attr("alt", " ");
    a.append(img);
    var name = $('<p></p>');
    name.append(response[i].username);
    div.append(a, name);
    $('#lastloggedin').prepend(div);
  }
}



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

getSession();
getUserInfo();
getLastLoggedIn();
