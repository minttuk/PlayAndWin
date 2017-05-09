// Navigation
var lang;

generateUserTable();
generateChatTable();

/**
 * Generates and appends the user table to the page html, as well as adds button click handlers
 */
function generateUserTable() {
  $.getJSON('/rest/users', function (data) {
    $.each(data, function (i, user) {
      var banned = user.banned == 0 ? 'Ban' : 'Unban';
      var btnClass = user.banned == 0 ? 'btn-warning' : 'btn-success';
      $('#admin-users-table').append(
        '<tr><td>' + user.username + '</td>' +
        '<td>' + user.firstname + ' ' + user.lastname + '</td>' +
        '<td>' + user.email + '</td> ' +
        '<td>' + user.coins + '</td> ' +
        '<td>' + user.last_online + '</td> ' +
        '<td><button type="button" data-userID="' + user.id +
        '" class="btn ' + btnClass + ' admin-ban-user">' + banned + '</button>' +
        '<button type="button" data-userid="' + user.id +
        '" class="btn btn-danger admin-delete-user">Delete</button></td></tr>');
    });
    $('.admin-ban-user').click(function () {
      $.ajax({
        type: "PUT",
        url: "/rest/user/ban/" + $(this).data('userid'),
        context: this,
        success: function (response) {
          $(this).text(response == 0 ? 'Ban' : 'Unban');
          $(this).toggleClass(response == 0 ? 'btn-success btn-warning' : 'btn-warning btn-success');
        }
      });
    });
    $('.admin-delete-user').click(function () {
      if (confirm('Are you sure you want to delete the user!\nAll the information associated with this account will be lost.')) {
        $.ajax({
          type: "DELETE",
          url: "/rest/user/" + $(this).data('userid'),
          context: this,
          success: function (response) {
            $(this).closest('tr').remove();
          }
        });
      }
    });
  });
}

/**
 * Generates and appends the chat table to the page html, as well as adds button click handlers
 */
function generateChatTable() {
  $.getJSON('/rest/chat', function (data) {
    $.each(data, function (i, msg) {
      $('#admin-chat-table').append(
        '<tr><td>' + msg.username + '</td>' +
        '<td>' + msg.msg + '</td>' +
        '<td>' + msg.ts + '</td> ' +
        '<td><button type="button" data-msgid="' + msg.id +
        '" class="btn btn-danger admin-delete-msg">Delete</button></tr>');
    });
    $('.admin-delete-msg').click(function () {
      $.ajax({
        type: "DELETE",
        url: "/rest/chat/" + $(this).data('msgid'),
        context: this,
        success: function (response) {
          $(this).closest('tr').remove();
        }
      });
    });
  });
}

/**
 * Shows the content of the active location and hides everything else
 *
 * @param {string} elem_id the id of the element to show
 */

function showWhichTabActive(elem_id) {
  $.each($('.admin_mainarea').children(), function () {
    elem_id == $(this).attr('id') ? $('#' + elem_id).show() : $(this).hide();
  });
}

/**
 * Shows bold the active location in nav bar and shows other text in lighter text
 *
 * @param {object} elem the element to change active
 */

function showActiveContent(elem) {
  $.each($('.admin_sidepanelcontent').find('li[class^=admin-manage],.dropdown-toggle'), function () {
    $(elem)[0] == $(this)[0] ? $(elem).addClass('active') : $(this).removeClass('active');
  });
}

$('.admin-manage-users-nav').click(function () {
  showActiveContent($(this));
  showWhichTabActive('admin-manage-users');
});

$('.admin-manage-chat-nav').click(function () {
  showActiveContent($(this));
  showWhichTabActive('admin-manage-chat');
});

$('.admin-manage-products-nav').click(function () {
  showActiveContent($(this));
  showWhichTabActive('admin-manage-products');
});

$('.admin-trasnlate-products-nav').click(function () {
  showActiveContent($(this).parent().parent().children(":first"));
  showWhichTabActive('admin_addtranslationarea');
  lang = $(this).data('lang');
  $('#admin-translate-form-heading').text('Translate [' + lang + ']');
  showTranslations();
});


// Manage products

$('#admin_addproductbtn').click(function () {
  $('.admin_addproductarea').show();
});

$('#admin_addproductcancelbtn').click(function () {
  clearAddproductForm();
  $('.admin_addproductarea').hide();
});

/**
 * Unbinds and sets new event handlers for elements after page has loaded
 */

