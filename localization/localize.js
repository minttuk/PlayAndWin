loadLanguage();
function loadLanguage(){
  if (!localStorage.getItem("lang") || localStorage.getItem("lang") == "undefined")
    localStorage.setItem("lang", 'us');

  switch (localStorage.getItem("lang")) {
    case 'fi':
      $("#curLang").html('<span class="flag-icon flag-icon-fi"></span> FI<span class="caret"></span>');
      break;
    case 'us':
      $("#curLang").html('<span class="flag-icon flag-icon-us"></span> EN<span class="caret"></span>');
      break;
    case 'jp':
      $("#curLang").html('<span class="flag-icon flag-icon-jp"></span> JP<span class="caret"></span>');
      break;
  }

  $.i18n.properties({
    name: 'PlayTalkWin',
    path: '/localization/',
    mode: 'both',
    language: localStorage.getItem("lang"),
    callback: function() {
      // Frontpage
      $("#fp_games").text(fp_games);
      $(".fp_click2play").text(fp_click2play);
      $("#fp_starttoday").text(fp_starttoday);
      $("#fp_sponsors").text(fp_sponsors);
      $("#fp_createaccount").text(fp_createaccount);
      $("#fp_createaccount_text").text(fp_createaccount_text);
      $("#fp_playgames").text(fp_playgames);
      $("#fp_playgames_text").text(fp_playgames_text);
      $("#fp_refer").text(fp_refer);
      $("#fp_refer_text").text(fp_refer_text);
      $("#fp_spendcoins").text(fp_spendcoins);
      $("#fp_spendcoins_text").text(fp_spendcoins_text);
      $("#slider_challenge").text(slider_challenge);
      $("#slider_challenge_text").text(slider_challenge_text);
      $("#slider_buyprizes").text(slider_buyprizes);
      $("#slider_buyprizes_text").text(slider_buyprizes_text);
      $("#slider_playgames").text(slider_playgames);
      $("#slider_playgames_text").text(slider_playgames_text);
      $("#fp_createaccount_btn").text(fp_createaccount_btn);
      $("#fp_playgame_btn").text(fp_playgame_btn);
      $("#fp_refer_btn").text(fp_refer_btn);
      $("#fp_shop_btn").text(fp_shop_btn);
      $(".fp_learnmore_btn").text(fp_learnmore_btn);
      // Navbar
      $("#navbar_home").text(navbar_home);
      $("#navbar_shop").text(navbar_shop);
      $("#navbar_profile").text(navbar_profile);
      $("#navbar_community").text(navbar_community);
      $("#navbar_signin").text(navbar_signin);
      $("#navbar_signup").text(navbar_signup);
      $("#navbar_logout").text(navbar_logout);
      // Games
      $("#game_yourscore").text(game_yourscore);
      $("#game_yourhighscore").text(game_yourhighscore);
      $("#game_start").text(game_start);
      $("#snake_desc").text(snake_desc);
      $("#flappy_desc").text(flappy_desc);
      $("#reaction_desc").text(reaction_desc);
      $("#jumper_desc").text(jumper_desc);
      //Chat
      $("#chat_send").text(chat_send);
      $("#msgbox").attr('placeholder',chat_write);
      //Footer
      $("#footer_cc").text(footer_cc);
      $("#footer_design").text(footer_design);
      //Webstore
      $("#Prizes_heading").text(Prizes_heading);
      $("#addProductModalHeading").text(addProductModalHeading);
      $("#addProductModalName").text(addProductModalName);
      $("#addProductModalCost").text(addProductModalCost);
      $("#addProductModalImage").text(addProductModalImage);
      $("#addProductModalDescription").text(addProductModalDescription);
      $("#submitForm").text(submitForm);
      $("#addProductButton").text(addProductButton);
      $("#footerContact").text(footerContact);
      $("#footerNumber").text(footerNumber);
      $("#footerMiddleTitle").text(footerMiddleTitle);
      $("#footerDescription").text(footerDescription);
      $("#footerDescription2").text(footerDescription2);
      //Profile
      $("#editprofilebuttontext").text(editprofilebuttontext);
      $("#editpicturebuttontext").text(editpicturebuttontext);
      $("#mycollectionbuttontext").text(mycollectionbuttontext);
      $("#profilehighscoretext").text(profilehighscoretext);
      $("#lastloggedintext").text(lastloggedintext);
      $("#newuserstext").text(newuserstext);
      $("#memebersincetext").text(memebersincetext);
      $("#lastonlinetext").text(lastonlinetext);
      //Edit profile modal
      $("#editprofileheading").text(editprofileheading);
      $("#editprofilefirstname").text(editprofilefirstname);
      $("#editprofilelastname").text(editprofilelastname);
      $("#editprofiledescription").text(editprofiledescription);
      $("#editprofilelocation").text(editprofilelocation);
      $("#saveprofilebutton").val(saveprofilebutton);
      //Edit picture modal
      $("#editpictureheading").text(editpictureheading);
      $("#uploadpicturebutton").val(uploadpicturebutton);
      //My friends modal
      $("#myfriendsheading").text(myfriendsheading);
      $("#friendstabtext").text(friendstabtext);
      $("#friendrequeststabtext").text(friendrequeststabtext);
      $("#pendingfriendstabtext").text(pendingfriendstabtext);
      //search
      $("#finduser").text(finduser);

      if (typeof updateLogoutButton == 'function') updateLogoutButton();
    }
  });
}

function changeLanguage(lang,page){
  localStorage.setItem("lang", lang);
  loadLanguage(page);
  if(document.getElementById("chatwindow")) document.getElementById('chatwindow').contentWindow.location.reload();
  if(document.getElementById('game')) document.getElementById('game').contentWindow.loadLanguage();
}
