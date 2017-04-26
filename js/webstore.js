function generateTrades() {
    $('#shop_prizes').animate({
        'font-size': '0.5em'
    });
    $('#shop_trades').animate({
        'font-size': '1em'
    });
    $('#addProductButton').hide();
    displayAddProductButton(function (admin) {
        if (admin) {
            $('#trade_add_button').show();
            $('#trade_manage_button').show();
        }
    });
    generateItemView('/rest/trades/'+localStorage.getItem("lang"), function () {
        $('.amount_div').hide();
        $('.buy-button').click(function () {
            showConfirmButtons();
        });
        $('.no_btn').click(function () {
            hideConfirmButtons();
        });
        $('.yes_btn').click(function () {
            buyTrade($(this).data('id'));
            hideConfirmButtons();
        });
    });
}

function hideConfirmButtons() {
    $('.shop_confirm').fadeOut();
    $('.yes_btn').fadeOut();
    $('.no_btn').fadeOut(function () {
        $('.buy-button').fadeIn();
    });
}

function showConfirmButtons() {
    $('.buy-button').fadeOut(function () {
        $('.shop_confirm').fadeIn();
        $('.yes_btn').fadeIn();
        $('.no_btn').fadeIn();
    });
}

function generateProducts() {
    $('#shop_prizes').animate({
        'font-size': '1em'
    });
    $('#shop_trades').animate({
        'font-size': '0.5em'
    });
    $('#trade_add_button').hide();
    $('#trade_manage_button').hide();
    $('#managetrades').hide();
    displayAddProductButton(function (admin) {
        if (admin) $('#addProductButton').show();
    });
    generateItemView('/rest/products/'+localStorage.getItem("lang"), function () {
        $('.buy-button').click(function () {
            showConfirmButtons()
        });
        $('.no_btn').click(function () {
            hideConfirmButtons();
        });
        $('.yes_btn').click(function () {
            buyPrize($(this).data('id'));
            hideConfirmButtons();
        });
    });
}

function generateItemView(url, callback) {
    $('.infos').html('');
    $('.gallery-grid').html('');
    $.get(url, function (products) {
        $.each(products, function (i, product) {
            $('.infos').append('<div class="pop-up"><div id="small-dialog' + i + '" class="mfp-hide book-form"><div class="pop-up-content-agileits-w3layouts"><div class="col-md-6 w3ls-left">' +
                '<img src="' + product.image_url + '" alt=" " class="img-responsive zoom-img" /></div>' +
                '<div class="col-md-6 w3ls-right">' +
                '<h4 id="title' + i + '">' + product.name + '</h4>' +
                '<p id="description' + i + '">' + product.description + '</p>' +
                '<div class="span span1">' +
                '<p class="left product_name"></p>' + '<p id="name' + i + '" class="right">' + product.name + '</p>' +
                '<div class="clearfix"></div></div>' +
                '<div class="span span2">' + '<p class="left product_cost"></p><p class="right">' + product.price + '</p>' +
                '<div class="clearfix"></div></div>' +
                '<div class="span span3 amount_div">' + '<p class="left product_amount"></p><p class="right">' + product.amount + '</p>' +
                '<div class="clearfix"></div></div>' +
                '<div class="span span3"><p class="left shop_confirm">Are you sure?</p><button type="button" class="buy-button item_buttons"></button>'+
                '<button class="no_btn item_buttons">No</button><button class="yes_btn item_buttons" data-id="' + product.id + '">Yes</button>' +
                '<div class="clearfix"></div></div>' +
                '<div class="span buy_message"><p class="buyMessage" style="text-align:center;font-weight:bold;padding-bottom:0;"></p>' +
                '</div>' +
                '</div><div class="clearfix"></div></div></div></div>');
            $('.gallery-grids').append('<div class="gallery-grid">' +
                '<a class="book popup-with-zoom-anim button-isi zoomIn animated" data-wow-delay=".5s" href="#small-dialog' + i + '">' +
                '<img src="' + product.image_url + '" alt=" " style="max-height:340px;max-width:340px;" class="img-responsive zoom-img" /></a></div>');
            translate(product.description, function (translation) {
                $('#description' + i).text(translation);
            });
            translate(product.name, function (translation) {
                $('#name' + i).text(translation);
                $('#title' + i).text(translation);
            });
        });
        $('.product_name').text($.i18n.prop('shop_name', localStorage.getItem("lang")));
        $('.product_cost').text($.i18n.prop('shop_cost', localStorage.getItem("lang")));
        $('.product_amount').text($.i18n.prop('shop_stock', localStorage.getItem("lang")));
        $('.buy-button').text($.i18n.prop('shop_buy', localStorage.getItem("lang")));
        $('.shop_confirm').text($.i18n.prop('shop_confirm', localStorage.getItem("lang")));
        $('.yes_btn').text($.i18n.prop('shop_yes', localStorage.getItem("lang")));
        $('.no_btn').text($.i18n.prop('shop_no', localStorage.getItem("lang")));
        callback();
    }, 'json').then(function () {
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
                close: function () {
                    $('.buyMessage').html('');
                    hideConfirmButtons();
                }
            }
        });
    });
}

/**
 * An ajax call send when the user clicks "BUY" on the webstore's product pop-up window. Response text of the call
 * returns a string containing a message for the user to be displayed on the pop-up window.
 *
 * @param int product_id
 * @returns {string}
 */
function buyPrize(product_id) {
    $.post('/rest/product/buy?product=' + product_id,
        function (message) {
            translate(message, function (translation) {
                $('.buyMessage').hide().text(translation).fadeIn();
            });
            updateCoins();
            generateProducts();
    });
}
