/**
 * Created by minttu on 22-Feb-17.
 */


function buy(product_id){
    var ajaxRequest;
    var user_id = "1"; //hardcoded for now.... to be changed when sessions or whatever is finished.. =)
    console.log("product id = " + product_id);

    var array = {"user_id": user_id, "product_id": product_id};
    var dataString = JSON.stringify(array);
    //console.log(dataString);

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
    //not finished yet... in progress...
    ajaxRequest.onreadystatechange = function(){
        if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
            var text = ajaxRequest.responseText;
            var object = JSON.parse(text);
            //console.log("response teksti on "+object['message']+" ja ending here"); //why oh why???
            $('.buyMessage').html(object['message']);
            //window.location = 'webstore.html';
        }
    };

    //ajaxRequest.open("POST", "http://localhost:63342/PlayAndWin/Backend/php/model.php?q=buyProduct", true);
    ajaxRequest.open("POST", "../Backend/php/model.php?q=buyProduct", true);
    ajaxRequest.send(dataString);


}