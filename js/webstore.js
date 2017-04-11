
function generateTrades(){
	$('#shop_prizes').animate({'font-size': '0.5em'});
	$('#shop_trades').animate({'font-size': '1em'});
	$('#addProductButton').hide();
	displayAddProductButton(function(admin){
		if(admin) {
			$('#trade_add_button').show();
			$('#trade_manage_button').show();
		}
	});
	generateItemView('/rest/trades', function(){
		$('.amount_div').hide();
		$('.buy-button').click(function(){
			buyTrade($(this).data('id'));
		});
	});
}

function generateProducts(){
	$('#shop_prizes').animate({'font-size': '1em'});
	$('#shop_trades').animate({'font-size': '0.5em'});
	$('#trade_add_button').hide();
	$('#trade_manage_button').hide();
	$('#managetrades').hide();
	displayAddProductButton(function(admin){
		if(admin) $('#addProductButton').show();
	});
	generateItemView('/rest/products',function(){
		$('.buy-button').click(function(){
			buyPrize($(this).data('id'));
		});
	});
}

function generateItemView(url, callback) {
	$('.infos').html('');
  $('.gallery-grid').html('');
  $.get(url, function(products) {
    $.each(products, function(i, product) {
      $('.infos').append('<div class="pop-up"><div id="small-dialog' + i + '" class="mfp-hide book-form"><div class="pop-up-content-agileits-w3layouts"><div class="col-md-6 w3ls-left">' +
        '<img src="' + product.image_url + '" alt=" " class="img-responsive zoom-img" /></div>' +
        '<div class="col-md-6 w3ls-right">' +
        '<h4 id="title'+i+'">'+ product.name +'</h4>' +
        '<p id="description'+i+'">' + product.description + '</p>' +
        '<div class="span span1">' +
        '<p class="left product_name"></p>' + '<p id="name'+i+'" class="right">' + product.name + '</p>' +
        '<div class="clearfix"></div></div>' +
        '<div class="span span2">' + '<p class="left product_cost"></p><p class="right">' + product.price + '</p>' +
        '<div class="clearfix"></div></div>' +
        '<div class="span span3 amount_div">' + '<p class="left product_amount"></p><p class="right">' + product.amount + '</p>' +
        '<div class="clearfix"></div></div>' +
        '<div class="span span3"><button type="button" class="buy-button" data-id="'+ product.id +'">/button>' +
        '<div class="clearfix"></div></div>'+
        '<div class="span buy_message"><p class="buyMessage" style="text-align:center;font-weight:bold;padding-bottom:0;"></p>'  +
        '</div>' +
        '</div><div class="clearfix"></div></div></div></div>');
      $('.gallery-grids').append('<div class="gallery-grid">' +
        '<a class="book popup-with-zoom-anim button-isi zoomIn animated" data-wow-delay=".5s" href="#small-dialog' + i + '">' +
        '<img src="' + product.image_url + '" alt=" " style="max-height:340px;max-width:340px;" class="img-responsive zoom-img" /></a></div>');
        translate(product.description,function(translation){
          $('#description'+i).text(translation);
        });
        translate(product.name,function(translation){
          $('#name'+i).text(translation);
          $('#title'+i).text(translation);
        });
    });
    $('.product_name').text($.i18n.prop('shop_name', localStorage.getItem("lang")));
    $('.product_cost').text($.i18n.prop('shop_cost', localStorage.getItem("lang")));
    $('.product_amount').text($.i18n.prop('shop_stock', localStorage.getItem("lang")));
    $('.buy-button').text($.i18n.prop('shop_buy', localStorage.getItem("lang")));
    callback();
  }, 'json').then(function() {
    $('.popup-with-zoom-anim').magnificPopup({
      type: 'inline',
      fixedContentPos: false,
      fixedBgPos: true,
      overflowY: 'auto',
      closeBtnInside: true,
      preloader: false,
      midClick: true,
      removalDelay: 300,
      mainClass: 'my-mfp-zoom-in',
      callbacks: {
        close: function() {
          $('.buyMessage').html('');
        }
      }
    });
  });
}


