var userId;
var model = "../Backend/php/model.php?q=";
var sessionId;

function getScoreTable() {
  var idParam = '';
  if (parseURL('user'))
    idParam = 'id='+parseURL('user')+'&';
  $.ajax({url: '../Backend/php/highscore.php?'+idParam+'table',
    datatype:'html',success: function(result){$("#highscores").html(result);
  }});
}

function parseURL(param){
  var results = new RegExp('[\?&]' + param + '=([^&#]*)').exec(window.location.href);
  if (results==null)
    return null;
  return results[1] || 0;
}

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

//Work in progress... Not working yet.
function showFriends(){
  console.log('mentiin functioon getFriends()')
  getMutualFriends();
  if (userId == sessionId) {
    //getPendingFriends();
  }
}

function getMutualFriends() {
  var str = "getMutualFriends&id=";
  $.ajax({
      url: model + str + userId,
      dataType: "json",
      success: function (response){
        console.log(response);
        return response;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
  });
}

function getPendingFriends() {
  var str = "getFriends";
  $.ajax({
      url: model + str + userId,
      dataType: "json",
      success: function (response){
        console.log(response);
        return response;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
  });
}

function getUserInfo() {
    if (parseURL('user')) {
      userId = parseURL('user');
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
    var str = "getUserInfo&id=" + userId;
    $.ajax({
        url: model + str,
        dataType: "json",
        success: function (response){
          updateProfile(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
          //window.location = "index.html";
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
  $('#userfriendsbutton').fadeOut(0, function() {
    $(this).text(response.friends).fadeIn(500);
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
    $('#editpicturebutton').fadeOut(0, function() {
      $(this).css('display', 'inline-block').fadeIn(500);
    });
    $('#friendrequeststab').css("display", "inline-block");
    $('#pendingfriendstab').css("display", "inline-block");
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

$('#friendrequeststab').click(function() {
  $('#friendrequeststab').attr('class', 'active');
  $('#mutualfriendstab').removeClass('active');
  $('#pendingfriendstab').removeClass('active');
})

$('#pendingfriendstab').click(function() {
  $('#pendingfriendstab').attr('class', 'active');
  $('#mutualfriendstab').removeClass('active');
  $('#friendrequeststab').removeClass('active');
})

$('#mutualfriendstab').click(function() {
  $('#mutualfriendstab').attr('class', 'active');
  $('#pendingfriendstab').removeClass('active');
  $('#friendrequeststab').removeClass('active');
})

function getLastLoggedIn() {
  var str = 'getLastLoggedIn';
  $.ajax({
      url: model + str,
      type: "get",
      dataType: "json",
      success: function (response){
        //passes also div name to function because the same function is used to show new users
        var who = 'lastloggedin';
        showLastUsers(response, who);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
  });
}

function getNewUsers() {
  var str = 'getNewUsers';
  $.ajax({
      url: model + str,
      type: "get",
      dataType: "json",
      success: function (response){
        //passes also div name to function because the same function is used to show new users
        var who = 'newusers';
        showLastUsers(response, who);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
  });
}

//the order shown so far is in id order, gotta fix it at some point...
function showLastUsers(response, who) {
  for (var i in response) {
    var div = $('<div></div>');
    div.addClass('col-md-3 img-w3-agile');
    var a = $('<a></a>');
    a.attr("href", "profile.html?user=" + response[i].id);
    //a.attr("target", "_blank");
    var img = $('<img></img>');
    img.attr("src", "images/user/" + response[i].profilepicture);
    img.attr("alt", " ");
    a.append(img);
    var name = $('<p></p>');
    name.append(response[i].username);
    div.append(a, name);
    $('#' + who + '').append(div);
  }
}

getScoreTable()
getSession();
getUserInfo();
getLastLoggedIn();
getNewUsers();
showFriends();