function initHandlersForDynamicElements() {
  $('.admin_editproductbtn').unbind();
  $('.admin_editproductbtn').click(function () {
    prefillAddproductForm($(this).data('productid'));
    $('.admin_addproductarea').show();
    $('.admin_mainarea').animate({
      scrollTop: 0,
      scrollLeft: 0
    }, "fast");
  });
}

$('#admin_addproductsavebtn').click(function () {
  clearErrormsg();
  handleAddProductForm();
});

/**
 * Forms a product object from form data and checks that form was properly filled
 *
 */

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
  if (checkName(product.name) && checkPrice(product.price) && checkAmount(product.amount) && checkDescription(product.description)) {
    if (product.id) {
      updateProduct(product, function (error, response) {
        displayAllProducts();
      });
    } else {
      addProduct(product, function (error, response) {
        displayAllProducts();
      });
    }
    $('.admin_addproductarea').hide();
    clearAddproductForm();
  }
}

/**
 * Adds product to database
 *
 * @param {object} product Object with product information
 * @param {function} callback
 */

function addProduct(product, callback) {
  $.ajax({
    url: '/rest/product',
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(product),
    success: function (response) {
      callback(null, response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      callback(errorThrown, null);
    }
  });
}

/**
 * Updates product in database
 *
 * @param {object} product Object with product information
 * @param {function} callback
 */


function updateProduct(product, callback) {
  $.ajax({
    url: '/rest/product',
    type: "PUT",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(product),
    success: function (response) {
      callback(null, response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      callback(errorThrown, null);
    }
  });
}

/**
 * Displays all products on the site
 */


function displayAllProducts() {
  getAllProducts(function (error, response) {
    if (response && !response.error) {
      fillProductsTable(response);
    } else if (response.error) {
      window.location.replace("../");
    }
  });
}

displayAllProducts();

/**
 * Gets all product from database
 *
 * @param {function} callback
 */


function getAllProducts(callback) {
  $.ajax({
    url: '/rest/products',
    contentType: "application/json",
    success: function (response) {
      callback(null, response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      callback(errorThrown, null);
    }
  });
}

/**
 * Fills all products into a table
 *
 * @param {array} products Array of product objects
 */

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
    if ($(window).width() < 992) {
      $('.contentbox').css('margin', 0);
      $('.admin_managewebstore').css('width', $('#admin-allproducts-table').width() + 100);
      $('.admin_mainarea').scrollLeft(100);
    }
  }
  initHandlersForDynamicElements();
}

/**
 * Fills the old product information to the add product form when product is edited
 *
 * @param {number} id Product id
 */


function prefillAddproductForm(id) {
  $('#admin-addproductform-heading').text('Edit Product');
  getProductById(id, function (error, response) {
    $('#admin-product-name-input').val(response.name);
    $('#admin-product-image-input').val(response.image_url);
    $('#admin-product-price-input').val(response.price);
    $('#admin-product-amount-input').val(response.amount);
    $('#admin-product-description-textarea').val(response.description);
    $('#admin-product-name-input').attr('data-addproduct-id', id);
  });
}

/**
 * Gets product information by id from database
 *
 * @param {number} id product id
 * @param {function} callback
 */

function getProductById(id, callback) {
  $.ajax({
    url: '/rest/product/' + id,
    contentType: "application/json",
    success: function (response) {
      callback(null, response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      callback(errorThrown, null);
    }
  });
}

/**
 * Clears all the values from add product form
 *
 */

function clearAddproductForm() {
  $('#admin-product-name-input').val('');
  $('#admin-product-image-input').val('');
  $('#admin-product-price-input').val('');
  $('#admin-product-amount-input').val('');
  $('#admin-product-description-textarea').val('');
  $('#admin-product-name-input').attr('data-addproduct-id', '');
  $('#admin-addproductform-heading').text('Add Product');
}

/**
 * Clears error message on the form

 */

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

/**
 * Shows product translations on the site
 */

function showTranslations() {
  $('#admin-translation-table').html('');
  $('#admin-missing-translation-table').html('');
  getProductTranslations(function (error, response) {
    if (response && !response.error) {
      generateTableHeadings();
      var first = true;
      var havemissing = false;
      for (i in response) {
        if (response[i].trans_name == null || response[i].trans_description == null || response[i].edited == 1) {
          havemissing = true;
          appendToTranslationMissing(response[i]);
          if (first) {
            prefillTranslationForm(response[i]);
            first = false;
          }
        } else {
          appendToTranslations(response[i]);
        }
      }
      initTranslateHandlers();
      if (!havemissing) {
        clearTranslationForm();
        $('#admin-translation-form').css('display', 'none');
      }
    } else if (response.error) {
      window.location.replace("../");
    }
  });
}

/**
 * Generates headings to the tables
 */

function generateTableHeadings() {
  var translationheadings = $('<tr><th>Name</th><th>Description</th><th>Name [' + lang + ']</th><th>Description [' + lang + ']</th><th>Translate</th></tr>');
  $('#admin-missing-translation-table').append(translationheadings);
  var translationheadings = $('<tr><th>Name</th><th>Description</th><th>Name [' + lang + ']</th><th>Description [' + lang + ']</th><th>Edit</th></tr>');
  $('#admin-translation-table').append(translationheadings);
}

/**
 * Fills product information into translation from
 *
 * @param {object} response Object with product information
 */

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

/**
 * Clears values from translation form
 */

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

/**
 * Adds product row into translation missing table
 *
 * @param {object} response Object with product information
 */

function appendToTranslationMissing(response) {
  var row = $('<tr></tr>');
  if (i % 2 != 0) {
    row.attr('class', 'greyrow');
  }
  var tablerow = $('<td>' + response.name + '</td> ' +
    '<td>' + response.description + '</td><td>' + response.trans_name + '</td>' +
    '<td>' + response.trans_description + '</td> ' +
    '<td><button type="button" data-productid="' + response.id + '" class="btn btn-primary admin_translateproductbtn">Translate</button></td>');
  row.append(tablerow);
  $('#admin-missing-translation-table').append(row);
}

/**
 * Adds product row into translations table
 *
 * @param {object} response Object with product information
 */

function appendToTranslations(response) {
  var row = $('<tr></tr>');
  if (i % 2 != 0) {
    row.attr('class', 'greyrow');
  }
  var tablerow = $('<td>' + response.name + '</td>' +
    '<td>' + response.description + '</td>' +
    '<td>' + response.trans_name + '</td>' +
    '<td>' + response.trans_description + '</td>' +
    '<td><button type="button" data-productid="' + response.id + '" class="btn btn-primary admin_translateproductbtn">Edit</button></td>');
  row.append(tablerow);
  $('#admin-translation-table').append(row);
}

/**
 * Gets all product translations by language
 *
 * @param {function} callback
 */

function getProductTranslations(callback) {
  $.ajax({
    url: '/rest/translations/' + lang,
    contentType: "application/json",
    success: function (response) {
      callback(null, response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      callback(errorThrown, null);
    }
  });
}

/**
 * Gets a product translation by language and product id
 *
 * @param {number} id product id
 * @param {function} callback
 */

function getProductTranslationById(id, callback) {
  $.ajax({
    url: '/rest/translation/' + lang + '/' + id,
    contentType: "application/json",
    success: function (response) {
      callback(null, response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      callback(errorThrown, null);
    }
  });
}

/**
 * Updates product translation to database
 *
 * @param {object} translation object with product id and translation
 * @param {function} callback
 */

function updateTranslation(translation, callback) {
  $.ajax({
    url: '/rest/translation/',
    type: 'PUT',
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(translation),
    success: function (response) {
      callback(null, response);
      showTranslations();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      callback(errorThrown, null);
    }
  });
}

/**
 * Unbinds and sets even handlers to dynamically created elements
 */

function initTranslateHandlers() {
  $('.admin_translateproductbtn').unbind();
  $('.admin_translateproductbtn').click(function () {
    $('#admin-translation-form').show();
    $('.admin_mainarea').animate({
      scrollTop: 0,
      scrollLeft: 0
    }, "fast");
    translateButtonClicked($(this).attr('data-productid'));
    console.log('click');
  });
}

/**
 * Handles translate button click
 *
 * @param {number} id id of the product to translate
 */

function translateButtonClicked(id) {
  getProductTranslationById(id, function (error, response) {
    if (response && !response.error) {
      prefillTranslationForm(response);
    } else if (response.error) {
      window.location.replace("../");
    }
  });
}

$('#admin-cancel-translation-btn').click(function () {
  $('#admin-translation-form').hide();
});

$('#admin-save-translation-btn').click(function () {
  saveTranslationButtonClicked();
});

/**
 * Handles save button click
 */

function saveTranslationButtonClicked() {
  if (checkName($('#trans-name-form').val()) && checkDescription($('#trans-description-form').val())) {
    var translation = {
      "id": $('#original-name').attr('data-id'),
      "lang": lang,
      "name": $('#trans-name-form').val(),
      "description": $('#trans-description-form').val()
    };
    console.log(translation);
    updateTranslation(translation, function (error, response) {
      console.log(error, response);
    });
  }
}