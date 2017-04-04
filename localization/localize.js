loadLanguage();
function loadLanguage(page){
  if (!localStorage.getItem("lang") || localStorage.getItem("lang") == "undefined")
    localStorage.setItem("lang", 'en');

  switch (localStorage.getItem("lang")) {
    case 'fi':
      $("#curLang").html('<span class="flag-icon flag-icon-fi"></span> FI<span class="caret"></span>');
      break;
    case 'en':
      $("#curLang").html('<span class="flag-icon flag-icon-us"></span> EN<span class="caret"></span>');
      break;
    case 'ja':
      $("#curLang").html('<span class="flag-icon flag-icon-jp"></span> JP<span class="caret"></span>');
      break;
  }

  $.i18n.properties({
    name: 'PlayTalkWin',
    path: '/localization/',
    mode: 'both',
    async: true,
    cache: true,
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
      $("#shop_prizes").text(shop_prizes);
      $("#shop_giveinfo").text(shop_giveinfo);
      $("#shop_name").text(shop_name);
      $("#shop_cost").text(shop_cost);
      $("#shop_imageurl").text(shop_imageurl);
      $("#shop_product_desc").text(shop_product_desc);
      $("#shop_stock").text(shop_stock);
      $("#shop_amount").text(shop_amount);
      $("#submitForm").text(shop_add);
      $("#addProductButton").text(shop_addproducts);
      $("#shop_contact").text(shop_contact);
      $("#shop_phonenum").text(shop_phonenum);
      $("#shop_location").text(shop_location);
      $("#shop_livechat").text(shop_livechat);
      $("#shop_needcoins").text(shop_needcoins);
      $("#shop_desc1").text(shop_desc1);
      $("#shop_desc2").text(shop_desc2);
      //Profile
      $("#editprofilebuttontext").text(profile_edit);
      $("#editpicturebuttontext").text(profile_changepic);
      $("#mycollectionbuttontext").text(profile_collection);
      $("#profilehighscoretext").text(profile_highscore);
      $("#lastloggedintext").text(profile_lastlogged);
      $("#newuserstext").text(profile_newusers);
      $("#memebersincetext").text(profile_memebersince);
      $("#lastonlinetext").text(profile_lastlogged);
      $("#profile_collection").text(profile_collection);
      //Edit profile modal
      $("#editprofileheading").text(profile_edit);
      $("#editprofilefirstname").text(form_firstname);
      $("#editprofilelastname").text(form_lastname);
      $("#editprofiledescription").text(form_desc);
      $("#editprofilelocation").text(form_location);
      $("#saveprofilebutton").val(form_save);
      //Edit picture modal
      $("#editpictureheading").text(profile_changepic);
      $("#uploadpicturebutton").val(form_upload);
      //My friends modal
      $("#myfriendsheading").text(profile_friends);
      $("#friendstabtext").text(profile_friends);
      $("#friendrequeststabtext").text(profile_requests);
      $("#pendingfriendstabtext").text(profile_pending);
      //search
      $("#finduser").text(profile_find);

      if (typeof updateLogoutButton == 'function') updateLogoutButton();
      if (typeof generateProducts == 'function') generateProducts();
      if (typeof cookieMessage == 'function') cookieMessage();
    }
  });
}

function changeLanguage(lang){
  localStorage.setItem("lang", lang);
  loadLanguage();
  if(document.getElementById("chatwindow")) document.getElementById('chatwindow').contentWindow.location.reload();
  if(document.getElementById('game')) document.getElementById('game').contentWindow.loadLanguage();
  if (typeof getSession == 'function') getSession();
}

function translate(text,callback){
  $.get( "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl="+localStorage.getItem("lang")+"&dt=t&q="+ encodeURI(text), function( data ) {
    callback(JSON.parse(data.split(',,').join(',"",').split(',,').join(',"",'))[0][0][0]);
  },'text');
}

function localizeDateTime(dateTime) {
  // Adjust to user's timezone
  var t = dateTime.split(/[- :]/);
  var dateTimeUTC = Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
  dateTime = new Date(dateTimeUTC-new Date().getTimezoneOffset()*60000).toISOString().substring(0, 19).replace('T', ' ');
  // Time
  var time = dateTime.split(" ")[1].split(':');
  var hours = Number(time[0]);
  var minutes = Number(time[1]);
  var seconds = Number(time[2]);
  // Date
  var date = dateTime.split(" ")[0].split("-");
  var day = Number(date[2]);
  var month = Number(date[1]);
  var year = Number(date[0]);
  // Format time and date
	switch(localStorage.getItem("lang")) {
    case 'en':
        date = month+'/'+day+'/'+ year;
        if (hours > 0 && hours <= 12)
          time= "" + hours;
        else if (hours > 12)
          time= "" + (hours - 12);
        else if (hours == 0)
          time= "12";
        time += (minutes < 10) ? ":0" + minutes : ":" + minutes;
        time += (seconds < 10) ? ":0" + seconds : ":" + seconds;
        time += (hours >= 12) ? " P.M." : " A.M.";
        break;
    case 'fi':
        date = day+'.'+month+'.'+year;
        time = time[0]+':'+time[1]+':'+time[2];
        break;
    case 'ja':
     		date = new Date(dateTimeUTC).toLocaleDateString('ja-JP-u-ca-japanese').substring(0, 4)+'年'+month+'月'+day+'日';
        time = hours+'時'+minutes+'分'+seconds+'秒';
        break;
    default:
        return dateTime;
	}
  return date + '\xa0\xa0' + time;
}
