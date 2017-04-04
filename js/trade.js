/**
 * An ajax call to show all the products the user has.
 *
 * @returns
 */

$('#submitTradeForm').click(function () {
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

function getCollection() {
  $.ajax({
      url:'/rest/collection/'+userId,
      dataType: "json",
      success: function (response){
        console.log(response);
        },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus, errorThrown);
      }
  });
}

$('#formTradeName').focusout(function () {
  var productid = $('#formTradeName').val();
  console.log(productid);
  getProductInfo(productid, function(error, response) {
    console.log(error, response);
    if (response) {
      fillTradeForm(response);
    }
  });
});

function fillTradeForm(response) {
  console.log(response.price);
  $('#formTradeName').val(response.name);
  $('#formTradeProduct').val(response.id);
  $('#formTradeOrgcost').val(response.price);
  $('#formTradePrice').val(response.price);
  $('#formTradeOrgdesc').val(response.description);
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
