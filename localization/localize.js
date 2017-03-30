loadLanguage();
function loadLanguage(){
  if (!localStorage.getItem("lang"))
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
      $("#msg_games").text(msg_games);
      $(".msg_click2play").text(msg_click2play);
      $("#msg_starttoday").text(msg_starttoday);
      $("#msg_sponsors").text(msg_sponsors);
      $("#msg_createaccount").text(msg_createaccount);
      $("#msg_createaccount_text").text(msg_createaccount_text);
      $("#msg_playgames").text(msg_playgames);
      $("#msg_playgames_text").text(msg_playgames_text);
      $("#msg_refer").text(msg_refer);
      $("#msg_refer_text").text(msg_refer_text);
      $("#msg_spendcoins").text(msg_spendcoins);
      $("#msg_spendcoins_text").text(msg_spendcoins_text);
      $("#slider_challenge").text(slider_challenge);
      $("#slider_challenge_text").text(slider_challenge_text);
      $("#slider_buyprizes").text(slider_buyprizes);
      $("#slider_buyprizes_text").text(slider_buyprizes_text);
      $("#slider_playgames").text(slider_playgames);
      $("#slider_playgames_text").text(slider_playgames_text);
      $("#index_createaccount_btn").text(index_createaccount_btn);
      $("#index_playgame_btn").text(index_playgame_btn);
      $("#index_refer_btn").text(index_refer_btn);
      $("#index_shop_btn").text(index_shop_btn);
      $(".index_learnmore_btn").text(index_learnmore_btn);
      $("#navbar_home").text(navbar_home);
      $("#navbar_shop").text(navbar_shop);
      $("#navbar_profile").text(navbar_profile);
      $("#navbar_community").text(navbar_community);
      $("#navbar_signin").text(navbar_signin);
      $("#navbar_signup").text(navbar_signup);
      $("#navbar_logout").text(navbar_logout);
    }
  });
}

function changeLanguage(lang,page){
  localStorage.setItem("lang", lang);
  loadLanguage(page);
}
