$(document).ready(function() {
  $("#signForm").submit(function(e) {
    e.preventDefault();
    $.post( "../Backend/php/login.php", $( "#signForm" ).serialize(), function(data) {
      alert(data);
    });
  });
});
function signUpForm() {
  $("#signForm").html('');
  $("#signForm").append('<input type="text" class="text" name="Username" placeholder="Username" required="">'
				    +'<input type="text" class="text" name="Firstname" placeholder="First Name" required="">'
                    +'<input type="text" class="text" name="Lastname" placeholder="Last Name" required="">'
                    +'<input type="text" class="text" name="Email" placeholder="Email" required="">'
                    +'<input type="text" class="text" name="Password" placeholder="Password" required="">'
                    +'<input type="text" class="text" name="ConfirmPassword" placeholder="Confirm Password" required="">'
				    +'<input type="submit" class="more_btn" name="submit" value="Sign up">');
}
function signInForm() {
  $("#signForm").html('');
  $("#signForm").append('<input type="text" class="text" name="Username" placeholder="Username" required="">'
                    +'<input type="text" class="text" name="Password" placeholder="Password" required="">'
                    +'<input type="submit" class="more_btn" name="submit" value="Sign in">');
}
