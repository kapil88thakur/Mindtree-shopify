/** Shopify CDN: Minification failed

Line 20:2 Transforming const to the configured target environment ("es5") is not supported yet
Line 26:4 Transforming let to the configured target environment ("es5") is not supported yet
Line 27:4 Transforming const to the configured target environment ("es5") is not supported yet
Line 28:4 Transforming const to the configured target environment ("es5") is not supported yet
Line 40:6 Transforming const to the configured target environment ("es5") is not supported yet
Line 41:6 Transforming const to the configured target environment ("es5") is not supported yet
Line 45:6 Transforming const to the configured target environment ("es5") is not supported yet

**/
// var Shopify = Shopify || {};
var theme = window.theme || {};
// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
theme.moneyFormat = `Rs. {{amount}}`;

theme.Currency = (function() {
  const moneyFormat = `Rs. {{amount}}`;

  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    let value = '';
    const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    const formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number === null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      const parts = number.split('.');
      const dollarsAmount = parts[0].replace(
        /(\d)(?=(\d\d\d)+(?!\d))/g,
        '$1' + thousands
      );
      const centsAmount = parts[1] ? decimal + parts[1] : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
      case 'amount_with_apostrophe_separator':
        value = formatWithDelimiters(cents, 2, "'");
        break;
    }
    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

var drawer = function () {
    if (!Element.prototype.closest) {
      if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
      }
      Element.prototype.closest = function (s) {
        var el = this;
        var ancestor = this;
        if (!document.documentElement.contains(el)) return null;
        do {
          if (ancestor.matches(s)) return ancestor;
          ancestor = ancestor.parentElement;
        } while (ancestor !== null);
        return null;
      };
    }
    var settings = {
      speedOpen: 50,
      speedClose: 350,
      activeClass: 'is-active',
      visibleClass: 'is-visible',
      selectorTarget: '[data-drawer-target]',
      selectorTrigger: '[data-drawer-trigger]',
      selectorClose: '[data-drawer-close]',
    };
    var toggleccessibility = function (event) {
      if (event.getAttribute('aria-expanded') === 'true') {
        event.setAttribute('aria-expanded', false);
      } else {
        event.setAttribute('aria-expanded', true);
      }
    };
    var openDrawer = function (trigger) {
      var target = document.getElementById(trigger.getAttribute('aria-controls'));
      target.classList.add(settings.activeClass);
      document.documentElement.style.overflow = 'hidden';
      toggleccessibility(trigger);
      setTimeout(function () {
        target.classList.add(settings.visibleClass);
      }, settings.speedOpen);
    };
    var closeDrawer = function (event) {
      var closestParent = event.closest(settings.selectorTarget),
        childrenTrigger = document.querySelector('[aria-controls="' + closestParent.id + '"');
      closestParent.classList.remove(settings.visibleClass);
      document.documentElement.style.overflow = '';
      toggleccessibility(childrenTrigger);
      setTimeout(function () {
        closestParent.classList.remove(settings.activeClass);
      }, settings.speedClose);
    };
    var clickHandler = function (event) { 
      var toggle = event.target,
        open = toggle.closest(settings.selectorTrigger),
        close = toggle.closest(settings.selectorClose);
      if (open) { openDrawer(open); }
      if (close) { closeDrawer(close); }
      if (open || close) { event.preventDefault(); }
    };
    var keydownHandler = function (event) {
      if (event.key === 'Escape' || event.keyCode === 27) {
        var drawers = document.querySelectorAll(settings.selectorTarget),
          i;
        for (i = 0; i < drawers.length; ++i) {
          if (drawers[i].classList.contains(settings.activeClass)) {
            closeDrawer(drawers[i]);
          }
        }
      }
    };
    document.addEventListener('click', clickHandler, false);
    document.addEventListener('keydown', keydownHandler, false);

    let addToCartForm = document.querySelector('[action="/cart/add"][id^="product-form-template--"]');
    addToCartForm.addEventListener("submit", (e, clickHandler) => {
      e.preventDefault();
      setTimeout( function() {
        getCart();
        document.querySelector(settings.selectorTrigger).click();
      }, 800);
    });

    $("html").on("click", function (event) {
        if (!$(event.target).closest(".cart_container").length && $(".cart_container").is(":visible")) {
            document.querySelector(settings.selectorClose).click();
        }
    });
};

