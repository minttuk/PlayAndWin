var signedIn = false;
isSignedIn();
updateCoins();

$(document).ready(function() {
  $("#signForm").submit(function(e) {
    e.preventDefault();
    $.post( "/rest/user", $( "#signForm" ).serialize(), function(result) {
      if(result.token) {
        location.reload();
      } else {
        $("#errorMsg").html('</br>'+result.data);
      }
    },'json');
  });
});
function signUpForm() {
  $("#signForm").html('<input type="text" class="text" name="Username" placeholder="'+$.i18n.prop('form_username',localStorage.getItem("lang"))+'" required="">'+
				    '<input type="text" class="text" name="Firstname"  placeholder="'+ $.i18n.prop('form_firstname',localStorage.getItem("lang"))+
            '" pattern="[a-zA-Z]+" required="" title="'+$.i18n.prop('form_valid_name',localStorage.getItem("lang"))+'">'+
            '<input type="text" class="text" name="Lastname"  placeholder="'+ $.i18n.prop('form_lastname',localStorage.getItem("lang"))+
            '" pattern="[a-zA-Z]+" required="" title="'+$.i18n.prop('form_valid_name',localStorage.getItem("lang"))+'">'+
            '<input type="email" class="text" name="Email"  placeholder="'+ $.i18n.prop('form_email',localStorage.getItem("lang"))+
            '" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" required="" title="'+$.i18n.prop('form_valid_email',localStorage.getItem("lang"))+'">'+
            '<input type="password" class="text" name="Password"  placeholder="'+ $.i18n.prop('form_password',localStorage.getItem("lang"))+
            '" pattern="(?=.*\\d).{6,}" required="" title="'+$.i18n.prop('form_valid_password',localStorage.getItem("lang"))+'">'+
            '<input type="password" class="text" name="ConfirmPassword" placeholder="'+$.i18n.prop('form_confirm',localStorage.getItem("lang"))+'" required="">'+
				    '<input type="submit" class="more_btn" name="submit" value="'+$.i18n.prop('navbar_signup',localStorage.getItem("lang"))+'"><p id="errorMsg"></p>');
}
function signInForm() {
  if(signedIn) {
    $('.signIn').removeAttr('data-toggle');
    $.get('/rest/user/logout', function(){
      location.reload();
    });
  } else {
    $("#signForm").html('<input type="text" class="text" name="Username" placeholder='+$.i18n.prop('form_username',localStorage.getItem("lang"))+' required="">'
                      +'<input type="password" class="text" name="Password" placeholder='+$.i18n.prop('form_password',localStorage.getItem("lang"))+' required="">'
                      +'<input type="submit" class="more_btn" name="submit" value="'+$.i18n.prop('navbar_signin',localStorage.getItem("lang"))+'"><p id="errorMsg"></p>');
  }
}

function isSignedIn() {
  $.ajax({url: '/rest/user', async: false,
    success: function (id) { if (id != -1) signedIn = true;}
  });
  updateLogoutButton();
  if (signedIn) {
    $('#prof').css('display','block');
    $('.signUp').html('');
    //$('.signIn').html('Log out');
    $('.signUp').css({"color": "white", "font-size": "20px",'padding-top':'16px', 'width':'95px'});
  }
}

function updateLogoutButton(){
  if (signedIn) $('.signIn').text($.i18n.prop('navbar_logout'),localStorage.getItem("lang"));
}

function updateCoins() {
  if (signedIn){
    var html = '<i class="glyphicon glyphicon-copyright-mark"></i> ';
    if (sessionStorage.coins)
      $('.signUp').html(html+sessionStorage.coins);
    $.ajax({url: '/rest/coins',success:function (coins) {
      var newCoins = coins-sessionStorage.coins;
      var newCoinString = newCoins;
      if (newCoins > 0) newCoinString = '+'+newCoinString;
      if (coins != sessionStorage.coins) {
        $('.signUp').fadeOut(function() {
          $(this).html(html + '&nbsp;'+ newCoinString).fadeIn(function() {
            $(this).fadeOut(function() {
              $(this).html(html + coins).fadeIn('slow');
            });
          });
        });
        sessionStorage.coins = coins;
      }
    }});
  }
}
