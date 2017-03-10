/**
 * Created by minttu on 22-Feb-17.
 */

/**
 * An ajax call send when the user clicks "BUY" on the webstore's product pop-up window. Response text of the call
 * returns a JSON array containing a message for the user to be displayed on the pop-up window.
 *
 * @param int product_id
 * @returns {boolean}
 */
function buy(product_id){
    var ajaxRequest;
    console.log("product id = " + product_id);
    var array = {"product_id": product_id};
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
            var object = JSON.parse(text);
            $('.buyMessage').html(object['message']);
            //window.location = 'webstore.html';
        }
    };

    ajaxRequest.open("POST", "../Backend/php/controller.php?q=buyProduct", true);
    ajaxRequest.send(dataString);


}