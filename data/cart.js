export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart'));

  if (!cart) {
    cart = [{
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
      deliveryOptionId: '1'
    }, {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      deliveryOptionId: '2'
    }
    ];
  }
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

let timeoutId;

export function addToCart(productId) {
  // Get the quantity input element for this product and convert its value to a number,
  // defaulting to 1 if the element doesn't exist
  const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
  const quantity = quantitySelector ? Number(quantitySelector.value) : 1;

  // Get the "added to cart" message element and add a CSS class to display it
  const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
  if (addedMessage) {
    addedMessage.classList.add('added-cart-message');
  }

  clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    addedMessage.innerHTML = '';
  }, 2000);

  let matchingItem;

  cart.forEach(cartItem => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      // productId: productId,
      productId,
      quantity,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach(cartItem => {
    if (cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = newQuantity;

  saveToStorage();
};

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach(cartItem => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}