drawer();
getCart();

function getCart() {
	$.ajax({
		url: '/cart.js',
		cache: false,
		dataType: 'json',
		success: function(data) {
			refreshCartNew(data);
        }
	});
}

function refreshCartNew(cart) {
	$(".cart_count").empty();
	$cartBtn = $(".cart_count");
	var value = $cartBtn.text() || '0';
	var cart_items_html = "<li></li>";
	var cart_discounts_html = "";
	var cart_action_html = "";
	var cart_savings_html = "";
	var $cart = $(".cart_content form");
	var discounted_price_total = 0;
	var total_savings = 0;
	$('body').append('<div style="display: none;" class="temp_cart_data">' + cart + '</div>');
	var dt = $('.temp_cart_data').find('.cart_content').html();
	$(".cart_content").html(dt);
	$('.temp_cart_data').remove();
	$cartBtn.text(value.replace(/[0-9]+/, cart.item_count));
	if (cart.item_count == 0) {
		$('.drcart_count').hide();
		$('.drcart_count').html();
	} else {
		if (cart.item_count == 1) {
			$('.drcart_count').html('(' + cart.item_count + ' Item)');
		} else {
			$('.drcart_count').html('(' + cart.item_count + ' Items)');
		}
		$('.drcart_count').show();
	}
	if (cart.item_count == 0) {
		$('.js-empty-cart__message').removeClass('hidden');
		$('.js-cart_content__form').addClass('hidden');
	} else {
		$('.js-empty-cart__message').addClass('hidden');
		$('.js-cart_content__form').removeClass('hidden');
		$.each(cart.items, function(index, item) {
			var itemDiscounts = item.discounts;
			var discountMessage = "";
			for (i = 0; i < itemDiscounts.length; i++) {
				var amount = theme.Currency.formatMoney(itemDiscounts[i].amount, $('body').data('money-format'));
				var title = itemDiscounts[i].title;
				discountMessage = '<p class="notification-discount meta"><strong>Discount:</strong> ' + title + ' (-<span class="money"> ' + amount + '</span>)</p>';
			}
			var line_id = index + 1;
			
			cart_items_html += '<li class="cart_item clearfix">';
			
			if (item.image) {
				cart_items_html += '<div class="cart_image">' + '<a href="' + item.url + '"><img src="' + item.image.replace(/(\.[^.]*)$/, "_compact$1").replace('http:', '') + '" alt="' + item.title + '" /></a>' + '</div>';
			}
			
			cart_items_html += '<span class="mcart_remove" onclick="removeItem(this)" data-line="' + line_id + '"><img src="https://cdn.shopify.com/s/files/1/0198/4521/8366/files/remove-icon.svg?9704"/></span><div class="cart_item__title"><div class="item_vars_info"><div class="item_title">' + item.product_title
			
            var propExist = false;var unit_type = '';
			
            if (item.properties) {
                $.each(item.properties, function(title, value) {
                    if (value) {
                        propExist = true;
                        cart_items_html += '<div class="line-item" data-name="'+title+'">' + value + '</div>';
                    }
                });
            }
            if (item.price > item.final_price) {
                cart_items_html += '</div>' + discountMessage + '</a>';
            } else {
                cart_items_html += '</div>'
            }
            if (item.options_with_values) {
                $.each(item.options_with_values, function(title, vars) {
                    if (vars) {
                        if (vars.value.indexOf('Default') == -1) { 
                            cart_items_html += '<div class="line-item"><b>'+ vars.name + '</b>:' + vars.value + '</div>';
                        }
                    }
                });
            }
            cart_items_html += '</div>';
            cart_items_html += '<div class="CartItem_Bottom_info"><div class="left product-quantity-box">' + '<span class="ss-icon product-minus js-change-quantity" data-func="minus"><span class="icon-minus"> - </span></span>' + '<input type="text" class="quantity" name="updates[]" id="updates_' + item.id + '" data-product-id="' + item.product_id + '" value="' + item.quantity + '" data-line-id="' + line_id + '" readonly />' + '<span class="ss-icon product-plus js-change-quantity" data-func="plus"><span class="icon-plus"> + </span></span>' + '</div>';
            cart_items_html += ' <div class="product-price-box"><strong class="right price">';
            $.ajax({
                dataType: "json",
                async: false,
                cache: false,
                url: "/products/" + item.handle + ".js",
                success: function(data) {
                    var variant_id = item.variant_id;
                    var variant = $.grep(data.variants, function(v) {
                        return v.id == variant_id;
                    });
                    if (variant[0] && variant[0].compare_at_price > item.price) {
                      discounted_price_total += item.price * item.quantity;
                      total_savings += variant[0].compare_at_price * item.quantity;
                    }
                }
            });
            if (item.price > item.final_price) {
                var itemPrice = theme.Currency.formatMoney(item.final_price, $('body').data('money-format')) + '</span><span class="money was_price">' + theme.Currency.formatMoney(item.price, $('body').data('money-format')) + '</span>';
                cart_items_html += '<span class="money">' + itemPrice + '</strong></div></div></a>';
            } else {
                var itemPrice = theme.Currency.formatMoney(item.price, $('body').data('money-format'));
                cart_items_html += '<span class="money">' + itemPrice + '</span></strong></div></div></a>';
            }
          	console.log('item=', item);
            if (!propExist) {
          		cart_items_html += '</div></li>';
            }
        });
		var cartDiscounts = cart.cart_level_discount_applications;
		var cartDiscountMessage = "";
		for (i = 0; i < cartDiscounts.length; i++) {
			var amount = theme.Currency.formatMoney(cartDiscounts[i].total_allocated_amount, $('body').data('money-format'));
			var title = cartDiscounts[i].title;
			cartDiscountMessage = '<p class="mm-counter price">' + title + ' (-<span class="money"> ' + amount + '</span>)</p>';
		}
		if (cart.cart_level_discount_applications.length > 0) {
			cart_discounts_html += '<span class="right">' + cartDiscountMessage + '</span><span>Discount</span>'
		}
		cart_action_html += '<span class="right"><span class="money">' + theme.Currency.formatMoney(cart.total_price, $('body').data('money-format')) + '</span></span>' + '<span>Order Subtotal</span>';
		if (total_savings > 0) {
			cart_savings_html = '<span class="right"><span class="money">' + theme.Currency.formatMoney(total_savings - discounted_price_total, $('body').data('money-format')) + '</span></span>' + '<span>Your Savings</span>';
		} else {
			cart_savings_html = "";
		}
	}
	$('.js-cart_items').html(cart_items_html);
	$('.js-cart_discounts').html(cart_discounts_html);
	$('.js-cart_subtotal').html(cart_action_html);
	$('.js-cart_savings').html(cart_savings_html);
}
var removeProduct = true;
function removeItem(item) {
    var line = $(item).data('line');
    data = {
      quantity: 0,
      line: line
    }
    $(item).parents('li.cart_item').addClass("animated fadeOutUp");
    jQuery.ajax({
      type: 'POST',
      url: '/cart/change.js',
      data: data,
      dataType: 'json',
      success: function(data) {
        getCart();
      }
    });
}

$(document).on("click",".js-change-quantity",function() { 
  var quantity = parseInt($(this).parents('.product-quantity-box').find('input').val());
  var line = $(this).parents('.product-quantity-box').find('input').data('line-id');
  if($(this).data('func') == 'minus'){
    quantity = quantity-1;
  }else if($(this).data('func') == 'plus'){
    quantity = quantity+1;
  }
  var data = {
    quantity: quantity,
    line: line
  }
  if(quantity == 0){
    $(this).parents('li.cart_item').addClass("animated fadeOutUp");
  }
  jQuery.ajax({
    type: 'POST',
    url: '/cart/change.js',
    data: data,
    dataType: 'json',
    success: function(data) {
      setTimeout(function() {
        getCart();
      }, 500);
    }
  });
});