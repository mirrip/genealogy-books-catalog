(() => {
  'use strict';

  const page = document.body.dataset.savedPage;
  const bookPagePaths = [
    'elitnaya-rodoslovnaya-kniga', 'elitnaya-s-tisneniem', 'izyskannaya-v-opletke-s-zolotym-drevom',
    'izyskannaya-v-opletke', 'izyskannaya', 'izyskannaya-troyka', 'izyskannaya-letopisets',
    'izyskannaya-blagoslovenie', 'semejnyj-albom', 'hudozhestvennaya-bordovaya-s-gerbom',
    'hudozhestvennaya-bordovaya-s-drevom', 'hudozhestvennaya-chernaya-s-gerbom',
    'hudozhestvennaya-sinyaya-s-gerbom', 'hudozhestvennaya-svadebnaya-s-drevom',
    'hudozhestvennaya-zelenaya-s-mechetyu', 'hudozhestvennaya-musulmanskaya',
    'hudozhestvennaya-na-anglijskom', 'izyskannaya-na-anglijskom', 'izyskannaya-eko-kozha',
    'podarochnyj-paket'
  ];

  const $ = selector => document.querySelector(selector);
  const readList = key => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  };
  const saveList = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
  const formatPrice = value => `${Number(value || 0).toLocaleString('ru-RU')} ₽`;
  const getBookPageUrl = id => {
    const slug = bookPagePaths[Number(id) - 1];
    return slug ? `./books/${slug}.html` : './catalog.html';
  };
  const plural = (number, forms) => forms[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? number % 10 : 5]];

  let cart = readList('cart');
  let favorites = readList('favorites');
  let modalBookId = null;
  let toastTimer = null;

  function updateBadges() {
    const cartCount = cart.reduce((sum, item) => sum + Math.max(1, Number(item.quantity) || 1), 0);
    const badges = {
      '#cartIconBadge': cartCount,
      '#cartBadge': cartCount,
      '#favoritesBadge': favorites.length
    };
    Object.entries(badges).forEach(([selector, count]) => {
      const badge = $(selector);
      if (!badge) return;
      badge.textContent = String(count);
      badge.classList.toggle('hidden', count === 0);
    });
  }

  function showMessage(message) {
    const toast = $('#globalSuccessMessage');
    if (!toast) return;
    $('.success-message-global .message').textContent = message;
    clearTimeout(toastTimer);
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1150);
  }

  function renderFavorites() {
    if (page !== 'favorites') return;
    favorites = readList('favorites');
    const list = $('#favoritesItems');
    const empty = $('#favoritesEmpty');
    const catalogAction = $('#favoritesCatalogAction');
    list.innerHTML = '';
    empty.classList.toggle('hidden', favorites.length > 0);
    catalogAction?.classList.toggle('hidden', favorites.length === 0);

    favorites.forEach((book, index) => {
      const card = document.createElement('article');
      card.className = 'favorite-item';
      card.dataset.id = book.id;
      card.tabIndex = 0;
      card.setAttribute('aria-label', `Открыть: ${book.title}`);
      card.innerHTML = `
        <div class="favorite-image-container">
          <img class="favorite-item-image" src="${escapeHtml(book.image)}" alt="${escapeHtml(book.title)}" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async"${index === 0 ? ' fetchpriority="high"' : ''}>
        </div>
        <div class="favorite-item-info">
          <h2 class="favorite-item-title">${escapeHtml(book.title)}</h2>
          <div class="favorite-item-price">${formatPrice(book.price)}</div>
        </div>
        <button class="favorite-remove" type="button" data-id="${Number(book.id)}" aria-label="Удалить из избранного">
          <i class="fas fa-heart" aria-hidden="true"></i>
        </button>`;
      list.appendChild(card);
    });
    updateBadges();
  }

  function renderCart() {
    if (page !== 'cart') return;
    cart = readList('cart');
    const list = $('#cartItems');
    const empty = $('#cartEmpty');
    const summary = $('#cartSummary');
    list.innerHTML = '';
    empty.classList.toggle('hidden', cart.length > 0);
    summary.classList.toggle('hidden', cart.length === 0);

    let total = 0;
    let count = 0;
    cart.forEach((item, index) => {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      total += Number(item.price || 0) * quantity;
      count += quantity;
      const card = document.createElement('article');
      card.className = 'cart-item';
      card.dataset.id = item.id;
      card.tabIndex = 0;
      card.setAttribute('aria-label', `Открыть: ${item.title}`);
      card.innerHTML = `
        <div class="cart-image-container">
          <img class="cart-item-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async"${index === 0 ? ' fetchpriority="high"' : ''}>
        </div>
        <div class="cart-item-info">
          <h2 class="cart-item-title">${escapeHtml(item.title)}</h2>
          <div class="cart-item-price">${formatPrice(item.price)}</div>
        </div>
        <button class="cart-quantity" type="button" data-id="${Number(item.id)}" aria-label="Изменить количество: ${quantity}">${quantity}</button>
        <button class="cart-remove" type="button" data-id="${Number(item.id)}" aria-label="Убрать одну книгу из корзины">
          <i class="fas fa-trash-alt" aria-hidden="true"></i>
        </button>`;
      list.appendChild(card);
    });

    if (cart.length) {
      $('#itemCount').textContent = `${count} ${plural(count, ['товар', 'товара', 'товаров'])}`;
      $('#cartSubtotal').textContent = formatPrice(total);
      $('#cartTotal').textContent = formatPrice(total);
    }
    updateBadges();
  }

  function removeFavorite(id) {
    favorites = favorites.filter(item => Number(item.id) !== id);
    saveList('favorites', favorites);
    renderFavorites();
    showMessage('Книга удалена из избранного');
  }

  function removeOneFromCart(id) {
    const item = cart.find(entry => Number(entry.id) === id);
    if (!item) return;
    const quantity = Math.max(1, Number(item.quantity) || 1);
    if (quantity > 1) {
      item.quantity = quantity - 1;
      showMessage('Количество уменьшено');
    } else {
      cart = cart.filter(entry => Number(entry.id) !== id);
      showMessage('Книга удалена из корзины');
    }
    saveList('cart', cart);
    renderCart();
  }

  function showQuantityModal(id) {
    const item = cart.find(entry => Number(entry.id) === id);
    if (!item) return;
    modalBookId = id;
    $('#modalQuantity').value = Math.max(1, Number(item.quantity) || 1);
    updateModalPrice();
    $('#quantityModal').classList.add('active');
    $('#modalQuantity').focus({ preventScroll: true });
  }

  function closeQuantityModal() {
    $('#quantityModal')?.classList.remove('active');
    modalBookId = null;
  }

  function normalizedModalQuantity() {
    const input = $('#modalQuantity');
    const value = Math.max(1, Math.min(99, Number.parseInt(input.value, 10) || 1));
    input.value = value;
    return value;
  }

  function updateModalPrice() {
    const item = cart.find(entry => Number(entry.id) === modalBookId);
    if (!item) return;
    $('#modalTotalPrice').textContent = formatPrice(Number(item.price || 0) * normalizedModalQuantity());
  }

  function saveQuantity() {
    const item = cart.find(entry => Number(entry.id) === modalBookId);
    if (!item) return;
    const quantity = normalizedModalQuantity();
    item.quantity = quantity;
    saveList('cart', cart);
    closeQuantityModal();
    renderCart();
    showMessage(`Количество обновлено: ${quantity}`);
  }

  function handleListInteraction(event) {
    const remove = event.target.closest('.favorite-remove');
    const trash = event.target.closest('.cart-remove');
    const quantity = event.target.closest('.cart-quantity');
    if (remove) {
      event.stopPropagation();
      removeFavorite(Number(remove.dataset.id));
      return;
    }
    if (trash) {
      event.stopPropagation();
      const id = Number(trash.dataset.id);
      const item = cart.find(entry => Number(entry.id) === id);
      if ((Number(item?.quantity) || 1) > 5) showQuantityModal(id);
      else removeOneFromCart(id);
      return;
    }
    if (quantity) {
      event.stopPropagation();
      showQuantityModal(Number(quantity.dataset.id));
      return;
    }
    const card = event.target.closest('.cart-item, .favorite-item');
    if (card) window.location.href = getBookPageUrl(Number(card.dataset.id));
  }

  $('#cartItems')?.addEventListener('click', handleListInteraction);
  $('#favoritesItems')?.addEventListener('click', handleListInteraction);
  $('#cartItems')?.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.cart-item')) handleListInteraction(event);
  });
  $('#favoritesItems')?.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.favorite-item')) handleListInteraction(event);
  });
  $('#checkoutBtn')?.addEventListener('click', () => {
    if (!cart.length) return showMessage('Ваша корзина пуста');
    window.location.href = './catalog.html?page=payment';
  });
  $('#modalClose')?.addEventListener('click', closeQuantityModal);
  $('#modalMinus')?.addEventListener('click', () => {
    $('#modalQuantity').value = Math.max(1, normalizedModalQuantity() - 1);
    updateModalPrice();
  });
  $('#modalPlus')?.addEventListener('click', () => {
    $('#modalQuantity').value = Math.min(99, normalizedModalQuantity() + 1);
    updateModalPrice();
  });
  $('#modalQuantity')?.addEventListener('input', updateModalPrice);
  $('#modalSave')?.addEventListener('click', saveQuantity);
  $('#quantityModal')?.addEventListener('click', event => {
    if (event.target.id === 'quantityModal') closeQuantityModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeQuantityModal();
  });
  window.addEventListener('storage', event => {
    if (event.key === 'cart') renderCart();
    if (event.key === 'favorites') renderFavorites();
  });

  renderFavorites();
  renderCart();
  updateBadges();
})();
