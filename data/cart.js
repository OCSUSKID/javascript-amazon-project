export const cart = [];

export function addToCart(productId) {
  const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
  const quantity = Number(quantitySelector.value);

  const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
  addedMessage.classList.add('added-cart-message');

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
      quantity
    });
  }
}