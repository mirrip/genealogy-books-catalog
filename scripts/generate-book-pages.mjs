import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const catalogPath = path.join(rootDir, 'catalog.html');
const booksDir = path.join(rootDir, 'books');
const catalogSource = fs.readFileSync(catalogPath, 'utf8');
const booksMatch = catalogSource.match(/const books = (\[[\s\S]*?\n\s*\]);/);
const styleMatch = catalogSource.match(/<style>([\s\S]*?)<\/style>/);

if (!booksMatch || !styleMatch) throw new Error('Catalog data or base styles were not found.');

const books = vm.runInNewContext(`(${booksMatch[1]})`);
const slugs = [
  'elitnaya-rodoslovnaya-kniga',
  'elitnaya-s-tisneniem',
  'izyskannaya-v-opletke-s-zolotym-drevom',
  'izyskannaya-v-opletke',
  'izyskannaya',
  'izyskannaya-troyka',
  'izyskannaya-letopisets',
  'izyskannaya-blagoslovenie',
  'semejnyj-albom',
  'hudozhestvennaya-bordovaya-s-gerbom',
  'hudozhestvennaya-bordovaya-s-drevom',
  'hudozhestvennaya-chernaya-s-gerbom',
  'hudozhestvennaya-sinyaya-s-gerbom',
  'hudozhestvennaya-svadebnaya-s-drevom',
  'hudozhestvennaya-zelenaya-s-mechetyu',
  'hudozhestvennaya-musulmanskaya',
  'hudozhestvennaya-na-anglijskom',
  'izyskannaya-na-anglijskom',
  'izyskannaya-eko-kozha',
  'podarochnyj-paket'
];

if (books.length !== slugs.length) throw new Error(`Expected ${slugs.length} books, found ${books.length}.`);

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const assetUrl = (value) => `/${String(value).split('/').map(encodeURIComponent).join('/')}`;
const absoluteUrl = (value) => `https://rodkod.ru${assetUrl(value)}`;
const formatPrice = (price) => price === 0
  ? 'По запросу'
  : `${String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ₽`;

const sharedBaseStyles = `${styleMatch[1].trim()}\n\n` + `
body.book-product-page #bookDetailPage {
  display: block;
}

.book-product-page .book-detail-title {
  margin-top: 0;
}

.book-product-page .book-back-button {
  font: inherit;
}

.book-product-page .nav-dot {
  padding: 0;
}

.book-product-page .sidebar-item {
  text-decoration: none;
}

.book-product-page .mobile-fixed-cart-btn {
  display: none !important;
}
`;
fs.writeFileSync(path.join(rootDir, 'book-page-base.css'), sharedBaseStyles, 'utf8');
fs.mkdirSync(booksDir, { recursive: true });

function productPage(book, slug) {
  const pageUrl = `https://rodkod.ru/books/${slug}.html`;
  const primaryImage = absoluteUrl(book.image);
  const pageBook = {
    ...book,
    image: assetUrl(book.image),
    images: book.images.map(assetUrl),
    url: pageUrl
  };
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: book.title,
    image: book.images.map(absoluteUrl),
    description: book.description,
    sku: `status-gift-${book.id}`,
    brand: { '@type': 'Brand', name: 'Status Gift' },
    offers: {
      '@type': 'Offer',
      url: pageUrl,
      priceCurrency: 'RUB',
      price: String(book.price),
      availability: 'https://schema.org/InStock'
    }
  };

  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${escapeHtml(book.title)} — родословная книга | Status Gift</title>
  <meta name="description" content="${escapeHtml(`${book.title}. ${book.description} Цена: ${formatPrice(book.price)}.`)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${pageUrl}">
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="Status Gift">
  <meta property="og:title" content="${escapeHtml(`${book.title} — Status Gift`)}">
  <meta property="og:description" content="${escapeHtml(book.description)}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:locale" content="ru_RU">
  <meta property="og:image" content="${primaryImage}">
  <meta name="theme-color" content="#080302">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(`${book.title} — Status Gift`)}">
  <meta name="twitter:description" content="${escapeHtml(book.description)}">
  <meta name="twitter:image" content="${primaryImage}">
  <link rel="manifest" href="/manifest.json">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="stylesheet" href="../book-page-base.css?v=20260929-1">
  <link rel="stylesheet" href="../catalog-theme.css?v=20260929-19">
  <script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>
