var signedIn = false;
isSignedIn();

$(document).ready(function() {
  $("#signForm").submit(function(e) {
    e.preventDefault();
    $.post( "../Backend/php/login.php", $( "#signForm" ).serialize(), function(data) {
      if(data!='success') {
        $("#errorMsg").html('</br>'+data);

      } else location.reload();
    });
  });
});
function signUpForm() {
  $("#signForm").html('<input type="text" class="text" name="Username" placeholder="Username" required="">'
				    +'<input type="text" class="text" name="Firstname" placeholder="First Name"'
              +'pattern="[a-zA-Z]+" required="" title="Please enter a valid name.">'
            +'<input type="text" class="text" name="Lastname" placeholder="Last Name"'
            +'pattern="[a-zA-Z]+" required="" title="Please enter a valid name.">'
            +'<input type="email" class="text" name="Email" placeholder="Email"'
              +'pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" required="" title="Please enter a valid email.">'
            +'<input type="password" class="text" name="Password" placeholder="Password"'
            +'pattern="(?=.*\\d).{6,}" required="" title="Password must contain at least one number and at least 6 or more characters.">'
            +'<input type="password" class="text" name="ConfirmPassword" placeholder="Confirm Password" required="">'
				    +'<input type="submit" class="more_btn" name="submit" value="Sign up"><p id="errorMsg"></p>');
}
function signInForm() {
  if(signedIn) {
    $('.signIn').removeAttr('data-toggle');
    $.get('../Backend/php/login.php?logout', function(result){
      location.reload();
    });
  } else {
    $("#signForm").html('<input type="text" class="text" name="Username" placeholder="Username" required="">'
                      +'<input type="password" class="text" name="Password" placeholder="Password" required="">'
                      +'<input type="submit" class="more_btn" name="submit" value="Sign in">');
  }
}

function isSignedIn() {
  $.ajax({url: '../Backend/php/login.php', async: false,
    success: function (id) { if (id != -1) signedIn = true;}
  });
  if (signedIn) {
    $('#prof').css('display','block');
    $('.signUp').remove();
    $('.signIn').html('Log out');
  }
}
