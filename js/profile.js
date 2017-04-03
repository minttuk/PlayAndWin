var userId;
var sessionId;

function getScoreTable() {
  $.ajax({url: '/rest/score/'+getLastDir()+'?table',
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
    return '';
  return last.replace('#','');
}

function getSession() {
  $.ajax({
      url: "/rest/user",
      type: "get",
      dataType: "json",
      success: function (response){
        sessionId = response;
        if (response != -1) {
          sessionId = response.name;
          getUserInfo();
          showFriends();
        } else {
          window.location = '/';
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
  });
}

$( "#saveprofilebutton" ).click(function() {
  console.log("saveprofilebutton clicked");
  var $newfirstname = $('input[name="newfirstname"]').val();
  var $newlastname = $('input[name="newlastname"]').val();
  var $newdescription = $('input[name="newdescription"]').val();
  var $newlocation = $('input[name="newlocation"]').val();
  var inputOk = checkEditedProfile($newfirstname, $newlastname);
  if (inputOk) {
    $.ajax({
        url: '/rest/user',
        type: "PUT",
        contentType: "application/json",
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
  } else {
    $('.errormessage').text("Please fill in your first and last name.");
  }
});

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
  $.ajax({
      url:'/rest/friends/'+userId,
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
  $.ajax({
      url:'/rest/friends/pending/'+userId,
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

function getFriendRequests(callback) {
  $.ajax({
      url:'/rest/friends/requests/'+userId,
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

function showFriendActionButton() {
  getFriendship(function(error, response) {
    if (error) {
      console.log(error);
    }
    else {
      //console.log(response);
      if (response.length == 0) {
        $('.addfriendbutton').fadeOut(0, function() {
          $('#addfriendbuttontext').text($.i18n.prop('profile_addfriend',localStorage.getItem("lang")));
          $(this).css('display', 'inline-block').fadeIn(500);
        });
      }
      else if (response.length == 1) {
        if (response[0]['user_id'] == userId) {
          $('#addfriendbuttontext').text($.i18n.prop('profile_acceptrequest',localStorage.getItem("lang")));
          $('.addfriendbutton').fadeOut(0, function() {
            $(this).css('display', 'inline-block').fadeIn(500);
          });
          $('#deletefriendbuttontext').text($.i18n.prop('profile_rejectrequest',localStorage.getItem("lang")));
          $('.deletefriendbutton').fadeOut(0, function() {
              $(this).css('display', 'inline-block').fadeIn(500);
          });
        }
        else if (response[0]['friend_id'] == userId) {
          $('#deletefriendbuttontext').text($.i18n.prop('profile_cancelrequest',localStorage.getItem("lang")));
          $('.deletefriendbutton').fadeOut(0, function() {
            $(this).css('display', 'inline-block').fadeIn(500);
          });
        }
      }
      else if (response.length >= 2) {
        $('#deletefriendbuttontext').text($.i18n.prop('profile_deletefriend',localStorage.getItem("lang")));
        $('.deletefriendbutton').fadeOut(0, function() {
          $(this).css('display', 'inline-block').fadeIn(500);
        });
      }
    }
  });
}

function getFriendship(callback) {
  $.ajax({
      url: '/rest/friends?id='+userId,
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
    if (getLastDir()!='') {
      userId = getLastDir();
    }
    else if (sessionId) {
      userId = sessionId;
    }
    $.ajax({
        url: '/rest/user/'+userId,
        dataType: "json",
        success: function (response){
          updateProfile(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
        }
    });
}

function updateProfile(response) {
  $('#username').fadeOut(0, function() {
      $(this).text(response.username).fadeIn(500);
  });
  //registration date
  $('#membersince').fadeOut(0, function() {
      $(this).text(" " + localizeDateTime(response.reg_date).split(' ')[0]).fadeIn(500);
  });
  //last online time
  $('#lastonline').fadeOut(0, function() {
    $(this).text(" " + localizeDateTime(response.last_online)).fadeIn(500);
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
    $('#mycollectionbutton').fadeOut(0, function() {
      $(this).css('display', 'inline-block').fadeIn(500);
    });
    $('#friendrequeststab').css("display", "inline-block");
    $('#pendingfriendstab').css("display", "inline-block");
  }
  //addfriendbutton and sendmessagebutton only visible in other users profiles
  if (userId != sessionId) {
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
  //description
  if (response.description != null) {
    $('input[name="newdescription"]').val(response.description);
  }
  //location
  if (response.location != null) {
    $('input[name="newlocation"]').val(response.location);
  }
}

$('#friendrequeststab').click(function() {
  showFriends();
  $('#friendrequeststab').attr('class', 'active');
  $('#showfriendrequestsdiv').css('display', 'inline-block');
  $('#mutualfriendstab').removeClass('active');
  $('#showmutualfriendsdiv').css('display', 'none');
  $('#pendingfriendstab').removeClass('active');
  $('#showpendingfriendsdiv').css('display', 'none');
})

$('#pendingfriendstab').click(function() {
  showFriends();
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
  $.ajax({
      url:'/rest/users/last',
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
  $.ajax({
      url:'/rest/users/new',
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

$('#mycollectionbutton').click(function (){
  getCollection();
});

function getCollection() {
  $.ajax({
      url:'/rest/collection/'+userId,
      dataType: "json",
      success: function (response){
        console.log(response);
        $('#mycollection').empty();
        $.each(response, function(i, item) {
          $('#mycollection').append(
            '<div class="collectionrow row">'+
            '<div class="col-xs-6 center_img"><img class="item_img center-block" src="'+item.picture+'" /></div>'+
            '<div class="col-xs-6 col_left"><h3 class="items_info">'+item.name+'</h3>'+
            '<h4  class="items_info">'+$.i18n.prop('shop_cost',localStorage.getItem("lang")) + ": " + item.price+'</h4>'+
            '<h4>'+$.i18n.prop('shop_amount',localStorage.getItem("lang")) + ": " + item.amount+'</h4></div></div>');
          /*
          for (var i in response) {
            var row = $('<div class="collectionrow row">');
            var left_col = $('<div class="col-md-6 img-w3-agile"></div>');
            var right_col = $('<div class="col-md-6 img-w3-agile"></div>');
            var name = $('<h3></h3>');
            var cost = $('<h4></h4>');
            var amount = $('<h4></h4>');
            var img = $('<img></img>');
            img.attr("src", response[i].picture);
            img.css({'max-height':'300px','width':'auto','display':'block','margin':'auto'});
            img.attr("alt", "image of " + response[i].name);
            name.text(response[i].name);
            cost.text($.i18n.prop('shop_cost',localStorage.getItem("lang")) + ": " + response[i].price);
            amount.text($.i18n.prop('shop_amount',localStorage.getItem("lang")) + ": " + response[i].amount);
            right_col.append(img);
            left_col.append(name);
            left_col.append(cost);
            left_col.append(amount);
            row.append(right_col);
            row.append(left_col);
            $('#mycollection').append(row);
          }
          */
        });
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
    if (who == "showfriendrequestsdiv" || who == "showpendingfriendsdiv") {
      //var buttonDelete = $('<a class="deletefriendbutton"><i class="glyphicon glyphicon-remove" aria-hidden="true"></i></a>');
      var buttonDelete = $('<a class="deletefriendbutton"><i class="glyphicon glyphicon-remove"></i></a>');
      buttonDelete.attr("data-id", response[i].username);
      div.append(buttonDelete);
    }
    $('#' + who + '').append(div);
  }
  $(".addfriendbutton").off("click");
  $(".deletefriendbutton").off("click");
  initHandlers();
}

// click event handlers are called after DOM elements creation too
function initHandlers() {

  $( ".addfriendbutton" ).click(function() {
    console.log("addfriendbutton clicked");
    var str = "addFriend&id=";
    console.log(userId);
    $.ajax({
        url:'/rest/friends?id='+$(this).attr('data-id'),
        type: "POST",
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
  });

  $(".deletefriendbutton").click(function() {
    console.log("deletefriendbutton clicked");
    $.ajax({
        url:'/rest/friends?id='+$(this).attr('data-id'),
        type: "DELETE",
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
  });
}

$('#userlocation').click(function(){
  if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(location);
     function location(pos){
       $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng="
         +pos.coords.latitude+","
         +pos.coords.longitude+"&key=AIzaSyDvCgxjSDBrtcbsLc2nUAco0ObaYGeO3f4",
         function(data){
           location = data.results[1].address_components;
           $('#userlocation').html(location[0].long_name);
           $.ajax({url:'/rest/user/location/'+location[0].long_name,type:'PUT'});
       });
     }
  } else {
    console.log("Your browser doesn't support geolocation");
  }
});

$('#userlocation').click(function(){

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(location,fallback,{timeout:10000});
    function fallback(er){
      console.log(er.message+'\nUsing fallback location...');
      $.getJSON("/rest/dependencies/models/location.php", function(loc){
          console.log("Found location ["+loc.city+"]");
          $('#userlocation').html(loc.city);
          $.ajax({url:'/rest/user/location/'+loc.city,type:'PUT'});
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
           $.ajax({url:'/rest/user/location/'+location[0].long_name,type:'PUT'});
       });
     }
  } else {
    console.log("Your browser doesn't support geolocation");
  }
});

getScoreTable();
getSession();
//getUserInfo();
getLastLoggedIn();
getNewUsers();
//();
initHandlers();
