/**
 * Created by minttu on 19-Feb-17.
 */

var submitForm = document.getElementById("submitForm");
var addProductModal = document.getElementById("addProductModal");


/**
 * An ajax call to check if the ADD PRODUCT button is displayed on the webpage or not.
 *
 * @returns {boolean}
 */
window.onload = function displayAddProductButton() {
    $.ajax({
      url: "/rest/user/admin",
      type: "GET",
      dataType: 'json',
      headers:{'access_token':$.cookie('access_token')},
      success: function(data) {
        console.log(data);
        console.log("admin arvo on " + data.admin);
        if (data.admin == 1) $('#addProductButton').css('display','block');
        else $('#addProductButton').css('display','none');
    }});
}

/**
 * An ajax call to add a product to the webstore. The product information is send in the body of the call.
 * If success, the product adding modal is closed and the webstore webpage refreshed.
 *
 * @returns {boolean}
 */
submitForm.onclick = function(){

//function addProduct(){
    var ajaxRequest;
    var description = document.getElementById('formDescription').value;
    var name = document.getElementById('formName').value;
    var price = document.getElementById('formPrice').value;
    var image_url = document.getElementById("formImage_url").value;
    console.log("name " + name);

    if (checkName(name) && checkCost(price) && checkDescription(description)){

        var array = {"name": name, "price": price, "description": description, "image_url": image_url};
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
                //$('#addProductModal').hide();
                addProductModal.style.display = "none";
                window.location = '/shop';
            }
        };

        ajaxRequest.open("POST", "/rest/product", true);
        ajaxRequest.setRequestHeader("Content-Type","application/json");
        ajaxRequest.send(dataString);
    }
}

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
        $('.errormsg').html("Please write a message!");
        return false;
    }
}

/**
 * Checks if the name is given and is between 0-255 characters long.
 * @param String name
 * @returns {boolean}
 */
function checkName(name) {
    if (name.length > 0 && name.length < 255) {
        return true;
    }
    else {
        $('.errormsg').html("Please give a product name!");
        return false;
    }
}

/**
 * Checks if a price is given and is between 0-25 numbers long.
 * @param int price
 * @returns {boolean}
 */
function checkCost(price) {
    if (price.length > 0 && price.length < 25) {
        return true;
    }
    else {
        $('.errormsg').html("Please give the product's cost!");
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
function buy(product_id){

    $.ajax({url: '/rest/product/buy?product='+product_id,
      headers:{'access_token':$.cookie('access_token')},
      success: function (message) {
        $('.buyMessage').html(message);
        updateCoins();
      }
    });
}