</head>
<body class="book-product-page">
  <header class="catalog-site-header">
    <div class="container header-container">
      <div class="logo-container">
        <button class="catalog-menu-toggle" id="logoBtn" type="button" aria-label="Открыть меню"><span></span><span></span><span></span></button>
        <a class="catalog-brand" href="../index.html" aria-label="Status Gift — главная">
          <img class="brand__mark" src="../assets/brand/status-gift-mark-clean.webp" width="144" height="144" alt="" aria-hidden="true">
          <span class="brand__desktop-name">Status Gift</span><span class="brand__mobile-name">РодКод</span>
        </a>
      </div>
      <nav class="catalog-primary-nav" aria-label="Разделы сайта">
        <a href="../index.html">Главная</a><a class="is-current" href="../catalog.html">Каталог книг</a><a href="../gifts.html">Подобрать подарок</a><a href="../works.html">Что мы создаём</a><a href="../about.html">О Status Gift</a>
      </nav>
      <div class="nav-buttons">
        <button class="catalog-header-icon" id="favoritesIconBtn" type="button" aria-label="Открыть избранное"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.7a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z"/></svg></button>
        <a class="catalog-header-icon catalog-account-link" href="../profile.html" aria-label="Личный кабинет"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0"/></svg></a>
        <button class="btn-cart-icon catalog-header-icon" id="cartIconBtn" type="button" aria-label="Открыть корзину"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L20 8H6M9 20h.01M17 20h.01"/></svg><span class="cart-badge-icon hidden" id="cartIconBadge">0</span></button>
      </div>
    </div>
  </header>

  <aside class="sidebar" id="profileSidebar" aria-label="Меню сайта">
    <div class="sidebar-header"><button class="sidebar-profile-btn sidebar-close-btn" id="sidebarProfileBtn" type="button" aria-label="Закрыть меню"><span aria-hidden="true">×</span></button><div class="sidebar-logo">Status Gift</div></div>
    <div class="sidebar-menu">
      <a class="sidebar-item sidebar-home-item" href="../index.html"><i class="fas fa-house"></i><span>Главная</span></a>
      <a class="sidebar-item active" href="../catalog.html"><i class="fas fa-book-open"></i><span>Каталог</span></a>
      <a class="sidebar-item" href="../gifts.html"><i class="fas fa-gift"></i><span>Подобрать подарок</span></a>
      <a class="sidebar-item" href="../works.html"><i class="fas fa-shapes"></i><span>Что мы создаём</span></a>
      <a class="sidebar-item" href="../about.html"><i class="fas fa-circle-info"></i><span>О Status Gift</span></a>
      <a class="sidebar-item sidebar-utility-start" href="../catalog.html?page=favorites"><i class="fas fa-heart"></i><span>Избранное</span><span class="sidebar-badge hidden" id="favoritesBadge">0</span></a>
      <a class="sidebar-item" href="../catalog.html?page=cart"><i class="fas fa-shopping-cart"></i><span>Корзина</span><span class="sidebar-badge hidden" id="cartBadge">0</span></a>
      <a class="sidebar-item" href="../profile.html"><i class="fas fa-user"></i><span>Личный кабинет</span></a>
    </div>
    <div class="sidebar-footer"><div>© 2026 Status Gift • Родословные книги</div></div>
  </aside>
  <div class="sidebar-overlay" id="sidebarOverlay"></div>

  <main class="container page" id="bookDetailPage">
    <div class="detail-mobile-actions" aria-label="Управление карточкой книги">
      <button class="btn-back book-back-button" type="button"><i class="fas fa-arrow-left"></i><span>Назад</span></button>
      <button class="detail-like-btn" id="detailLikeBtnMobile" type="button" aria-label="Добавить книгу в избранное"><i class="far fa-heart"></i></button>
    </div>
    <div class="gallery-container">
      <div class="gallery-main">
        <div class="main-image-container" id="mainImageContainer">
          <button class="btn-back detail-catalog-btn book-back-button" type="button"><i class="fas fa-arrow-left"></i><span>Назад</span></button>
          <img class="main-image" id="mainImage" src="${assetUrl(book.image)}" alt="${escapeHtml(book.title)}" loading="eager" fetchpriority="high" decoding="async">
          <div class="image-navigation"><div class="nav-zone left" id="prevZone"><div class="nav-text prev-text">‹</div></div><div class="nav-zone right" id="nextZone"><div class="nav-text next-text">›</div></div></div>
          <div class="nav-indicator" id="navIndicator"></div>
        </div>
        <div class="gallery-thumbnails" id="galleryThumbnails"></div>
      </div>
      <article class="book-details">
        <button class="detail-like-btn" id="detailLikeBtn" type="button" aria-label="Добавить книгу в избранное"><i class="far fa-heart"></i></button>
        <h1 class="book-detail-title" id="detailTitle">${escapeHtml(book.title)}</h1>
        <div class="book-detail-price" id="detailPrice">${escapeHtml(formatPrice(book.price))}</div>
        <div class="book-detail-description" id="detailDescription">${escapeHtml(book.description)}</div>
        <div class="quantity-selector hidden" id="quantitySelector"><button class="quantity-btn minus" id="quantityMinus" type="button">−</button><input type="number" class="quantity-input" id="quantityInput" value="1" min="1" max="99"><button class="quantity-btn plus" id="quantityPlus" type="button">+</button><div class="quantity-price" id="quantityPrice">${escapeHtml(formatPrice(book.price))}</div></div>
        <button class="btn btn-add-to-cart" id="addToCartBtn" type="button">Добавить в корзину</button>
      </article>
    </div>
    <button class="mobile-fixed-cart-btn hidden" id="mobileFixedCartBtn" type="button"><i class="fas fa-shopping-cart"></i> В корзину</button>
  </main>

  <div class="success-message-global" id="globalSuccessMessage" role="status" aria-live="polite"><i class="fas fa-check-circle"></i><div class="message"></div></div>
  <script>window.STATUS_GIFT_BOOK = ${JSON.stringify(pageBook).replaceAll('<', '\\u003c')};</script>
  <script src="../book-page.js?v=20260929-1" defer></script>
</body>
</html>
`;
}

books.forEach((book, index) => {
  const filePath = path.join(booksDir, `${slugs[index]}.html`);
  fs.writeFileSync(filePath, productPage(book, slugs[index]), 'utf8');
});

console.log(`Generated ${books.length} product pages and book-page-base.css.`);
