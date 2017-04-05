/**
 * An ajax call to show all the products the user has.
 *
 * @returns
 */

$('#trade_submit_form').click(function () {
  console.log("submintjee");
  if (checkFilled($('#formTradeName').val()) && checkInt($('#formTradePrice').val()) && checkFilled($('#formTradePrice').val())) {
    $('#tradeformerrormsg').text("");
    console.log("kaikki true");
    addTrade(function (error, response) {
      console.log(error, response);
      if(response.hasOwnProperty('error')){
        $('#tradeformerrormsg').text(response.error);
      }
      if(response.hasOwnProperty('success')){
        $('#tradeformsuccessmsg').text(response.success);
        emptyTradeForm();
        getTradeManageInfo();
      }
    });
  }
  else {
    $('#tradeformerrormsg').text("Please make sure that you have chosen the product to sell and set a price for it. Do not use decimals.")
  }
});

function emptyTradeForm() {
  $('#formTradeName').val("");
  $('#formTradeProduct').val("");
  $('#formTradeOrgcost').val("");
  $('#formTradeOrgdesc').val("");
  $('#formTradePrice').val("");
  $('#formTradeDescription').val("")
}

function addTrade(callback) {
  var trade = {"product": $('#formTradeProduct').val(), "price": $('#formTradePrice').val(), "description": $('#formTradeDescription').val()};
  $.ajax({
      url:'/rest/trades/new',
      type: "post",
      dataType: "json",
      data: trade,
      success: function (response){
        console.log(response);
        callback(null, response);
        },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        callback(errorThrown, null);
      }
  });
}
// Search Stuff

function createCollection(){
  $('#user_collection').empty();
  $.getJSON("/rest/user/collection/", function(response){
    $.each(response, function(i, item) {
      $('#user_collection').append(
        '<div id="row'+i+'" class="collectionrow row" data-name="'+item.name+'">'+
        '<img class="item_img center-block" src="'+item.picture+'" />'+
        '<h4 class="item'+i+' item_name">'+item.name+'</h4>'+
        '<h5>'+$.i18n.prop('shop_cost',localStorage.getItem("lang")) + ": " + item.price+'</h5>'+
        '<h5>'+$.i18n.prop('shop_amount',localStorage.getItem("lang")) + ": " + item.amount+'</h5></div>'
      );
      translate(item.name,function(translation){
        $('.item'+i).text(translation);
      });
      $('#row'+i).data('item_info',item);
    });
    $('.collectionrow').click(function(){
      fillTradeForm($(this).data('item_info'));
      $('#user_collection').hide();
    });
  });
}

$("#formTradeName").keyup(function(e) {
    var query = $("#formTradeName").val().toLowerCase();
    $('.collectionrow').each(function(i) {
        if ($(this).attr('data-name').toLowerCase().startsWith(query)) $(this).show();
        else $(this).hide();
    });
});

$('#formTradeName').focus(function() {
    $('#user_collection').fadeIn();
});

$('#formTradeName').focusout(function () {
  var productid = $('#formTradeName').val();
  $('#user_collection').fadeOut();
});


function fillTradeForm(response) {
  $('#formTradeName').val(response.name);
  $('#formTradeProduct').val(response.id);
  $('#formTradeOrgcost').val(response.price);
  $('#formTradePrice').val(response.price);
  $('#formTradeOrgdesc').val(response.description);
  $('#tradeformerrormsg').text("");
  $('#tradeformsuccessmsg').text("");
}

function getProductInfo(productid, callback) {
  $.ajax({
      url:'/rest/products/'+productid,
      dataType: "json",
      success: function (response){
        callback(null, response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
        callback(errorThrown, null);
      }
  });
}

//Checks that parameter is int
function checkInt(val) {
  if (Math.floor(val) == val && $.isNumeric(val) && val != null) {
    return true;
  }
  return false;
}

//Checks that parameter is not null / empty
function checkFilled(val) {
  if (val != null && val != "") {
    return true;
  }
  return false;
}

$('#trade_manage_button').click(function () {
  $('#managetrades').toggle();
});

function getTradeManageInfo() {
  getTradeInfo(function(error, response) {
    console.log(error, response);
    showMyTrades("myopentradescontent", response['opentrades']);
    showMyTrades("mybuyinghistorycontent", response['buyinghistory']);
    showMyTrades("mysellinghistorycontent", response['sellinghistory']);
  });
}

function showMyTrades(div, response) {
  console.log(div, response);
  $div = $('#' + div + '');
  $div.empty();
  if (div === "myopentradescontent") {
    $div.html("<tr><th>Product</th><th>Price</th><th>Action</th></tr>");
  }
  else {
    $div.html("<tr><th>Product</th><th>Price</th><th>Time</th></tr>");
  }
  for (product in response) {
    var row = $('<tr></tr>');
    if (div === "myopentradescontent") {
      var content = $('<td>' + response[product].name + '</td><td>' + response[product].price + '</td><td>Edit Button, Delete Button </td>')

    }
    else {
      var content = $('<td>' + response[product].name + '</td><td>' + response[product].price + '</td><td>' + response[product].time + '</td>');
    }
    row.append(content);
    $div.append(row);
  }
}

function getTradeInfo(callback) {
  //ajax
  $.ajax({
      url:'/rest/trades/history',
      dataType: "json",
      success: function (response){
        callback(null, response);
        },
      error: function(jqXHR, textStatus, errorThrown) {
        callback(errorThrown, null);
      }
  });
}

$( document ).ready(function() {
    getTradeManageInfo();
});