/**
 * An ajax call to check if the ADD PRODUCT button is displayed on the webpage or not.
 *
 * @returns {boolean}
 */
function displayAddProductButton(callback) {
	  $.getJSON("/rest/user/admin", function(result){
				callback(result.admin == 1);
    });
}

/**
 * An ajax call to add a product to the webstore. The product information is send in the body of the call.
 * If success, the product adding modal is closed and the webstore webpage refreshed.
 *
 * @returns {boolean}
 */
$('#submitForm').click(function(){

//function addProduct(){
    var ajaxRequest;
    var description = document.getElementById('formDescription').value;
    var name = document.getElementById('formName').value;
    var price = document.getElementById('formPrice').value;
    var image_url = document.getElementById("formImage_url").value;
    var amount = document.getElementById("formAmount").value;
    console.log("name " + name);

    if (checkName(name) && checkCost(price) && checkAmount(amount) && checkDescription(description)){

        var array = {"name": name, "price": price, "description": description, "image_url": image_url, "amount": amount};
        var dataString = JSON.stringify(array);

        try{
            // Opera 8.0+, Firefox, Safari
            ajaxRequest = new XMLHttpRequest();
        } catch (e){
            // Internet Explorer Browsers
            try{
                ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try{
                    ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e){
                    // Something went wrong
                    alert("Your browser broke!");
                    return false;
                }
            }
        }

        ajaxRequest.onreadystatechange = function(){
            if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
                var text = ajaxRequest.responseText;
                console.log(text);
                $('#addProductModal').hide();
                window.location = '/shop';
            }
        };

        ajaxRequest.open("POST", "/rest/product", true);
        ajaxRequest.setRequestHeader("Content-Type","application/json");
        ajaxRequest.send(dataString);
    }
});

/**
 * To check if the description is not empty and is between 0-500 characters long.
 * @param String description
 * @returns {boolean}
 */
function checkDescription(description) {
    if (description.length > 0 && description.length < 500 && description.trim().length !== 0) {
        return true;
    }
    else {
        $('.errormsg').html($.i18n.prop('shop_form_valid_description',localStorage.getItem('lang')));
        return false;
    }
}

/**
 * Checks if the name is given and is between 0-255 characters long.
 * @param String name
 * @returns {boolean}
 */
function checkName(name) {
    if (name.length > 0 && name.length < 40 && name.trim().length !== 0) {
        return true;
    }
    else {
        $('.errormsg').html($.i18n.prop('shop_form_valid_name',localStorage.getItem('lang')));
        return false;
    }
}

/**
 * Checks if a price is given and is between 0-25 numbers long.
 * @param int price
 * @returns {boolean}
 */
function checkCost(price) {
    if (price.length > 0 && price.length < 25 && price!=0) {
        return true;
    }
    else {
        $('.errormsg').html($.i18n.prop('shop_form_valid_cost',localStorage.getItem('lang')));
        return false;
    }
}

/**
 * Checks if amount is given and is between 0-25 numbers long.
 * @param int amount
 * @returns {boolean}
 */
function checkAmount(amount) {
    if (amount.length > 0 && amount.length < 25) {
        return true;
    }
    else {
        $('.errormsg').html($.i18n.prop('shop_form_valid_amount',localStorage.getItem('lang')));
        return false;
    }
}

/**
 * An ajax call send when the user clicks "BUY" on the webstore's product pop-up window. Response text of the call
 * returns a JSON array containing a message for the user to be displayed on the pop-up window.
 *
 * @param int product_id
 * @returns {boolean}
 */
function buyPrize(product_id){
    $.ajax({url:'/rest/product/buy?product='+product_id,
      success: function (message) {
        translate(message,function(translation){
          $('.buyMessage').hide().text(translation).fadeIn();
        });
        updateCoins();
    }});
}
