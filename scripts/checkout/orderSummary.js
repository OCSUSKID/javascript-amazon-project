import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { hello } from "https://unpkg.com/supersimpledev@1.0.1/hello.esm.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {

  let cartSummaryHtml = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    //console.log(matchingProduct);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(
      deliveryOption.deliveryDays,
      'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM, D'
    );

    cartSummaryHtml += `
      <div class="cart-item-container 
        js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                <!--gave them a unique class name-->
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <!--gave them a unique class name-->
              <input class="quantity-input js-quantity-input-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
              <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id=${matchingProduct.id}>
                Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays,
        'days'
      );
      const dateString = deliveryDate.format(
        'dddd, MMMM, D'
      );
      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`
      
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId; 

      html += ` 
        <div class="delivery-option js-delivery-option"
          data-product-id="${matchingProduct.id}"
          data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'Checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `
    })

    return html
  }

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHtml;

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const { productId } = link.dataset;
        removeFromCart(productId);

        renderOrderSummary();

        updateCartQuantity();

        renderPaymentSummary();
      });
    });

  function updateCartQuantity() {
    document.querySelector('.js-return-to-home-link')
      .innerHTML = `${calculateCartQuantity()} items`;
  }

  updateCartQuantity();

  document.querySelectorAll('.js-update-quantity-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const { productId } = link.dataset;

        const container = document
          .querySelector(`.js-cart-item-container-${productId}`);
        container.classList.add('is-editing-quantity');

        // focus and prefill the quantity input for keyboard entry
        const quantityInput = container.querySelector(`.js-quantity-input-${productId}`);
        const quantityLabel = container.querySelector(`.js-quantity-label-${productId}`);
        if (quantityInput) {
          // prefill with current quantity and focus so Enter can be used
          quantityInput.value = quantityLabel ? quantityLabel.innerText.trim() : '';
          quantityInput.focus();
          quantityInput.select && quantityInput.select();
        }
      });
    });


  document.querySelectorAll('.js-save-quantity-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const { productId } = link.dataset;
        handleSave(productId);
      });
    });

  // Reusable save handler so clicks and keyboard Enter trigger same behavior
  function handleSave(productId) {
    const container = document
      .querySelector(`.js-cart-item-container-${productId}`);
    if (!container) return;
    container.classList.remove('is-editing-quantity');

    // get the new quantity from the input field
    const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
    const newQuantity = Number(quantityInput && quantityInput.value);

    if (newQuantity > 0 && newQuantity < 1000) {
      // display the new quantity in the label
      const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
      if (quantityLabel) quantityLabel.innerHTML = newQuantity;

      // update the quantity in the cart data
      updateQuantity(productId, newQuantity);

      // update the quantity in the cart summary
      document.querySelector('.js-return-to-home-link')
        .innerHTML = `${calculateCartQuantity()} items`;
    } else {
      alert('Quantity can not be less than 0 and greater than 1000');
    }
  }

  // Add keyboard support: press Enter in the quantity input to save
  document.querySelectorAll('.quantity-input')
  .forEach((input) => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const { productId } = input.dataset;
          handleSave(productId);
        }
      });
    });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
