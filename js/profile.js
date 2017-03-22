var userId;
var controller = "/Backend/php/controller.php?q=";
var sessionId;

function getScoreTable() {
  var idParam = '';
  if (getLastDir())
    idParam = 'id='+getLastDir()+'&';
  $.ajax({url: '/Backend/php/controller.php?q=getHighscores&'+idParam+'table',
    datatype:'html',success: function(result){$("#highscores").html(result);
  }});
}

function parseURL(param){
  var results = new RegExp('[\?&]' + param + '=([^&#]*)').exec(window.location.href);
  if (results==null)
    return null;
  return results[1] || 0;
}

function getLastDir() {
  var last = window.location.href.split('/');
  var last = last.pop();
  if (last == 'profile' || last == '')
    return null;
  return last.replace('#','');
}

function getSession() {
  $.ajax({
      url: "/Backend/php/controller.php?q=login",
      type: "get",
      dataType: "json",
      async: false,
      success: function (response){
        sessionId = response;
        if (response != -1) sessionId = response.name;
        return response;
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        sessionId = null;
      }
  });
}

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
          //console.log('success');
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
    showOtherUsers(response, 'showmutualfriendsdiv');
  });
  if (sessionId == userId) {
    getPendingFriends(function(error, response) {
      if (error) {
        console.log(error);
      }
      showOtherUsers(response, 'showpendingfriendsdiv');
    });
    getFriendRequests(function(error, response) {
      if (error) {
        console.log(error);
      }
      showOtherUsers(response, 'showfriendrequestsdiv');
    });
  }
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
      //console.log(response);
      if (response.length == 0) {
        $('.addfriendbutton').fadeOut(0, function() {
          $('#addfriendbuttontext').text('Add Friend');
          $(this).css('display', 'inline-block').fadeIn(500);
        });
      }
      else if (response.length == 1) {
        if (response[0]['user_id'] == userId) {
          $('#addfriendbuttontext').text('Accept Request');
          $('.addfriendbutton').fadeOut(0, function() {
            $(this).css('display', 'inline-block').fadeIn(500);
          });
        }
        else if (response[0]['friend_id'] == userId) {
          $('#deletefriendbuttontext').text('Cancel Request');
          $('.deletefriendbutton').fadeOut(0, function() {
            $(this).css('display', 'inline-block').fadeIn(500);
          });
        }
      }
      else if (response.length >= 2) {
        $('.deletefriendbutton').fadeOut(0, function() {
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
    if (getLastDir()) {
      userId = getLastDir();
    }
    else if (sessionId != -1) {
      userId = sessionId;
    }
    else {
      window.location = "/";
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
  $('#userdescription').fadeOut(0, function() {
    if (response.description == null) {
      $(this).text('').fadeIn(500);
    }
    else {
      $(this).text(response.description).fadeIn(500);
    }
  });
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
      $(this).attr("src", "../images/user/" + response.profilepicture).fadeIn(500);
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
  console.log(userId + " " + sessionId);
  if (userId != sessionId) {
    console.log(userId + " " + sessionId);
    $('.addfriendbutton').css('display', 'none');
    $('.addfriendbutton').attr('data-id', userId);
    $('.deletefriendbutton').css('display', 'none');
    $('.deletefriendbutton').attr('data-id', userId);
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
  showFriends();
  /*getFriendRequests(function(error, response) {
    if (error) {
      console.log(error);
    }
    console.log("friends " + response);
    showOtherUsers(response, 'showfriendrequestsdiv');
  });*/
  $('#friendrequeststab').attr('class', 'active');
  $('#showfriendrequestsdiv').css('display', 'inline-block');
  $('#mutualfriendstab').removeClass('active');
  $('#showmutualfriendsdiv').css('display', 'none');
  $('#pendingfriendstab').removeClass('active');
  $('#showpendingfriendsdiv').css('display', 'none');
})

$('#pendingfriendstab').click(function() {
  showFriends();
  /*getPendingFriends(function(error, response) {
    if (error) {
      console.log(error);
    }
    console.log("friends " + response);
    showOtherUsers(response, 'showpendingfriendsdiv');
  });*/
  $('#pendingfriendstab').attr('class', 'active');
  $('#showpendingfriendsdiv').css('display', 'inline-block');
  $('#mutualfriendstab').removeClass('active');
  $('#showmutualfriendsdiv').css('display', 'none');
  $('#friendrequeststab').removeClass('active');
  $('#showfriendrequestsdiv').css('display', 'none');
})

$('#mutualfriendstab').click(function() {
  showFriends();
  $('#mutualfriendstab').attr('class', 'active');
  $('#showmutualfriendsdiv').css('display', 'inline-block');
  $('#pendingfriendstab').removeClass('active');
  $('#showpendingfriendsdiv').css('display', 'none');
  $('#friendrequeststab').removeClass('active');
  $('#showfriendrequestsdiv').css('display', 'none');
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
        showOtherUsers(response, who);
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
        showOtherUsers(response, who);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
  });
}

//who = element id where people are shown
function showOtherUsers(response, who) {
  $('#' + who + '').empty();
  for (var i in response) {
    var div = $('<div></div>');
    div.addClass('col-md-3 img-w3-agile');
    var a = $('<a></a>');
    a.attr("href", response[i].username);
    //a.attr("target", "_blank");
    var img = $('<img></img>');
    img.attr("src", "../images/user/" + response[i].profilepicture);
    img.attr("alt", " ");
    a.append(img);
    var name = $('<p></p>');
    name.append(response[i].username);
    div.append(a, name);
    if (who == "showfriendrequestsdiv") {
      var buttonAdd = $('<a class="addfriendbutton"><i class="glyphicon glyphicon-ok"></i></a>');
      buttonAdd.attr("data-id", response[i].username);
      div.append(buttonAdd);
    }
    if (who == "showmutualfriendsdiv" || who == "showfriendrequestsdiv" || who == "showpendingfriendsdiv") {
      //var buttonDelete = $('<a class="deletefriendbutton"><i class="glyphicon glyphicon-remove" aria-hidden="true"></i></a>');
      var buttonDelete = $('<a class="deletefriendbutton"><i class="glyphicon glyphicon-remove"></i></a>');
      buttonDelete.attr("data-id", response[i].username);
      div.append(buttonDelete);
    }
    $('#' + who + '').append(div);
  }
  initHandlers();
}

// click event handlers are called after DOM elements creation too
function initHandlers() {

  $( ".addfriendbutton" ).click(function() {
    console.log("addfriendbutton clicked");
    var str = "addFriend&id=";
    console.log(userId);
    $.ajax({
        url: controller + str + $(this).attr('data-id'),
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

  $(".deletefriendbutton").click(function() {
    console.log("deletefriendbutton clicked");
    var str = "deleteFriend&id=";
    $.ajax({
        url: controller + str + $(this).attr('data-id'),
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
}


getScoreTable();
getSession();
getUserInfo();
getLastLoggedIn();
getNewUsers();
showFriends();
initHandlers();
