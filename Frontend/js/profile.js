var userId;
var controller = "../Backend/php/controller.php?q=";
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
  var str = "addFriend&id=";
  console.log(userId);
  $.ajax({
      url: controller + str + userId,
      //type: "post",
      dataType: "json",
      //data: JSON.stringify({"friendid": userId}),
      success: function (response){
        console.log(response);
        showFriends();
        getUserInfo();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
  });
})

$("#deletefriendbutton").click(function() {
  console.log("deletefriendbutton clicked");
  var str = "deleteFriend&id=";
  $.ajax({
      url: controller + str + userId,
      //type: "post",
      dataType: "json",
      //data: JSON.stringify({"friendid": userId}),
      success: function (response){
        console.log(response);
        showFriends();
        getUserInfo();
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
        url: controller + str,
        type: "post",
        dataType: "json",
        data: JSON.stringify({"id": userId, "firstname": $newfirstname, "lastname": $newlastname, "description": $newdescription, "location": $newlocation}),
        success: function (response){
          console.log('success');
          getUserInfo();
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

function showFriends(){
  getMutualFriends(function(error, response) {
    if (error) {
      console.log(error);
    }
    showLastUsers(response, 'showfriendsdiv');
  });
}

function getMutualFriends(callback) {
  var str = "getMutualFriends&id=";
  $.ajax({
      url: controller + str + userId,
      dataType: "json",
      success: function (response){
        callback(null, response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        callback(errorThrown);
      }
  });
}

function getPendingFriends(callback) {
  var str = "getPendingFriends&id=";
  $.ajax({
      url: controller + str + userId,
      dataType: "json",
      success: function (response){
        console.log(response);
        callback(null, response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        callback(errorThrown);
      }
  });
}

function getFriendRequests(callback) {
  var str = "getFriendRequests&id=";
  $.ajax({
      url: controller + str + userId,
      dataType: "json",
      success: function (response){
        console.log(response);
        callback(null, response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        callback(errorThrown);
      }
  });
}

function showFriendActionButton() {
  getFriendship(function(error, response) {
    if (error) {
      console.log(error);
    }
    else {
      console.log(response);
      if (response.length == 0) {
        $('#addfriendbutton').fadeOut(0, function() {
          $(this).css('display', 'inline-block').fadeIn(500);
        });
      }
      else if (response.length == 1) {
        if (response[0]['user1_id'] == userId) {
          $('#addfriendbuttontext').text('Accept Request');
          $('#addfriendbutton').fadeOut(0, function() {
            $(this).css('display', 'inline-block').fadeIn(500);
          });
        }
        else if (response[0]['user2_id'] == userId) {
          $('#deletefriendbuttontext').text('Cancel Request');
          $('#deletefriendbutton').fadeOut(0, function() {
            $(this).css('display', 'inline-block').fadeIn(500);
          });
        }
      }
      else if (response.length >= 2) {
        $('#deletefriendbutton').fadeOut(0, function() {
          $(this).css('display', 'inline-block').fadeIn(500);
        });
      }
    }
  });
}

function getFriendship(callback) {
  var str = "getFriendship&id=";
  $.ajax({
      url: controller + str + userId,
      dataType: "json",
      success: function (response){
        callback(null, response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        callback(errorThrown);
      }
  });
}

function getUserInfo() {
    if (parseURL('user')) {
      userId = parseURL('user');
    }
    else if (sessionId != -1) {
      userId = sessionId;
    }
    else {
      window.location = "index.html";
    }
    var str = "getUserInfo&id=" + userId;
    $.ajax({
        url: controller + str,
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
    $('#addfriendbutton').css('display', 'none');
    $('#deletefriendbutton').css('display', 'none');
    showFriendActionButton();
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
  getFriendRequests(function(error, response) {
    if (error) {
      console.log(error);
    }
    console.log("friends " + response);
    showLastUsers(response, 'showfriendsdiv');
  });
  $('#friendrequeststab').attr('class', 'active');
  $('#mutualfriendstab').removeClass('active');
  $('#pendingfriendstab').removeClass('active');
})

$('#pendingfriendstab').click(function() {
  getPendingFriends(function(error, response) {
    if (error) {
      console.log(error);
    }
    console.log("friends " + response);
    showLastUsers(response, 'showfriendsdiv');
  });
  $('#pendingfriendstab').attr('class', 'active');
  $('#mutualfriendstab').removeClass('active');
  $('#friendrequeststab').removeClass('active');
})

$('#mutualfriendstab').click(function() {
  showFriends();
  $('#mutualfriendstab').attr('class', 'active');
  $('#pendingfriendstab').removeClass('active');
  $('#friendrequeststab').removeClass('active');
})

function getLastLoggedIn() {
  var str = 'getLastLoggedIn';
  $.ajax({
      url: controller + str,
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
      url: controller + str,
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

function showLastUsers(response, who) {
  $('#' + who + '').empty();
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
