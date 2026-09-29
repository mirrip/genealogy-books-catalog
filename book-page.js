(function () {
  'use strict';

  const book = window.STATUS_GIFT_BOOK;
  if (!book) return;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const mainImage = $('#mainImage');
  const thumbnails = $('#galleryThumbnails');
  const dots = $('#navIndicator');
  const likeButtons = $$('.detail-like-btn');
  const addButton = $('#addToCartBtn');
  const mobileAddButton = $('#mobileFixedCartBtn');
  const quantitySelector = $('#quantitySelector');
  const quantityInput = $('#quantityInput');
  const quantityPrice = $('#quantityPrice');
  const toast = $('#globalSuccessMessage');
  let imageIndex = 0;
  let quantity = 1;

  const readList = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  };

  const writeList = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const formatPrice = (price) => price === 0
    ? 'По запросу'
    : `${String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`;

  function showToast(message) {
    const messageNode = toast && toast.querySelector('.message');
    if (!toast || !messageNode) return;
    messageNode.textContent = message;
    clearTimeout(showToast.hideTimer);
    toast.classList.add('show');
    showToast.hideTimer = setTimeout(() => toast.classList.remove('show'), 1100);
  }

  function updateBadges() {
    const cart = readList('cart');
    const favorites = readList('favorites');
    const cartCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const headerCartBadge = $('#cartIconBadge');
    const sidebarCartBadge = $('#cartBadge');
    const favoritesBadge = $('#favoritesBadge');
    if (headerCartBadge) {
      headerCartBadge.textContent = cartCount;
      headerCartBadge.classList.toggle('hidden', cartCount === 0);
    }
    if (sidebarCartBadge) {
      sidebarCartBadge.textContent = cartCount;
      sidebarCartBadge.classList.toggle('hidden', cartCount === 0);
    }
    if (favoritesBadge) {
      favoritesBadge.textContent = favorites.length;
      favoritesBadge.classList.toggle('hidden', favorites.length === 0);
    }
  }

  function updateFavoriteState() {
    const liked = readList('favorites').some((item) => item.id === book.id);
    likeButtons.forEach((button) => {
      button.classList.toggle('liked', liked);
      button.setAttribute('aria-label', liked ? 'Удалить книгу из избранного' : 'Добавить книгу в избранное');
      button.innerHTML = `<i class="${liked ? 'fas' : 'far'} fa-heart"></i>`;
    });
  }

  function toggleFavorite() {
    const favorites = readList('favorites');
    const index = favorites.findIndex((item) => item.id === book.id);
    if (index === -1) {
      favorites.push({ ...book });
      showToast('Книга добавлена в избранное');
    } else {
      favorites.splice(index, 1);
      showToast('Книга удалена из избранного');
    }
    writeList('favorites', favorites);
    updateFavoriteState();
    updateBadges();
  }

  function updateQuantity() {
    quantityInput.value = quantity;
    quantityPrice.textContent = formatPrice(book.price * quantity);
  }

  function addToCart() {
    if (book.callbackOnly) {
      window.location.href = `../catalog.html?callback=${book.id}`;
      return;
    }
    if (!book.price) return;
    const cart = readList('cart');
    const existing = cart.find((item) => item.id === book.id);
    if (existing) {
      existing.quantity = Math.min((Number(existing.quantity) || 1) + quantity, 99);
      showToast(`Количество увеличено до ${existing.quantity}`);
    } else {
      cart.push({ ...book, quantity });
      showToast('Книга добавлена в корзину');
    }
    writeList('cart', cart);
    updateBadges();
    quantity = 1;
    updateQuantity();
  }

  function changeImage(nextIndex) {
    const count = book.images.length;
    imageIndex = (nextIndex + count) % count;
    mainImage.src = book.images[imageIndex];
    mainImage.alt = `${book.title} — фотография ${imageIndex + 1}`;
    $$('.thumbnail').forEach((thumb, index) => thumb.classList.toggle('active', index === imageIndex));
    $$('.nav-dot').forEach((dot, index) => dot.classList.toggle('active', index === imageIndex));
    const activeThumb = $('.thumbnail.active');
    if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  function buildGallery() {
    thumbnails.innerHTML = '';
    dots.innerHTML = '';
    book.images.forEach((src, index) => {
      const thumb = document.createElement('img');
      thumb.className = `thumbnail ${index === 0 ? 'active' : ''}`;
      thumb.dataset.index = index;
      thumb.src = src;
      thumb.alt = `${book.title} — миниатюра ${index + 1}`;
      thumb.loading = index === 0 ? 'eager' : 'lazy';
      thumb.decoding = 'async';
      thumbnails.appendChild(thumb);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `nav-dot ${index === 0 ? 'active' : ''}`;
      dot.dataset.index = index;
      dot.setAttribute('aria-label', `Показать фотографию ${index + 1}`);
      dots.appendChild(dot);
    });
  }

  function goBack() {
    try {
      const previous = document.referrer ? new URL(document.referrer) : null;
      if (previous && previous.origin === window.location.origin && history.length > 1) {
        history.back();
        return;
      }
    } catch (_) {}
    window.location.href = '../catalog.html';
  }

  function setupSidebar() {
    const sidebar = $('#profileSidebar');
    const overlay = $('#sidebarOverlay');
    const open = () => {
      sidebar.classList.add('open');
      overlay.classList.add('active');
    };
    const close = () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    };
    $('#logoBtn')?.addEventListener('click', open);
    $('#sidebarProfileBtn')?.addEventListener('click', close);
    overlay?.addEventListener('click', close);
  }

  function setupInteractions() {
    likeButtons.forEach((button) => button.addEventListener('click', toggleFavorite));
    addButton?.addEventListener('click', addToCart);
    mobileAddButton?.addEventListener('click', addToCart);
    $('#quantityMinus')?.addEventListener('click', () => {
      quantity = Math.max(1, quantity - 1);
      updateQuantity();
    });
    $('#quantityPlus')?.addEventListener('click', () => {
      quantity = Math.min(99, quantity + 1);
      updateQuantity();
    });
    quantityInput?.addEventListener('change', () => {
      quantity = Math.min(99, Math.max(1, Number.parseInt(quantityInput.value, 10) || 1));
      updateQuantity();
    });
    $('#prevZone')?.addEventListener('click', () => changeImage(imageIndex - 1));
    $('#nextZone')?.addEventListener('click', () => changeImage(imageIndex + 1));
    thumbnails?.addEventListener('click', (event) => {
      const thumb = event.target.closest('.thumbnail');
      if (thumb) changeImage(Number(thumb.dataset.index));
    });
    dots?.addEventListener('click', (event) => {
      const dot = event.target.closest('.nav-dot');
      if (dot) changeImage(Number(dot.dataset.index));
    });
    $$('.book-back-button').forEach((button) => button.addEventListener('click', goBack));
    $('#favoritesIconBtn')?.addEventListener('click', () => { window.location.href = '../catalog.html?page=favorites'; });
    $('#cartIconBtn')?.addEventListener('click', () => { window.location.href = '../catalog.html?page=cart'; });

    let touchStartX = 0;
    const imageContainer = $('#mainImageContainer');
    imageContainer?.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });
    imageContainer?.addEventListener('touchend', (event) => {
      const distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) > 45) changeImage(imageIndex + (distance < 0 ? 1 : -1));
    }, { passive: true });
  }

  function initialize() {
    buildGallery();
    setupSidebar();
    setupInteractions();
    updateFavoriteState();
    updateBadges();
    updateQuantity();
    if (book.callbackOnly) {
      addButton.textContent = 'Заказать обратный звонок';
      mobileAddButton?.classList.add('hidden');
      quantitySelector?.classList.add('hidden');
    } else if (!book.price) {
      addButton.textContent = 'Только под заказ';
      addButton.disabled = true;
      mobileAddButton?.classList.add('hidden');
      quantitySelector?.classList.add('hidden');
    } else {
      mobileAddButton?.classList.remove('hidden');
    }
  }

  initialize();
})();
