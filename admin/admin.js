$('#admin_addproductbtn').click(function () {
  showProductForm();
});

$('#admin_addproductcancelbtn').click(function () {
  clearAddproductForm();
  hideProductForm();
});

function initHandlersForDynamicElements() {
  $('.admin_editproductbtn').unbind();
  $('.admin_editproductbtn').click(function () {
    prefillAddproductForm($(this).data('productid'));
    showProductForm();
    $('.admin_mainarea').animate({ scrollTop: 0 }, "fast");
  });
}

function showProductForm() {
  $('.admin_addproductarea').css('display', 'block');
}

function hideProductForm() {
  $('.admin_addproductarea').css('display', 'none');
}

$('#admin_addproductsavebtn').click(function () {
  clearErrormsg();
  handleAddProductForm();
});

function handleAddProductForm() {
  var product = {
    "name": $('#admin-product-name-input').val(),
    "price": $('#admin-product-price-input').val(),
    "description": $('#admin-product-description-textarea').val(),
    "image_url": $('#admin-product-image-input').val(),
    "amount": $('#admin-product-amount-input').val(),
    "id": $('#admin-product-name-input').data('addproduct-id')
  };
  //console.log(product.name, product.image_url, product.price, product.amount, product.description, product.id);
  if(checkName(product.name) && checkPrice(product.price) && checkAmount(product.amount) && checkDescription(product.description)) {
    clearAddproductForm();
    if (product.id) {
      updateProduct(product, function(error, response) {
        hideProductForm();
        displayAllProducts();
      });
    }
    else {
      addProduct(product, function(error, response) {
        displayAllProducts();
      });
    }
  }
}

function addProduct(product, callback) {
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
  $.ajax({
      url:'/rest/product',
      type: "PUT",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(product),
      success: function (response){
        callback(null, response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        callback(errorThrown, null);
      }
  });
}

function displayAllProducts() {
  getAllProducts(function(error, response) {
    if (response) {
      fillProductsTable(response);
    }
  });
}

displayAllProducts();

function getAllProducts(callback) {
  $.ajax({
      url:'/rest/products',
      contentType: "application/json",
      success: function (response){
        callback(null, response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        callback(errorThrown, null);
      }
  });
}

function fillProductsTable(products) {
  var div = $('#admin-allproducts-table');
  div.html('');
  var headers = $(
    '<tr><th>Image</th><th>Name</th><th>Price</th><th>Description</th><th>Amount</th><th>Edit</th></tr>'
  );
  div.append(headers);
  for (i in products) {
    var row = $('<tr></tr>');
    if (i % 2 != 0) {
      row.attr('class', 'greyrow');
    }
    var content = $(
      '<td><img src="' + products[i].image_url + '" alt="product image" style="width:128px;"></td>' +
      '<td>' + products[i].name + '</td>' +
      '<td>' + products[i].price + '</td> ' +
      '<td>' + products[i].description + '</td> ' +
      '<td>' + products[i].amount + '</td> ' +
      '<td><button type="button" data-productid="' + products[i].id +
      '" class="btn btn-primary admin_editproductbtn">Edit</button>');
      row.append(content);
      div.append(row);
    }
    initHandlersForDynamicElements();
}

function prefillAddproductForm(id) {
  $('#admin-addproductform-heading').text('Edit Product');
  getProductById(id, function(error, response) {
    $('#admin-product-name-input').val(response.name);
    $('#admin-product-image-input').val(response.image_url);
    $('#admin-product-price-input').val(response.price);
    $('#admin-product-amount-input').val(response.amount);
    $('#admin-product-description-textarea').val(response.description);
    $('#admin-product-name-input').attr('data-addproduct-id', id);
  });
}

function getProductById(id, callback) {
  $.ajax({
      url:'/rest/product/' + id,
      contentType: "application/json",
      success: function (response){
        callback(null, response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        callback(errorThrown, null);
      }
  });
}

function clearAddproductForm() {
  $('#admin-product-name-input').val('');
  $('#admin-product-image-input').val('');
  $('#admin-product-price-input').val('');
  $('#admin-product-amount-input').val('');
  $('#admin-product-description-textarea').val('');
  $('#admin-product-name-input').attr('data-addproduct-id', '');
  $('#admin-addproductform-heading').text('Add Product');
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
