$('#admin_addproductbtn').click(function () {
  toggleProductForm();
});

$('#admin_addproductcancelbtn').click(function () {
  toggleProductForm();
});

$('#admin_editproductbtn').click(function () {
  toggleProductForm();
});

$('#admin_addproductsavebtn').click(function () {
  console.log("moi");
  clearErrormsg();
  handleAddProductForm();
});

function toggleProductForm() {
  $('#admin_addproductbtn').toggle();
  $('.admin_addproductform').toggle();
}

function handleAddProductForm() {
  var product = {
    "name": $('#admin-product-name-input').val(),
    "price": $('#admin-product-price-input').val(),
    "description": $('#admin-product-description-textarea').val(),
    "image_url": $('#admin-product-image-input').val(),
    "amount": $('#admin-product-amount-input').val(),
    "id": $('#admin-product-name-input').data('addproduct-id')
  };
  console.log(product.name, product.image_url, product.price, product.amount, product.description, product.id);
  if(checkName(product.name) && checkPrice(product.price) && checkAmount(product.amount) && checkDescription(product.description)) {
    clearAddproductForm();
    if (product.id) {
      updateProduct(product);
    }
    else {
      addProduct(product, function(error, response) {
        console.log(error, response);
      });
    }
  }
}

function addProduct(product, callback) {
  console.log('add');
  $.ajax({
      url:'/rest/product',
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(product),
      success: function (response){
        callback(null, response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        callback(errorThrown, null);
      }
  });
}

function updateProduct(product, callback) {
  console.log('update');
}

function clearAddproductForm() {
  $('#admin-product-name-input').val('');
  $('#admin-product-image-input').val('');
  $('#admin-product-price-input').val('');
  $('#admin-product-amount-input').val('');
  $('#admin-product-description-textarea').val('');
  $('#admin-product-name-input').attr('data-addproduct-id', '');
}

function clearErrormsg() {
  $('.errormsg').html();
}


/**
 * To check if the description is not empty and is between 0-500 characters long.
 * @param String description
 * @returns {boolean}
 */
function checkDescription(description) {
    if (description.length > 0 && description.length < 500 && description.trim().length !== 0) {
        return true;
    } else {
        $('.errormsg').html('Please fill in the product description!');
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
    } else {
      $('.errormsg').html('Please fill in the product name!');
      return false;
    }
}

/**
 * Checks if a price is given and is between 0-25 numbers long.
 * @param int price
 * @returns {boolean}
 */
function checkPrice(price) {
    if (price.length > 0 && price.length < 25 && price != 0) {
      return true;
    } else {
      $('.errormsg').html('Please fill in the product price!');
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
    } else {
      $('.errormsg').html('Please fill in the product amount!');
      return false;
    }
}
