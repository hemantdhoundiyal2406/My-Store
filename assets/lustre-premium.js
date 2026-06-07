(function () {
  'use strict';

  const selectAll = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function initProductTabs(scope = document) {
    selectAll('[data-lustre-tabs]', scope).forEach((tabs) => {
      selectAll('[data-lustre-tab-button]', tabs).forEach((button) => {
        if (button.dataset.lustreReady) return;
        button.dataset.lustreReady = 'true';
        button.addEventListener('click', () => {
          selectAll('[data-lustre-tab-button]', tabs).forEach((item) => {
            const active = item === button;
            item.classList.toggle('is-active', active);
            item.setAttribute('aria-selected', active ? 'true' : 'false');
          });
          selectAll('[data-lustre-tab-panel]', tabs).forEach((panel) => {
            panel.classList.toggle('is-active', panel.dataset.lustreTabPanel === button.dataset.lustreTabButton);
          });
        });
      });
    });
  }

  function getMainProductButton() {
    return document.querySelector('.product__info-container .product-form__submit');
  }

  function getProductPrice() {
    return document.querySelector(
      '.product__info-container .price__container .price-item--sale, .product__info-container .price__container .price-item--regular'
    );
  }

  function syncStickyProduct() {
    const sticky = document.querySelector('[data-lustre-sticky-product]');
    if (!sticky) return;
    const stickyButton = sticky.querySelector('[data-lustre-sticky-add]');
    const stickyPrice = sticky.querySelector('[data-lustre-sticky-price]');
    const mainButton = getMainProductButton();
    const price = getProductPrice();

    if (mainButton && stickyButton) {
      stickyButton.disabled = mainButton.disabled;
      const text = mainButton.querySelector('span');
      if (text && text.textContent.trim()) stickyButton.textContent = text.textContent.trim();
    }
    if (price && stickyPrice) stickyPrice.textContent = price.textContent.trim();
  }

  function initStickyProduct() {
    const sticky = document.querySelector('[data-lustre-sticky-product]');
    if (!sticky) return;
    const stickyButton = sticky.querySelector('[data-lustre-sticky-add]');
    if (stickyButton) {
      stickyButton.addEventListener('click', () => {
        const mainButton = getMainProductButton();
        if (mainButton && !mainButton.disabled) mainButton.click();
      });
    }

    syncStickyProduct();
    const productInfo = document.querySelector('.product__info-container');
    if (productInfo && 'MutationObserver' in window) {
      const observer = new MutationObserver(syncStickyProduct);
      observer.observe(productInfo, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initProductTabs();
    initStickyProduct();
  });

  document.addEventListener('shopify:section:load', (event) => {
    initProductTabs(event.target);
    syncStickyProduct();
  });
})();
