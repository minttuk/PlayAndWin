var opentrades;

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
  $('#formTradeDescription').val("");
  $('#trade_edit_product_name').text("");
  $('#formNewTradePrice').val("");
  $('#formNewTradeDescription').val("");
}

/**
 * To buy a product from the traded products.
 * @param int trade_id
 */
function buyTrade(trade_id) {
    $.ajax({
       url: '/rest/trades/buy?trade=' + trade_id,
        success: function (message) {
            translate(message, function (translation) {
                $('.buyMessage').hide().text(translation).fadeIn();
            });
            updateCoins();
        }
    });
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
  $('#item_div').empty();
  $.getJSON("/rest/collection/"+localStorage.getItem("lang"), function(response){
    if (!response) return;
    $('#noitems').hide();
    $.each(response, function(i, item) {
      $('#item_div').append(
        '<div id="row'+i+'" class="collectionrow row item_row" data-name="'+item.name+'">'+
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
    $('.item_row').click(function(){
      fillTradeForm($(this).data('item_info'));
      $('#user_collection').hide();
    });
  });
}

$("#formTradeName").keyup(function(e) {
    var query = $("#formTradeName").val().toLowerCase();
    $('.item_row').each(function(i) {
        if ($(this).attr('data-name').toLowerCase().startsWith(query)) $(this).show();
        else $(this).hide();
    });
    if($('#item_div').children(':visible').length == 0) $('#noitems').show();
    else $('#noitems').hide();
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
    opentrades = response['opentrades']
    showMyTrades("myopentradescontent", opentrades);
    showMyTrades("mybuyinghistorycontent", response['buyinghistory']);
    showMyTrades("mysellinghistorycontent", response['sellinghistory']);
  });
}

function showMyTrades(div, response) {
  $div = $('#' + div);
  $div.empty();
  if (div === "myopentradescontent") {
    $div.html("<tr><th>" + $.i18n.prop('trade_product',localStorage.getItem("lang")) + "</th><th>" + $.i18n.prop('trade_price',localStorage.getItem("lang")) + "</th><th>" + $.i18n.prop('trade_action',localStorage.getItem("lang")) + "</th></tr>");
  }
  else {
    $div.html("<tr><th>" + $.i18n.prop('trade_product',localStorage.getItem("lang")) + "</th><th>" + $.i18n.prop('trade_price',localStorage.getItem("lang")) + "</th><th>" + $.i18n.prop('trade_time',localStorage.getItem("lang")) + "</th></tr>");
  }
  for (product in response) {
    var row = $('<tr></tr>');
    if (div === "myopentradescontent") {
      var content = $(
        '<td>' + response[product].name + '</td>' +
        '<td>' + response[product].price + '</td> ' +
        '<td><button type="button" data-tradeid="' + response[product].id +
        '" data-toggle="modal" data-target="#editTradeProductModal" class="btn btn-primary trade_edit_button">' + $.i18n.prop('trade_edit',localStorage.getItem("lang")) + '</button>' +
        '<button type="button" data-tradeid="' + response[product].id + '" class="btn btn-danger trade_delete_button">' + $.i18n.prop('trade_delete',localStorage.getItem("lang")) + '</button> </td>')
    }
    else {
      var content = $('<td>' + response[product].name + '</td><td>' + response[product].price + '</td><td>' + localizeDateTime(response[product].time) + '</td>');
    }
    row.append(content);
    $div.append(row);
  }
  resetButtonHandlers();
}

function resetButtonHandlers() {
  $(".trade_edit_button").off("click");
  $(".trade_delete_button").off("click");

  $(".trade_edit_button").click(function() {
    fillEditTradeForm($(this).attr("data-tradeid"));
  });

  $(".trade_delete_button").click(function() {
    var tradeid = $(this).attr("data-tradeid");
    deleteTrade(tradeid, function(error, response) {
      //console.log(error, response);
    });
  });
}

function fillEditTradeForm(tradeid) {
  var tradetoedit;
  for (i in opentrades) {
    if (opentrades[i].id == tradeid) {
      tradetoedit = opentrades[i];
    }
  }
  $('#trade_to_edit_id').val(tradetoedit.id);
  $('#trade_edit_product_name').text(tradetoedit.name);
  $('#formNewTradePrice').val(tradetoedit.price);
  $('#formNewTradeDescription').val(tradetoedit.description);
}

//check that price is not empty.
$('#trade_submit_edited_form').click(function(){
  if (checkInt($('#formNewTradePrice').val())) {
    var trade = {"id": $('#trade_to_edit_id').val(), "price": $('#formNewTradePrice').val(), "description": $('#formNewTradeDescription').val()};
    saveEditedForm(trade, function(error, response){
      if(response.hasOwnProperty('success')){
        getTradeManageInfo();
        console.log(response.success);
        $('#tradeformsuccessmsg').text(response.success);
      }
      if (response.hasOwnProperty('error')){
        $('#tradeformerrormsg').text(response.error);
      }
    });
  }
  else {
    $('#tradeformerrormsg').text("Please give a number for price!");
  }
});

function saveEditedForm(trade, callback) {
  $.ajax({
      type: "PUT",
      url: "/rest/trades",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(trade),
      success: function (response){
        callback(null, response);
        //console.log(response);
        },
      error: function(jqXHR, textStatus, errorThrown) {
        callback(errorThrown, null);
        //console.log(response);
      }
  });
}

function deleteTrade(tradeid, callback) {
  $.ajax({
      type: 'DELETE',
      url:'/rest/trades?' + $.param({"tradeid": tradeid}),
      dataType: "json",
      success: function (response){
        callback(null, response);
        getTradeManageInfo();
        },
      error: function(jqXHR, textStatus, errorThrown) {
        callback(errorThrown, null);
      }
  });
}

function getTradeInfo(callback) {
  //ajax
  $.ajax({
      url:'/rest/trades/history/'+localStorage.getItem("lang"),
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
