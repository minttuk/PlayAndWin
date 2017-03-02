/**
 * Created by minttu on 19-Feb-17.
 */

var submitForm = document.getElementById("submitForm");
var addProductModal = document.getElementById("addProductModal");
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
                window.location = 'webstore.html';
            }
        };

        //ajaxRequest.open("POST", "http://localhost:63342/PlayAndWin/Backend/php/model.php?q=addProduct", true);
        ajaxRequest.open("POST", "../Backend/php/model.php?q=addProduct", true);

        ajaxRequest.send(dataString);
    }
}
/* checkDescription() = To check that a description is given. */

function checkDescription(description) {
    if (description.length > 0 && description.length < 500 && description.trim().length !== 0) {
        return true;
    }
    else {
        $('.errormsg').html("Please write a message!");
        return false;
    }
}

/* checkName() = to check that a title is given */

function checkName(name) {
    if (name.length > 0 && name.length < 255) {
        return true;
    }
    else {
        $('.errormsg').html("Please give a product name!");
        return false;
    }
}

/* checkCost() = to check that a cost to the product is given */

function checkCost(price) {
    if (price.length > 0 && price.length < 25) {
        return true;
    }
    else {
        $('.errormsg').html("Please give the product's cost!");
        return false;
    }
}

