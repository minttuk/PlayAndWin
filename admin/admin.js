// General

function showElement(elementname) {
  $(elementname).css('display', 'block');
}

function hideElement(elementname) {
  $(elementname).css('display', 'none');
}

// Navigation
var lang;

$('#admin-manage-products-nav').click(function() {
  hideElement('.admin_addtranslationarea');
  showElement('#admin-manage-products');
});

$('.admin-trasnlate-products-nav').click(function() {
  hideElement('#admin-manage-products');
  lang = $(this).data('lang');
  $('#admin-translate-form-heading').text('Translate [' + lang + ']');
  showElement('.admin_addtranslationarea');
  showTranslations();
});


// Manage products

$('#admin_addproductbtn').click(function() {
  showElement('.admin_addproductarea');
});

$('#admin_addproductcancelbtn').click(function() {
  clearAddproductForm();
  hideElement('.admin_addproductarea');
});

function initHandlersForDynamicElements() {
  $('.admin_editproductbtn').unbind();
  $('.admin_editproductbtn').click(function () {
    prefillAddproductForm($(this).data('productid'));
    showElement('.admin_addproductarea');
    $('.admin_mainarea').animate({ scrollTop: 0 }, "fast");
  });
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
        hideElement('.admin_addproductarea');
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

// Translate products

function showTranslations() {
  $('#admin-translation-table').html('');
  $('#admin-missing-translation-table').html('');
  getProductTranslations(function(error, response) {
    if (response) {
      generateTableHeadings();
      var first = true;
      var havemissing = false;
      for (i in response) {
        if (response[i].trans_name == null || response[i].trans_description == null) {
          havemissing = true;
          appendToTranslationMissing(response[i]);
          if (first) {
            prefillTranslationForm(response[i]);
            first = false;
          }
        }
        else {
          appendToTranslations(response[i]);
        }
      }
      initTranslateHandlers();
      if (!havemissing) {
        clearTranslationForm();
        $('#admin-translation-form').css('display', 'none');
      }
    }
  });
}

function generateTableHeadings() {
  var translationheadings = $('<tr><th>Name</th><th>Description</th><th>Name [' + lang + ']</th><th>Description [' + lang + ']</th><th>Translate</th></tr>');
  $('#admin-missing-translation-table').append(translationheadings);
  var translationheadings = $('<tr><th>Name</th><th>Description</th><th>Name [' + lang + ']</th><th>Description [' + lang + ']</th><th>Edit</th></tr>');
  $('#admin-translation-table').append(translationheadings);
}

function prefillTranslationForm(response) {
  clearTranslationForm();
  $('#original-name').val(response.name);
  $('#original-name').attr('data-id', response.id);
  $('#original-description').val(response.description);
  if (response.trans_name) {
    $('#trans-name-form').val(response.trans_name);
  }
  if (response.trans_description) {
    $('#trans-description-form  ').val(response.trans_description);
  }
  $('#admin-translation-form').css('display', 'block');
}

function clearTranslationForm() {
  $('#original-name').val('');
  $('#original-name').attr('');
  $('#original-description').val('');
  //$('#original-description').text('');
  $('#trans-name-form').val('');
  $('#trans-description-form').val('');
  //$('#trans-description-form').text('');
  $('.errormsg').html('');
}

function appendToTranslationMissing(response) {
  var row = $('<tr></tr>');
  if (i % 2 != 0) {
    row.attr('class', 'greyrow');
  }
  var tablerow = $('<td>' + response.name + '</td> ' +
  '<td>' + response.description + '</td><td>' + response.trans_name + '</td>' +
  '<td>' + response.trans_description + '</td> ' +
  '<td><button type="button" data-productid="' + response.id +'" class="btn btn-primary admin_translateproductbtn">Translate</button></td>');
  row.append(tablerow);
  $('#admin-missing-translation-table').append(row);
}

function appendToTranslations(response) {
  var row = $('<tr></tr>');
  if (i % 2 != 0) {
    row.attr('class', 'greyrow');
  }
  var tablerow = $('<td>' + response.name + '</td>' +
  '<td>' + response.description + '</td>' +
  '<td>' + response.trans_name + '</td>' +
  '<td>' + response.trans_description + '</td>' +
  '<td><button type="button" data-productid="' + response.id +'" class="btn btn-primary admin_translateproductbtn">Edit</button></td>');
  row.append(tablerow);
  $('#admin-translation-table').append(row);
}

function getProductTranslations(callback) {
  $.ajax({
      url:'/rest/translations/' + lang,
      contentType: "application/json",
      success: function (response){
        callback(null, response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        callback(errorThrown, null);
      }
  });
}

function getProductTranslationById(id, callback) {
  $.ajax({
      url:'/rest/translation/' + lang + '/' + id,
      contentType: "application/json",
      success: function (response){
        callback(null, response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        callback(errorThrown, null);
      }
  });
}

function updateTranslation(translation, callback) {
  $.ajax({
      url:'/rest/translation/',
      type: 'PUT',
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(translation),
      success: function (response){
        callback(null, response);
        showTranslations();
      },
      error: function(jqXHR, textStatus, errorThrown) {
        callback(errorThrown, null);
      }
  });
}

function initTranslateHandlers() {
  $('.admin_translateproductbtn').unbind();
  $('.admin_translateproductbtn').click(function() {
    showElement('#admin-translation-form');
    $('.admin_addtranslationarea').animate({ scrollTop: 0 }, "fast");
    translateButtonClicked($(this).attr('data-productid'));
    console.log('click');
  });
}

function translateButtonClicked(id) {
  getProductTranslationById(id, function(error, response) {
    if (response) {
      prefillTranslationForm(response);
    }
  });
}

$('#admin-cancel-translation-btn').click(function() {
  hideElement('#admin-translation-form');
});

$('#admin-save-translation-btn').click(function() {
  saveTranslationButtonClicked();
});

function saveTranslationButtonClicked() {
  if (checkName($('#trans-name-form').val()) && checkDescription($('#trans-description-form').val())) {
    var translation = {"id": $('#original-name').attr('data-id'), "lang": lang, "name": $('#trans-name-form').val(),"description": $('#trans-description-form').val()};
    console.log(translation);
    updateTranslation(translation, function(error, response) {
      console.log(error, response);
    });
  }
}
