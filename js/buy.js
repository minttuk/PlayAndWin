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

    $.ajax({url: '/Backend/php/controller.php?q=buyProduct&product='+product_id,
      success: function (message) {
        $('.buyMessage').html(message);
        updateCoins();
      }
    });
}
