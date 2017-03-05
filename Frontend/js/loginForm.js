var signedIn = false;
isSignedIn();

$(document).ready(function() {
  $("#signForm").submit(function(e) {
    e.preventDefault();
    $.post( "../Backend/php/login.php", $( "#signForm" ).serialize(), function(data) {
      if(data!='success') {
        $("#signForm").append('<p>'+data+'</p>');

      } else location.reload();
    });
  });
});
function signUpForm() {
  $("#signForm").html('');
  $("#signForm").append('<input type="text" class="text" name="Username" placeholder="Username" required="">'
				    +'<input type="text" class="text" name="Firstname" placeholder="First Name" required="">'
            +'<input type="text" class="text" name="Lastname" placeholder="Last Name" required="">'
            +'<input type="text" class="text" name="Email" placeholder="Email" required="">'
            +'<input type="password" class="text" name="Password" placeholder="Password" required="">'
            +'<input type="text" class="text" name="ConfirmPassword" placeholder="Confirm Password" required="">'
				    +'<input type="submit" class="more_btn" name="submit" value="Sign up">');
}
function signInForm() {
  if(signedIn) {
    $.getJSON('../Backend/php/login.php?logout', function(result){
      $('.signIn').removeAttr('data-toggle');
      location.reload();
    });
  } else {
    $("#signForm").html('');
    $("#signForm").append('<input type="text" class="text" name="Username" placeholder="Username" required="">'
                      +'<input type="password" class="text" name="Password" placeholder="Password" required="">'
                      +'<input type="submit" class="more_btn" name="submit" value="Sign in">');
  }
}

function isSignedIn() {
  $.ajax({url: '../Backend/php/login.php', async: false,
    success: function (id) { if (id != -1) signedIn = true;}
  });
  if (signedIn) {
    $('.signUp').css('display','none');
    $('.signIn').html('Log out');
  }
}
