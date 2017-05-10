var userId;
var sessionId;


$('input[type="date"]').attr('max', function () {
  return new Date().toJSON().split('T')[0];
});

/**
 * Gets the highscores and adds them to the html of #hihgscores
 */
function getScoreTable() {
  $.ajax({
    url: '/rest/score/' + getLastDir() + '?table',
    datatype: 'html',
    success: function (result) {
      $("#highscores").html(result);
    }
  });
}

/**
 * Takes the current location and finds the last URI component of the location and return it
 *
 *@returns {string} the last URI component
 */
function getLastDir() {
  var last = window.location.href.split('/');
  last = last.pop();
  if (last == 'profile' || last == '')
    return '';
  return decodeURIComponent(last.replace('#', ''));
}

/**
 * Gets the username of the currently signed in user from the server and sets it to a variable
 */
function getUsername() {
  $.ajax({
    url: "/rest/user",
    type: "get",
    dataType: "json",
    success: function (response) {
      sessionId = response;
      if (response != -1) {
        sessionId = response.name;
        getUserInfo();
        showFriends();
      } else {
        window.location = '/';
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    }
  });
}

/**
 * Saving public profile information from the Account Settings form
 */
$("#public-profile-form").submit(function (e) {
  e.preventDefault();
  submitUserInfo($(this).serialize());
});

/**
 * Saving private profile information from the Account Settings form
 */
$("#private-profile-form").submit(function (e) {
  e.preventDefault();
  submitUserInfo($(this).serialize());
});

/**
 * Submits the User Info form data and hides the #editprofilemodal if succesful
 *
 *@param {string} The serialized User Info form data
 */
function submitUserInfo(params) {
  $.ajax({
    url: '/rest/user?' + params,
    type: 'PUT',
    success: function (response) {
      getUserInfo();
      if (response == '') $('#editprofilemodal').modal('hide');
    }
  });
}
/**
 * Saving a new password from the Account Settings form after it is checked
 */
$("#password-profile-form").submit(function (e) {
  e.preventDefault();
  var $newpassword = $('input[name="NewPassword"]').val();
  var $confirmpassword = $('input[name="ConfirmPassword"]').val();
  $.ajax({
    url: '/rest/user',
    type: "PUT",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify({
      "newpassword": $newpassword,
      "confirmpassword": $confirmpassword
    }),
    success: function (response) {
      if (response.data) {
        translate(response.data, function (translation) {
          $(".psserrormessage").animate({
            'padding-top': "20px",
            'padding-bottom': "10px"
          }, 300, function () {
            $('.psserrormessage').hide().text(translation).fadeIn('slow');
          });
        });
      } else {
        if (response.data == '') $('#editprofilemodal').modal('hide');
        $('input[name="NewPassword"]').val("");
        $('input[name="ConfirmPassword"]').val("");
        $('.psserrormessage').text("");
        //$('.psserrormessage').text($.i18n.prop('form_psschanged',localStorage.getItem("lang")));
      }
    }
  });
});

/**
 * When Account Settings modal is closed, prefilled information is updated
 */

$("#editprofilecancel").click(function () {
  getUserInfo();
});

/**
 * Shows mutual friends, pending and friend requests on the friend modal
 */

function showFriends() {
  getMutualFriends(function (error, response) {
    if (error) {
      console.log(error);
    }
    showOtherUsers(response, 'showmutualfriendsdiv');
  });
  if (sessionId == userId) {
    getPendingFriends(function (error, response) {
      if (error) {
        console.log(error);
      }
      showOtherUsers(response, 'showpendingfriendsdiv');
    });
    getFriendRequests(function (error, response) {
      if (error) {
        console.log(error);
      }
      showOtherUsers(response, 'showfriendrequestsdiv');
    });
  }
}

/**
 * Gets all the users that are mutual friends with the user
 */

function getMutualFriends(callback) {
  $.ajax({
    url: '/rest/friends/' + userId,
    dataType: "json",
    success: function (response) {
      callback(null, response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
      callback(errorThrown);
    }
  });
}

/**
 * Gets all the users that the user has sent a friendrequest to but request is not approved or declined yet
 */

function getPendingFriends(callback) {
  $.ajax({
    url: '/rest/friends/pending/' + userId,
    dataType: "json",
    success: function (response) {
      callback(null, response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
      callback(errorThrown);
    }
  });
}

/**
 * Gets all the users that have sent a friend request to the user, but the user has not yet approved or declined it
 */

function getFriendRequests(callback) {
  $.ajax({
    url: '/rest/friends/requests/' + userId,
    dataType: "json",
    success: function (response) {
      callback(null, response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
      callback(errorThrown);
    }
  });
}

/**
 * Shows friend action buttons (add friend, delete friend, accept request, cancel request) depending on the friendship
 */

function showFriendActionButton() {
  getFriendship(function (error, response) {
    if (error) {
      console.log(error);
    } else {
      //console.log(response);
      if (response.length == 0) {
        $('.addfriendbutton').fadeOut(0, function () {
          $('#addfriendbuttontext').text($.i18n.prop('profile_addfriend', localStorage.getItem("lang")));
          $(this).css('display', 'inline-block').fadeIn(500);
        });
      } else if (response.length == 1) {
        if (response[0]['user_id'] == userId) {
          $('#addfriendbuttontext').text($.i18n.prop('profile_acceptrequest', localStorage.getItem("lang")));
          $('.addfriendbutton').fadeOut(0, function () {
            $(this).css('display', 'inline-block').fadeIn(500);
          });
          $('#deletefriendbuttontext').text($.i18n.prop('profile_rejectrequest', localStorage.getItem("lang")));
          $('.deletefriendbutton').fadeOut(0, function () {
            $(this).css('display', 'inline-block').fadeIn(500);
          });
        } else if (response[0]['friend_id'] == userId) {
          $('#deletefriendbuttontext').text($.i18n.prop('profile_cancelrequest', localStorage.getItem("lang")));
          $('.deletefriendbutton').fadeOut(0, function () {
            $(this).css('display', 'inline-block').fadeIn(500);
          });
        }
      } else if (response.length >= 2) {
        $('#deletefriendbuttontext').text($.i18n.prop('profile_deletefriend', localStorage.getItem("lang")));
        $('.deletefriendbutton').fadeOut(0, function () {
          $(this).css('display', 'inline-block').fadeIn(500);
        });
      }
    }
  });
}

/**
 * Gets friendship wether users are mutual friends, the friendship is unconfirmed or no requests at all
 *
 *@param {function} a callback function
 */

function getFriendship(callback) {
  $.ajax({
    url: '/rest/friends?id=' + userId,
    dataType: "json",
    success: function (response) {
      callback(null, response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
      callback(errorThrown);
    }
  });
}

/**
 * Gets users public information
 */

function getUserInfo() {
  if (getLastDir() != '') {
    userId = getLastDir();
  } else if (sessionId) {
    userId = sessionId;
  }
  $.ajax({
    url: '/rest/user/' + userId,
    dataType: "json",
    success: function (response) {
      updateProfile(response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    }
  });
}

/**
 * Updates information on the profile page
 *
 *@param {object} Ajax response object
 */

function updateProfile(response) {
  showProfileInformation(response);
  //editprofile button and change picture button only visible in your own profile
  if (userId == sessionId) {
    showOwnProfileFields();
  }
  //addfriendbutton and sendmessagebutton only visible in other users profiles
  if (userId != sessionId) {
    initFriendActionButton();
    showFriendActionButton();
  }
  prefillEditForm(response);
}

/**
 * Fills fields with user information in the user profile
 *
 *@param {object} Ajax response object
 */

function showProfileInformation(response) {
  $('#username').fadeOut(0, function () {
    $(this).text(response.username).fadeIn(500);
  });
  //registration date
  $('#membersince').fadeOut(0, function () {
    $(this).text(" " + localizeDateTime(response.reg_date).split('\xa0\xa0')[0]).fadeIn(500);
  });
  //last online time
  $('#lastonline').fadeOut(0, function () {
    $(this).text(" " + localizeDateTime(response.last_online)).fadeIn(500);
  });
  //description
  $('#userdescription').fadeOut(0, function () {
    if (response.description == null) {
      $(this).text('').fadeIn(500);
    } else {
      $(this).text(response.description).fadeIn(500);
    }
  });
  //location
  $('#userlocation').fadeOut(0, function () {
    if (response.location == null) {
      $(this).text("N/A").fadeIn(500);
    } else {
      $(this).text(response.location).fadeIn(500);
    }
  });
  $('#userfriendsbutton').fadeOut(0, function () {
    $(this).text(" (" + response.friends + ")").fadeIn(500);
  });
  if (response.profilepicture != 'default.png') {
    $('.profilepicture').fadeOut(0, function () {
      $(this).attr("src", "../images/user/" + response.profilepicture).fadeIn(500);
    });
  }
}

/**
 * Shows edit profile options if user is in his/her own profile
 */

function showOwnProfileFields() {
  $('#editprofilebutton').fadeOut(0, function () {
    $(this).css('display', 'inline-block').fadeIn(500);
  });
  $('#editpicturebutton').fadeOut(0, function () {
    $(this).css('display', 'inline-block').fadeIn(500);
  });
  $('#mycollectionbutton').fadeOut(0, function () {
    $(this).css('display', 'inline-block').fadeIn(500);
  });
  $('#friendrequeststab').css("display", "inline-block");
  $('#pendingfriendstab').css("display", "inline-block");
}

/**
 * Adds current profile user id to friend action buttons
 */

function initFriendActionButton() {
  $('.addfriendbutton').css('display', 'none');
  $('.addfriendbutton').attr('data-id', userId);
  $('.deletefriendbutton').css('display', 'none');
  $('.deletefriendbutton').attr('data-id', userId);
}

/**
 * Prefills user edit form with current data
 *
 *@param {object} Ajax response object
 */

function prefillEditForm(response) {
  //firstname
  if (response.firstname != null) {
    $('input[name="firstname"]').val(response.firstname);
  }
  //lastname
  if (response.lastname != null) {
    $('input[name="lastname"]').val(response.lastname);
  }
  //age
  if (response.age != null) {
    $('input[name="age"]').val(response.age);
  }
  //gender
  if (response.gender != null) {
    $('select[name="gender"]').val(response.gender).change();
  }
  //description
  if (response.description != null) {
    $('input[name="description"]').val(response.description);
  }
  //location
  if (response.location != null) {
    $('input[name="location"]').val(response.location);
  }
  //clear any errormessages and passwords
  $('input[name="NewPassword"]').val("");
  $('input[name="ConfirmPassword"]').val("");
  $('.psserrormessage').text("");
  $('.errormessage').text("");

}

/**
 * Shows friend requests in friend modal
 */

$('#friendrequeststab').click(function () {
  showFriends();
  $('#friendrequeststab').attr('class', 'active');
  $('#showfriendrequestsdiv').css('display', 'inline-block');
  $('#mutualfriendstab').removeClass('active');
  $('#showmutualfriendsdiv').css('display', 'none');
  $('#pendingfriendstab').removeClass('active');
  $('#showpendingfriendsdiv').css('display', 'none');
})

/**
 * Shows pending friend requests in the friend modal
 */

$('#pendingfriendstab').click(function () {
  showFriends();
  $('#pendingfriendstab').attr('class', 'active');
  $('#showpendingfriendsdiv').css('display', 'inline-block');
  $('#mutualfriendstab').removeClass('active');
  $('#showmutualfriendsdiv').css('display', 'none');
  $('#friendrequeststab').removeClass('active');
  $('#showfriendrequestsdiv').css('display', 'none');
})

/**
 * Shows mutual friends in the friend modal
 */

$('#mutualfriendstab').click(function () {
  showFriends();
  $('#mutualfriendstab').attr('class', 'active');
  $('#showmutualfriendsdiv').css('display', 'inline-block');
  $('#pendingfriendstab').removeClass('active');
  $('#showpendingfriendsdiv').css('display', 'none');
  $('#friendrequeststab').removeClass('active');
  $('#showfriendrequestsdiv').css('display', 'none');
})

/**
 * Gets max 8 users that were last logged in
 */

function getLastLoggedIn() {
  $.ajax({
    url: '/rest/users/last',
    type: "get",
    dataType: "json",
    success: function (response) {
      //passes also div name to function because the same function is used to show new users
      var who = 'lastloggedin';
      showOtherUsers(response, who);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    }
  });
}

/**
 * Gets max 8 users that last registered to the site
 */

function getNewUsers() {
  $.ajax({
    url: '/rest/users/new',
    type: "get",
    dataType: "json",
    success: function (response) {
      //passes also div name to function because the same function is used to show new users
      var who = 'newusers';
      showOtherUsers(response, who);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    }
  });
}

$('#mycollectionbutton').click(function () {
  getCollection();
});
/**
 * Redeems an item and either fades out the item from view of adjusts the it's amount
 *
 *@param {int} Product id
 */
function redeemItem(id) {
  $.post('/rest/collection/redeem', {
    product: id
  }, function (data) {
    data < 1 ? ($('#item_' + id).fadeOut(500)) : ($('#amt_' + id).text(data));
  });
}

/**
 * Gets all the products that the user has and shows them in the collection modal
 */

function getCollection() {
  $.ajax({
    url: '/rest/collection/' + localStorage.getItem("lang"),
    dataType: "json",
    success: function (response) {
      console.log(response);
      $('#mycollection').empty();
      $.each(response, function (i, item) {
        $('#mycollection').append(
          '<div class="collectionrow row" id="item_' + item.id + '">' +
          '<div class="col-xs-6 center_img"><img class="item_img center-block" src="' + item.picture + '" /></div>' +
          '<div class="col-xs-6 col_left text-center"><h3 class="items_info item' + i + '">' + item.name + '</h3>' +
          '<h4  class="items_info">' + $.i18n.prop('shop_cost', localStorage.getItem("lang")) + ": " + item.price + '</h4>' +
          '<h4 class="items_info">' + $.i18n.prop('shop_amount', localStorage.getItem("lang")) + ': <span id="amt_' + item.id + '">' + item.amount + '</span></h4>' +
          '<button class="item_redeem" onclick=redeemItem("' + item.id + '");>' + $.i18n.prop('profile_redeem', localStorage.getItem("lang")) + '</button></div></div>'
        );
        translate(item.name, function (translation) {
          $('.item' + i).text(translation);
        });
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(textStatus, errorThrown);
    }
  });
}

/**
 * Shows last logged in and signed up users
 * @param {Object} response users list
 * @param {String} who the element where users are shown
 */

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


/**
 * Recreates event handlers when buttons and such are created with DOM
 */
function initHandlers() {

  $(".addfriendbutton").click(function () {
    console.log("addfriendbutton clicked");
    var str = "addFriend&id=";
    console.log(userId);
    $.ajax({
      url: '/rest/friends?id=' + $(this).attr('data-id'),
      type: "POST",
      dataType: "json",
      //data: JSON.stringify({"friendid": userId}),
      success: function (response) {
        console.log(response);
        showFriends();
        getUserInfo();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
  });

  $(".deletefriendbutton").click(function () {
    console.log("deletefriendbutton clicked");
    $.ajax({
      url: '/rest/friends?id=' + $(this).attr('data-id'),
      type: "DELETE",
      dataType: "json",
      //data: JSON.stringify({"friendid": userId}),
      success: function (response) {
        console.log(response);
        showFriends();
        getUserInfo();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
    });
  });
}

$('#userlocation').click(function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(location);

    function location(pos) {
      $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        pos.coords.latitude + "," +
        pos.coords.longitude + "&key=AIzaSyDvCgxjSDBrtcbsLc2nUAco0ObaYGeO3f4",
        function (data) {
          location = data.results[1].address_components;
          $('#userlocation').html(location[0].long_name);
          $.ajax({
            url: '/rest/user/location/' + location[0].long_name,
            type: 'PUT'
          });
        });
    }
  } else {
    console.log("Your browser doesn't support geolocation");
  }
});

$('#userlocation').click(function () {

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(location, fallback, {
      timeout: 10000
    });

    function fallback(er) {
      console.log(er.message + '\nUsing fallback location...');
      $.getJSON("/rest/dependencies/models/location.php", function (loc) {
        console.log("Found location [" + loc.city + "]");
        $('#userlocation').html(loc.city);
        $.ajax({
          url: '/rest/user/location/' + loc.city,
          type: 'PUT'
        });
      });
    }

    function location(pos) {
      $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        pos.coords.latitude + "," +
        pos.coords.longitude + "&key=AIzaSyDvCgxjSDBrtcbsLc2nUAco0ObaYGeO3f4",
        function (data) {
          console.log("Found location [" + data.results[1].address_components[1].long_name + "]");
          location = data.results[1].address_components;
          $('#userlocation').html(location[1].long_name);
          $.ajax({
            url: '/rest/user/location/' + location[1].long_name,
            type: 'PUT'
          });
        });
    }
  } else {
    console.log("Your browser doesn't support geolocation");
  }
});

getScoreTable();
getUsername();
getLastLoggedIn();
getNewUsers();
initHandlers();
