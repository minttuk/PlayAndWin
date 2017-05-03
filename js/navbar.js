var signedIn = document.cookie.match(/^(.*;)?\s*access_token\s*=\s*[^;]+(.*)?$/);
isSignedIn();
updateCoins();

$(document).ready(function() {
  $("#signForm").submit(function(e) {
    e.preventDefault();
    $.post( "/rest/user", $( "#signForm" ).serialize(), function(result) {
      if(result.token) {
        location.reload();
      } else {
        translate(result.data, function(translation){
          $("#errorMsg").animate({'padding-top': "20px",'padding-bottom': "10px"},300, function(){
              $('#errorMsg').hide().text(translation).fadeIn('slow');
          });
        });
      }
    },'json');
  });
});
function signUpForm() {
  $("#signForm").html('<label>'+$.i18n.prop('form_username',localStorage.getItem("lang"))+'<input type="text" class="text form_required" name="username" placeholder="MrAmazing'+
            '" required title="'+$.i18n.prop('form_valid_username',localStorage.getItem("lang"))+'"></label>'+
				    '<label>'+$.i18n.prop('form_firstname',localStorage.getItem("lang"))+'<input type="text" class="text form_required" name="firstname"  placeholder="John'+
            '" pattern="[a-zA-Z]{1,16}" required title="'+$.i18n.prop('form_valid_name',localStorage.getItem("lang"))+'"></label>'+
            '<label>'+$.i18n.prop('form_lastname',localStorage.getItem("lang"))+'<input type="text" class="text form_required" name="lastname"  placeholder="Doe'+
            '" pattern="[a-zA-Z]{1,16}" required title="'+$.i18n.prop('form_valid_name',localStorage.getItem("lang"))+'"></label>'+
            '<label>'+$.i18n.prop('form_birthday',localStorage.getItem("lang"))+'<input type="date" class="form-style form_required" name="birthday" min="1900-01-01" '+
            'max="'+ new Date().toJSON().split('T')[0] +'" required placeholder="(YYYY-MM-DD)"></label>'+
            '<label>'+$.i18n.prop('form_email',localStorage.getItem("lang"))+'<input type="email" class="text form_required" name="email"  placeholder="user@example.com'+
            '" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" required title="'+$.i18n.prop('form_valid_email',localStorage.getItem("lang"))+'"></label>'+
            '<label>'+$.i18n.prop('form_password',localStorage.getItem("lang"))+'<input type="password" class="text" name="password"'+
            '" pattern="(?=.*\\d).{6,}" required title="'+$.i18n.prop('form_valid_password',localStorage.getItem("lang"))+'" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"></label>'+
            '<label>'+$.i18n.prop('form_confirm',localStorage.getItem("lang"))+'<input type="password" class="text form_required" name="confirm"'+
            '" required title="'+$.i18n.prop('form_confim_password',localStorage.getItem("lang"))+'" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"></label>'+
				    '<input type="submit" class="more_btn" name="submit" value="'+$.i18n.prop('navbar_signup',localStorage.getItem("lang"))+' "><p id="errorMsg"></p>');
  $('.form_required').attr('oninvalid','this.setCustomValidity("'+$.i18n.prop('form_required',localStorage.getItem("lang"))+'")');
  $('.form_required').attr('onchange','this.setCustomValidity("")');

}
function signInForm() {
  if(signedIn) {
    $('.signIn').removeAttr('data-toggle');
    $.get('/rest/user/logout', function(){
      location.reload();
    });
  } else {
    $("#signForm").html('<input type="text" class="text form_required" name="username" placeholder='+$.i18n.prop('form_username',localStorage.getItem("lang"))+' required title="'+
            $.i18n.prop('form_user_username',localStorage.getItem("lang"))+'">'+
            '<input type="password" class="text form_required" name="password" placeholder='+$.i18n.prop('form_password',localStorage.getItem("lang"))+' required title="'+
            $.i18n.prop('form_user_password',localStorage.getItem("lang"))+'">'+
            '<input type="submit" class="more_btn" name="submit" value="'+$.i18n.prop('navbar_signin',localStorage.getItem("lang"))+'"><p id="errorMsg"></p>');
    $('.form_required').attr('oninvalid','this.setCustomValidity("'+$.i18n.prop('form_required',localStorage.getItem("lang"))+'")');
    $('.form_required').attr('onchange','this.setCustomValidity("")');
  }
}

function isSignedIn() {
  updateLogoutButton();
  if (signedIn) {
    $('#prof').css('display','block');
    $('.signUp').html('');
    $('.signUp').css({"color": "white", "font-size": "20px",'padding-top':'16px', 'min-width':'95px', 'padding-right':'30px'});
  }
}

function updateLogoutButton(){
  if (signedIn) $('.signIn').text($.i18n.prop('navbar_logout',localStorage.getItem("lang")));
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

$('.navbar-toggle').click(function(){
  $('#loginModal').modal('hide');
 });
$('.sign-in').click(function(){
  if ($(window).width() < 1200){
    $('#navbar').collapse("hide");
  }
});
$( '#loginModal').on('hidden.bs.modal', function() {
    $("#errorMsg").css('padding-top','');
});

  $("#referral_form").submit(function(e) {
    e.preventDefault();
    $.post( "/rest/refer", $( "#referral_form" ).serialize(), function(result) {
      translate(result, function(translation){
        $("#referral_msg").animate({'padding-top': "20px",'padding-bottom': "10px"},300, function(){
            $('#referral_msg').hide().text(translation).fadeIn('slow');
        });
      });
    });
  });

  $( '#loginModal').on('hidden.bs.modal', function() {
    $("#referral_msg").empty();
    $("#referral_msg").css('padding-top','');
});