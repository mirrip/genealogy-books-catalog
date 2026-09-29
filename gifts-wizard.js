/**
 * GIFTS WIZARD - Интеллектуальный подбор подарка
 * Полная интеграция с базой и стилистикой каталога РодКод
 */

(function () {
  'use strict';

  // Полная база книг из каталога
  const books = [
    {
      "id": 1,
      "title": "Элитная",
      "price": 29000,
      "image": "элитная 29/elitnaya_01_under_3mb.jpg",
      "description": "Подарите семье реликвию, достойную поколений. Эта книга сохранит историю рода в самом статусном исполнении.",
      "occasions": [
        "jubilee",
        "vip",
        "birthday",
        "family"
      ],
      "gender": "male"
    },
    {
      "id": 2,
      "title": "Элитная с тиснением",
      "price": 26500,
      "image": "элитная с тен 26/elitnaya_s_ten_01_under_3mb.jpg",
      "description": "Подарите историю семьи в тёплом кожаном облике. Эта книга станет дорогой памятью для будущих поколений.",
      "occasions": [
        "jubilee",
        "vip",
        "family",
        "birthday"
      ],
      "gender": "universal"
    },
    {
      "id": 3,
      "title": "Изысканная в оплётке с золочёным древом",
      "price": 11200,
      "image": "изызканная в оплетке 11/braid_album_01_optimized.jpg",
      "description": "Подарите близким книгу, где род оживает золотым древом. Она сохранит память семьи красиво и торжественно.",
      "occasions": [
        "wedding",
        "jubilee",
        "family",
        "birthday"
      ],
      "gender": "universal"
    },
    {
      "id": 4,
      "title": "Изысканная в оплётке",
      "price": 10500,
      "image": "изызканная в оплетке/izyskannaya_2_01_under_3mb.jpg",
      "description": "Подарите семье тёплую родословную книгу с особым характером. В ней оживут имена, истории и поколения.",
      "occasions": [
        "jubilee",
        "family",
        "birthday",
        "vip"
      ],
      "gender": "universal"
    },
    {
      "id": 5,
      "title": "Изысканная",
      "price": 9500,
      "image": "изысканная 9/izyskannaya_album_01_optimized.jpg",
      "description": "Подарите близким память, которую можно держать в руках. Эта книга сохранит историю вашей семьи.",
      "occasions": [
        "family",
        "birthday",
        "jubilee",
        "wedding"
      ],
      "gender": "female"
    },
    {
      "id": 6,
      "title": "Изысканная «Тройка»",
      "price": 9500,
      "image": "тройка изыск/troyka_izysk_01_under_3mb.jpg",
      "description": "Подарите книгу с русским характером и душой. Она сохранит семейную историю, корни и дорогу поколений.",
      "occasions": [
        "jubilee",
        "birthday",
        "vip",
        "family"
      ],
      "gender": "male"
    },
    {
      "id": 7,
      "title": "Изысканная «Летописец»",
      "price": 9500,
      "image": "изыск летописец/letopisets_album_01_optimized.jpg",
      "description": "Подарите семье собственную летопись. Эта книга сохранит истории, фотографии и память поколений.",
      "occasions": [
        "jubilee",
        "birthday",
        "vip",
        "family"
      ],
      "gender": "male"
    },
    {
      "id": 8,
      "title": "Изысканная «Благословение»",
      "price": 9500,
      "image": "изыск благословие/blessing_album_01_optimized.jpg",
      "description": "Подарите книгу, наполненную теплом и благодарностью. Она сохранит семейную историю как благословение для поколений.",
      "occasions": [
        "wedding",
        "child",
        "family",
        "jubilee"
      ],
      "gender": "female"
    },
    {
      "id": 9,
      "title": "Семейный альбом",
      "price": 5000,
      "image": "альбом/album_01_optimized.jpg",
      "description": "Подарите место для самых дорогих фотографий. Этот альбом сохранит улыбки, праздники и семейные воспоминания.",
      "occasions": [
        "family",
        "birthday",
        "child",
        "wedding"
      ],
      "gender": "universal"
    },
    {
      "id": 10,
      "title": "Художественная бордовая с гербом",
      "price": 7200,
      "image": "худож герб 7/hudozh_gerb_01_under_3mb.jpg",
      "description": "Подарите семье книгу с чувством достоинства. Герб на обложке подчеркнёт фамильную память и историю рода.",
      "occasions": [
        "vip",
        "jubilee",
        "birthday",
        "family"
      ],
      "gender": "male"
    },
    {
      "id": 11,
      "title": "Художественная бордовая с древом",
      "price": 7200,
      "image": "худож древо 7/hudozh_drevo_01_under_3mb.jpg",
      "description": "Подарите книгу, где главное — корни семьи. Она сохранит поколения, имена и самые важные воспоминания.",
      "occasions": [
        "family",
        "jubilee",
        "wedding",
        "birthday"
      ],
      "gender": "universal"
    },
    {
      "id": 12,
      "title": "Художественная чёрная с гербом",
      "price": 7200,
      "image": "худож черн 7/hudozh_chern_01_under_3mb.jpg",
      "description": "Подарите достойную книгу для главы семьи. Она подчеркнёт уважение к роду, фамилии и семейной памяти.",
      "occasions": [
        "jubilee",
        "vip",
        "birthday"
      ],
      "gender": "male"
    },
    {
      "id": 13,
      "title": "Художественная синяя с гербом",
      "price": 7200,
      "image": "худож син 7/hudozh_sin_01_under_3mb.jpg",
      "description": "Подарите спокойную и благородную семейную книгу. Она сохранит историю рода с теплом, уважением и вкусом.",
      "occasions": [
        "jubilee",
        "vip",
        "birthday"
      ],
      "gender": "male"
    },
    {
      "id": 14,
      "title": "Художественная «Свадебная с древом»",
      "price": 7200,
      "image": "худож свадебная 7/hudozh_svadebnaya_01_under_3mb.jpg",
      "description": "Подарите молодожёнам начало их семейной истории. Эта книга сохранит корни, любовь и будущие поколения.",
      "occasions": [
        "wedding",
        "family",
        "child"
      ],
      "gender": "universal"
    },
    {
      "id": 15,
      "title": "Художественная зелёная с мечетью",
      "price": 7200,
      "image": "худож мечеть 7/hudozh_mechet_01_under_3mb.jpg",
      "description": "Подарите семье книгу с уважением к традициям. Она сохранит родовую память, веру и связь поколений.",
      "occasions": [
        "jubilee",
        "family",
        "birthday"
      ],
      "gender": "universal"
    },
    {
      "id": 16,
      "title": "Художественная мусульманская",
      "price": 7200,
      "image": "худож мусульман 7/hudozh_musulman_01_under_3mb.jpg",
      "description": "Подарите тёплую семейную книгу с особым смыслом. Она сохранит историю рода бережно, достойно и уважительно.",
      "occasions": [
        "jubilee",
        "family",
        "wedding"
      ],
      "gender": "universal"
    },
    {
      "id": 17,
      "title": "Художественная на английском",
      "price": 7200,
      "image": "худож англ 10/hudozh_angl_01_under_3mb.jpg",
      "description": "Подарите книгу, которая соединит родственников из разных стран. Она сохранит семейную историю на понятном языке.",
      "occasions": [
        "vip",
        "birthday",
        "family",
        "wedding"
      ],
      "gender": "universal"
    },
    {
      "id": 18,
      "title": "Изысканная на английском",
      "price": 7200,
      "image": "изыск англ 10/elegant_english_album_01_optimized.jpg",
      "description": "Подарите семейную историю без границ. Эта книга объединит поколения, языки и родных по всему миру.",
      "occasions": [
        "vip",
        "wedding",
        "family"
      ],
      "gender": "universal"
    },
    {
      "id": 19,
      "title": "Изысканная эко-кожа",
      "price": 7200,
      "image": "изыск экокожа 7/eco_leather_album_01_optimized.jpg",
      "description": "Подарите современную семейную книгу с тёплым смыслом. Эко-кожа делает её стильной, аккуратной и душевной.",
      "occasions": [
        "family",
        "birthday",
        "wedding"
      ],
      "gender": "female"
    }
  ];

  const PRICE_LIMITS = { min: 5000, max: 29000 };

  const bookPagePaths = [
    'elitnaya-rodoslovnaya-kniga', 'elitnaya-s-tisneniem', 'izyskannaya-v-opletke-s-zolotym-drevom',
    'izyskannaya-v-opletke', 'izyskannaya', 'izyskannaya-troyka', 'izyskannaya-letopisets',
    'izyskannaya-blagoslovenie', 'semejnyj-albom', 'hudozhestvennaya-bordovaya-s-gerbom',
    'hudozhestvennaya-bordovaya-s-drevom', 'hudozhestvennaya-chernaya-s-gerbom',
    'hudozhestvennaya-sinyaya-s-gerbom', 'hudozhestvennaya-svadebnaya-s-drevom',
    'hudozhestvennaya-zelenaya-s-mechetyu', 'hudozhestvennaya-musulmanskaya',
    'hudozhestvennaya-na-anglijskom', 'izyskannaya-na-anglijskom', 'izyskannaya-eko-kozha'
  ];

  // Состояние
  const state = {
    priceMin: 5000,
    priceMax: 29000,
    occasion: 'all',     // all | jubilee | wedding | birthday | family | child
    statusRelation: 'higher', // higher | equal | lower
    gender: 'all'        // all | male | female
  };

  // Избранное из общего хранилища сайта
  let favorites = [];
  try {
    favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  } catch (e) {
    favorites = [];
  }

  function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₽";
  }

  // DOM элементы
  let priceMinInput, priceMaxInput, rangeMin, rangeMax, activeTrack;
  let booksGrid, emptyView, toastElem;
  let loaderView, loaderTitle, loaderSub, btnSubmit;

  function initDOMElements() {
    priceMinInput = document.getElementById('giftPriceMin');
    priceMaxInput = document.getElementById('giftPriceMax');
    rangeMin = document.getElementById('giftRangeMin');
    rangeMax = document.getElementById('giftRangeMax');
    activeTrack = document.getElementById('giftSliderActiveTrack');
    booksGrid = document.getElementById('giftBooksGrid');
    emptyView = document.getElementById('giftEmptyView');
    toastElem = document.getElementById('giftToast');
    loaderView = document.getElementById('giftLoaderView');
    loaderTitle = document.getElementById('giftLoaderTitle');
    loaderSub = document.getElementById('giftLoaderSub');
    btnSubmit = document.getElementById('giftBtnSubmit');
  }

  function updateSliderVisuals() {
    const minVal = Math.min(state.priceMin, state.priceMax);
    const maxVal = Math.max(state.priceMin, state.priceMax);
    const totalSpan = PRICE_LIMITS.max - PRICE_LIMITS.min;

    const leftPct = ((minVal - PRICE_LIMITS.min) / totalSpan) * 100;
    const rightPct = 100 - (((maxVal - PRICE_LIMITS.min) / totalSpan) * 100);

    if (activeTrack) {
      activeTrack.style.left = leftPct + '%';
      activeTrack.style.right = rightPct + '%';
    }

    if (priceMinInput && document.activeElement !== priceMinInput) {
      priceMinInput.value = minVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    if (priceMaxInput && document.activeElement !== priceMaxInput) {
      priceMaxInput.value = maxVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    if (rangeMin) rangeMin.value = minVal;
    if (rangeMax) rangeMax.value = maxVal;
  }

  // Интеллектуальные списки книг по поводам и адресатам
  // Каждая комбинация задаёт точный список подходящих книг в порядке релевантности (для «Равного статуса»)
  // «Семейный альбом» (id: 9) всегда ставится ниже / за книгами по 7200 ₽
  const CURATED_LISTS = {
    // 1. Рождение ребёнка
    child: {
      all: [14, 11, 8, 3, 9, 2],
      male: [3, 8, 2, 9],
      female: [8, 14, 11, 19, 9]
    },
    // 2. Свадьба, годовщина
    wedding: {
      all: [14, 3, 8, 2, 11, 19, 16, 18, 9],
      male: [3, 2, 14, 5],
      female: [14, 8, 3, 11, 19, 9]
    },
    // 3. Юбилей
    jubilee: {
      all: [1, 2, 3, 10, 4, 13, 7, 11, 15],
      male: [1, 2, 6, 7, 12, 10, 13, 4],
      female: [2, 3, 8, 11, 5, 1]
    },
    // 4. День рождения
    birthday: {
      all: [3, 5, 11, 2, 10, 13, 9, 1],
      male: [6, 7, 12, 13, 4, 1, 10, 2],
      female: [11, 5, 8, 19, 3, 9, 2]
    },
    // 5. Семейная дата
    family: {
      all: [3, 2, 5, 11, 8, 4, 1, 14, 19, 10, 15, 16, 9],
      male: [2, 4, 7, 1, 10, 3],
      female: [8, 11, 3, 5, 2, 19, 9]
    },
    // 6. Все поводы
    all: {
      all: [3, 2, 1, 5, 11, 8, 14, 4, 10, 12, 13, 6, 7, 19, 15, 16, 17, 18, 9],
      male: [1, 2, 6, 7, 12, 10, 13, 4, 3, 5],
      female: [8, 11, 14, 3, 5, 19, 9, 2, 1]
    }
  };

  // Логика подбора и сортировки по условиям
  function getFilteredAndSortedBooks() {
    const minP = Math.min(state.priceMin, state.priceMax);
    const maxP = Math.max(state.priceMin, state.priceMax);

    // Получаем целевой список ID для выбранной комбинации (Повод × Получатель)
    const occasionGroup = CURATED_LISTS[state.occasion] || CURATED_LISTS.all;
    const allowedIds = occasionGroup[state.gender] || occasionGroup.all;

    // 1. Прямая фильтрация по списку ID и диапазону цен
    let list = books.filter(b => {
      if (!allowedIds.includes(b.id)) return false;
      if (b.price < minP || b.price > maxP) return false;
      return true;
    });

    // 2. Если в выбранном диапазоне нет книг по строгому фильтру:
    if (list.length === 0) {
      // 2a. Ищем книги из каталога в этом диапазоне цен
      const inPriceRange = books.filter(b => b.price >= minP && b.price <= maxP);

      if (inPriceRange.length > 0) {
        // Отдаём предпочтение книгам, имеющим отношение к поводу или полу
        const occasionAll = (CURATED_LISTS[state.occasion] || CURATED_LISTS.all).all || [];
        const genderAll = (CURATED_LISTS.all[state.gender] || CURATED_LISTS.all.all) || [];
        const relevant = inPriceRange.filter(b => occasionAll.includes(b.id) || genderAll.includes(b.id));

        if (relevant.length > 0) {
          const others = inPriceRange.filter(b => !relevant.some(r => r.id === b.id));
          list = [...relevant, ...others];
        } else {
          list = [...inPriceRange];
        }
      } else {
        // 2b. В диапазоне цен вообще нет книг в каталоге.
        // Точно как в каталоге (filterBooksByPrice): находим ближайшие доступные цены
        const allPrices = [...new Set(books.filter(b => b.price > 0).map(b => b.price))].sort((a, b) => a - b);
        
        let lowerPrice = null;
        for (let i = allPrices.length - 1; i >= 0; i--) {
          if (allPrices[i] <= minP) {
            lowerPrice = allPrices[i];
            break;
          }
        }

        let upperPrice = null;
        for (let i = 0; i < allPrices.length; i++) {
          if (allPrices[i] >= maxP) {
            upperPrice = allPrices[i];
            break;
          }
        }

        if (lowerPrice === null && allPrices.length > 0) lowerPrice = allPrices[0];
        if (upperPrice === null && allPrices.length > 0) upperPrice = allPrices[allPrices.length - 1];

        let nearest = [];
        if (lowerPrice !== null) {
          nearest = nearest.concat(books.filter(b => b.price === lowerPrice));
        }
        if (upperPrice !== null && upperPrice !== lowerPrice) {
          nearest = nearest.concat(books.filter(b => b.price === upperPrice));
        }

        nearest = nearest.filter((b, idx, arr) => arr.findIndex(x => x.id === b.id) === idx);

        const matchingNearest = nearest.filter(b => allowedIds.includes(b.id));
        if (matchingNearest.length > 0) {
          const otherNearest = nearest.filter(b => !matchingNearest.some(m => m.id === b.id));
          list = [...matchingNearest, ...otherNearest];
        } else {
          list = nearest;
        }
      }
    }

    // 3. Сортировка по статусу получателя:
    // «выше по статусу — сначала дорогие,
    // равный по статусу — сначала те, которые лучше всех подходят (по смысловому рейтингу),
    // ниже по статусу — сначала дешёвые (но альбом идёт за книгами по 7200 ₽)»
    list.sort((a, b) => {
      const rankA = allowedIds.includes(a.id) ? allowedIds.indexOf(a.id) : 999;
      const rankB = allowedIds.includes(b.id) ? allowedIds.indexOf(b.id) : 999;

      if (state.statusRelation === 'higher') {
        // Сначала дорогие, при равенстве цен — по смысловому рейтингу
        if (b.price !== a.price) return b.price - a.price;
        return rankA - rankB;
      } else if (state.statusRelation === 'lower') {
        // Сначала дешёвые. Альбом (id: 9, 5000 ₽) ставится ПОСЛЕ/ЗА книгами по 7200 ₽
        const getEffectivePrice = (book) => {
          if (book.id === 9) return 7250;
          return book.price;
        };
        const epA = getEffectivePrice(a);
        const epB = getEffectivePrice(b);
        if (epA !== epB) return epA - epB;
        return rankA - rankB;
      } else {
        // Равный статус — строгий порядок экспертного соответствия
        if (rankA !== rankB) return rankA - rankB;
        return b.price - a.price;
      }
    });

    // 4. Везде, где альбом (id: 9) оказывается первым, переставляем его ниже / за книгами по 7200 ₽
    if (list.length > 1 && list[0].id === 9) {
      let targetIndex = -1;
      for (let i = 0; i < list.length; i++) {
        if (list[i].id !== 9 && list[i].price <= 7200) {
          targetIndex = i;
        }
      }
      if (targetIndex >= 0) {
        const album = list.shift();
        list.splice(targetIndex, 0, album);
      }
    }

    return list;
  }

  // Отрисовка карточек книг в точности как в catalog.html
  function renderBooks() {
    const list = getFilteredAndSortedBooks();

    if (!booksGrid) return;

    if (list.length === 0) {
      booksGrid.style.display = 'none';
      if (emptyView) emptyView.style.display = 'block';
      if (updateSidebarSticky) {
        requestAnimationFrame(updateSidebarSticky);
      }
      return;
    }

    booksGrid.style.display = 'grid';
    if (emptyView) emptyView.style.display = 'none';

    booksGrid.innerHTML = list.map(book => {
      const isLiked = favorites.some(fav => fav.id === book.id);
      const priceDisplay = formatPrice(book.price);

      return `
        <div class="book-card" data-id="${book.id}">
            <div class="book-image-container">
                <img class="book-image" src="${book.image}" alt="${book.title}" loading="lazy">
                <div class="book-like-mobile ${isLiked ? 'liked' : ''}" data-id="${book.id}">
                    <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
                </div>
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <div class="book-price">${priceDisplay}</div>
                <p class="book-description">${book.description}</p>
            </div>
        </div>
      `;
    }).join('');

    if (updateSidebarSticky) {
      requestAnimationFrame(updateSidebarSticky);
    }
  }

  // Переключение избранного (полная совместимость с каталогом)
  function toggleFavorite(id) {
    const index = favorites.findIndex(item => item.id === id);
    if (index === -1) {
      const book = books.find(item => item.id === id);
      if (book) favorites.push(book);
    } else {
      favorites.splice(index, 1);
    }
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (e) {}

    // Обновляем сердечко в карточке
    const heart = booksGrid.querySelector(`.book-like-mobile[data-id="${id}"]`);
    if (heart) {
      const isLiked = favorites.some(item => item.id === id);
      heart.classList.toggle('liked', isLiked);
      const icon = heart.querySelector('i');
      if (icon) {
        icon.className = isLiked ? 'fas fa-heart' : 'far fa-heart';
      }
    }

    showToast(index === -1 ? 'Книга добавлена в избранное!' : 'Книга удалена из избранного');
  }

  // Показ уведомления
  function showToast(msg) {
    if (!toastElem) return;
    toastElem.textContent = msg;
    clearTimeout(showToast.hideTimer);
    toastElem.classList.add('is-visible');
    showToast.hideTimer = setTimeout(() => {
      toastElem.classList.remove('is-visible');
    }, 1100);
  }

  // Синхронизация параметров с адресной строкой
  function updateBrowserUrl() {
    const params = new URLSearchParams();
    if (state.priceMin !== 5000) params.set('min', state.priceMin);
    if (state.priceMax !== 29000) params.set('max', state.priceMax);
    if (state.occasion !== 'all') params.set('occasion', state.occasion);
    if (state.statusRelation !== 'higher') params.set('status', state.statusRelation);
    if (state.gender !== 'all') params.set('gender', state.gender);

    const qs = params.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    try {
      window.history.replaceState(null, '', newUrl);
    } catch (e) {}
  }

  // Запуск подборки с элитным лоадером (8 сек)
  let isLoadingSelection = false;
  let loadingTimer = null;
  let loadingSubTimers = [];

  function clearLoadingTimers() {
    if (loadingTimer) {
      clearTimeout(loadingTimer);
      loadingTimer = null;
    }
    loadingSubTimers.forEach(t => clearTimeout(t));
    loadingSubTimers = [];
  }

  function scrollToCatalogTop() {
    const layout = document.querySelector('.gift-layout');
    if (!layout) return;
    const layoutRect = layout.getBoundingClientRect();

    if (window.innerWidth <= 1180) {
      const resultsCol = document.querySelector('.gift-results-column');
      if (resultsCol) {
        const resultsRect = resultsCol.getBoundingClientRect();
        const topY = Math.max(0, resultsRect.top + window.scrollY - 20);
        window.scrollTo({ top: topY, behavior: 'smooth' });
      }
      return;
    }

    const catalogTopY = Math.max(0, layoutRect.top + window.scrollY - 20);
    if (Math.abs(window.scrollY - catalogTopY) > 8) {
      window.scrollTo({
        top: catalogTopY,
        behavior: 'smooth'
      });
    }
  }

  function startSelection() {
    if (isLoadingSelection) return;
    isLoadingSelection = true;
    clearLoadingTimers();

    if (btnSubmit) {
      btnSubmit.classList.add('is-busy');
    }

    const resultsCol = document.querySelector('.gift-results-column');
    const prevGridHeight = booksGrid ? booksGrid.offsetHeight : 0;
    if (resultsCol && prevGridHeight > 0) {
      resultsCol.style.minHeight = `${Math.max(prevGridHeight, 820)}px`;
    }

    if (booksGrid) booksGrid.style.display = 'none';
    if (emptyView) emptyView.style.display = 'none';

    if (loaderView) {
      loaderView.style.minHeight = '';
      loaderView.style.display = 'flex';
      if (loaderTitle) loaderTitle.textContent = 'Составляем персональную подборку...';
      if (loaderSub) {
        loaderSub.style.opacity = '1';
        loaderSub.textContent = 'Анализируем повод, статус получателя и бюджет';
      }
    }

    scrollToCatalogTop();

    if (updateSidebarSticky) {
      updateSidebarSticky();
    }

    // Этап 2: смена статуса на 2.6 секунде
    loadingSubTimers.push(setTimeout(() => {
      if (!isLoadingSelection || !loaderSub) return;
      loaderSub.style.opacity = '0';
      loadingSubTimers.push(setTimeout(() => {
        if (!isLoadingSelection || !loaderSub) return;
        loaderSub.textContent = 'Изучаем архив переплётов и художественное оформление';
        loaderSub.style.opacity = '1';
      }, 250));
    }, 2600));

    // Этап 3: смена статуса на 5.3 секунде
    loadingSubTimers.push(setTimeout(() => {
      if (!isLoadingSelection || !loaderSub) return;
      loaderSub.style.opacity = '0';
      loadingSubTimers.push(setTimeout(() => {
        if (!isLoadingSelection || !loaderSub) return;
        loaderSub.textContent = 'Формируем эксклюзивную коллекцию родословных книг';
        loaderSub.style.opacity = '1';
      }, 250));
    }, 5300));

    // Завершение подбора и появление книг ровно через 8 секунд (8000 мс)
    loadingTimer = setTimeout(() => {
      if (!isLoadingSelection) return;
      isLoadingSelection = false;
      clearLoadingTimers();

      if (btnSubmit) {
        btnSubmit.classList.remove('is-busy');
      }

      const resultsCol = document.querySelector('.gift-results-column');
      if (resultsCol) {
        resultsCol.style.minHeight = '';
      }

      if (loaderView) {
        loaderView.style.display = 'none';
        loaderView.style.minHeight = '';
      }

      renderBooks();

      if (booksGrid) {
        booksGrid.classList.remove('is-fading-in');
        void booksGrid.offsetWidth;
        booksGrid.classList.add('is-fading-in');
      }

      updateBrowserUrl();

      if (updateSidebarSticky) {
        updateSidebarSticky();
      }
    }, 8000);
  }

  // Сброс всех фильтров к исходному состоянию
  function resetAll() {
    clearLoadingTimers();
    isLoadingSelection = false;

    const resultsCol = document.querySelector('.gift-results-column');
    if (resultsCol) {
      resultsCol.style.minHeight = '';
    }

    if (btnSubmit) btnSubmit.classList.remove('is-busy');
    if (loaderView) {
      loaderView.style.display = 'none';
      loaderView.style.minHeight = '';
    }

    state.priceMin = 5000;
    state.priceMax = 29000;
    state.occasion = 'all';
    state.statusRelation = 'higher';
    state.gender = 'all';

    updateSliderVisuals();

    document.querySelectorAll('.gift-option-row').forEach(row => {
      const input = row.querySelector('input[type="radio"]');
      if (!input) return;
      if (input.name === 'giftOccasion') {
        const check = input.value === 'all';
        input.checked = check;
        row.classList.toggle('is-selected', check);
      } else if (input.name === 'giftStatus') {
        const check = input.value === 'higher';
        input.checked = check;
        row.classList.toggle('is-selected', check);
      } else if (input.name === 'giftGender') {
        const check = input.value === 'all';
        input.checked = check;
        row.classList.toggle('is-selected', check);
      }
    });

    renderBooks();
    updateBrowserUrl();
    scrollToCatalogTop();

    if (updateSidebarSticky) {
      updateSidebarSticky();
    }
  }

  // Чтение URL параметров при открытии страницы
  function loadStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('min')) {
      const min = parseInt(params.get('min'), 10);
      if (!isNaN(min) && min >= PRICE_LIMITS.min) state.priceMin = min;
    }
    if (params.has('max')) {
      const max = parseInt(params.get('max'), 10);
      if (!isNaN(max) && max <= PRICE_LIMITS.max) state.priceMax = max;
    }
    if (params.has('occasion')) state.occasion = params.get('occasion');
    if (params.has('status')) state.statusRelation = params.get('status');
    if (params.has('gender')) state.gender = params.get('gender');
  }

  function syncRadioUI() {
    document.querySelectorAll('.gift-option-row').forEach(row => {
      const input = row.querySelector('input[type="radio"]');
      if (!input) return;
      let check = false;
      if (input.name === 'giftOccasion' && input.value === state.occasion) check = true;
      if (input.name === 'giftStatus' && input.value === state.statusRelation) check = true;
      if (input.name === 'giftGender' && input.value === state.gender) check = true;
      input.checked = check;
      row.classList.toggle('is-selected', check);
    });
  }

  // Привязка событий
  function attachEvents() {
    // 1. Слайдер (обновляет интерфейс, книги меняются по нажатию «Запустить подборку»)
    if (rangeMin) {
      rangeMin.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        if (val > state.priceMax - 1000) val = state.priceMax - 1000;
        state.priceMin = Math.max(PRICE_LIMITS.min, val);
        updateSliderVisuals();
      });
    }

    if (rangeMax) {
      rangeMax.addEventListener('input', (e) => {
        let val = parseInt(e.target.value, 10);
        if (val < state.priceMin + 1000) val = state.priceMin + 1000;
        state.priceMax = Math.min(PRICE_LIMITS.max, val);
        updateSliderVisuals();
      });
    }

    // 2. Ввод цен вручную
    const parseNum = (str) => parseInt(str.replace(/\D/g, ''), 10) || 0;

    if (priceMinInput) {
      priceMinInput.addEventListener('change', (e) => {
        let val = parseNum(e.target.value);
        val = Math.max(PRICE_LIMITS.min, Math.min(val, state.priceMax - 500));
        state.priceMin = val;
        updateSliderVisuals();
      });
    }

    if (priceMaxInput) {
      priceMaxInput.addEventListener('change', (e) => {
        let val = parseNum(e.target.value);
        val = Math.min(PRICE_LIMITS.max, Math.max(val, state.priceMin + 500));
        state.priceMax = val;
        updateSliderVisuals();
      });
    }

    // 3. Радио-опции (повод, статус, пол)
    document.querySelectorAll('.gift-option-row').forEach(row => {
      row.addEventListener('click', () => {
        const input = row.querySelector('input[type="radio"]');
        if (!input) return;
        input.checked = true;

        const name = input.name;
        document.querySelectorAll(`input[name="${name}"]`).forEach(inp => {
          const parent = inp.closest('.gift-option-row');
          if (parent) parent.classList.toggle('is-selected', inp.checked);
        });

        if (name === 'giftOccasion') state.occasion = input.value;
        if (name === 'giftStatus') state.statusRelation = input.value;
        if (name === 'giftGender') state.gender = input.value;
      });
    });

    // 4. Клик по карточке и сердечку
    if (booksGrid) {
      booksGrid.addEventListener('click', (e) => {
        const heartBtn = e.target.closest('.book-like-mobile');
        if (heartBtn) {
          e.stopPropagation();
          const id = parseInt(heartBtn.dataset.id, 10);
          toggleFavorite(id);
          return;
        }

        const card = e.target.closest('.book-card');
        if (card) {
          const id = parseInt(card.dataset.id, 10);
          if (!isNaN(id)) {
            window.location.href = `./books/${bookPagePaths[id - 1]}.html`;
          }
        }
      });
    }

    // 5. Кнопки сброса и запуска подборки
    const submitBtn = document.getElementById('giftBtnSubmit') || btnSubmit;
    if (submitBtn) submitBtn.addEventListener('click', startSelection);

    const btnReset = document.getElementById('giftBtnReset');
    if (btnReset) btnReset.addEventListener('click', resetAll);

    // 6. Мобильное меню / сайдбар в точности как в каталоге
    const logoBtn = document.getElementById('logoBtn') || document.getElementById('sectionMenuButton');
    const profileSidebar = document.getElementById('profileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarProfileBtn = document.getElementById('sidebarProfileBtn');

    if (logoBtn && profileSidebar && sidebarOverlay) {
      logoBtn.addEventListener('click', () => {
        profileSidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
      });
    }
    if (sidebarProfileBtn && profileSidebar && sidebarOverlay) {
      sidebarProfileBtn.addEventListener('click', () => {
        profileSidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
      });
    }
    if (sidebarOverlay && profileSidebar) {
      sidebarOverlay.addEventListener('click', () => {
        profileSidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && profileSidebar && profileSidebar.classList.contains('open')) {
        profileSidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
      }
    });
  }

  // 7. Интеллектуальный двунаправленный sticky-скролл для левой колонки (фильтры)
  let updateSidebarSticky = null;

  function initStickySidebar() {
    const sidebar = document.querySelector('.gift-sidebar');
    const layout = document.querySelector('.gift-layout');
    if (!sidebar || !layout) return;

    let currentY = 0;
    let lastScrollY = window.scrollY;
    let ticking = false;

    const topSpacing = 20;    // отступ сверху при скролле вверх (к блоку Бюджет)
    const bottomSpacing = 24; // отступ снизу при скролле вниз (видны кнопки)

    function updateSidebarPosition() {
      if (window.innerWidth <= 1180) {
        sidebar.style.transform = '';
        currentY = 0;
        lastScrollY = window.scrollY;
        ticking = false;
        return;
      }

      const scrollY = window.scrollY;
      const scrollDiff = scrollY - lastScrollY;
      const windowHeight = window.innerHeight;
      const sidebarHeight = sidebar.offsetHeight;
      const layoutRect = layout.getBoundingClientRect();
      const layoutAbsoluteTop = scrollY + layoutRect.top;
      const maxTranslate = Math.max(0, layout.offsetHeight - sidebarHeight);

      // Жёсткая фиксация сайдбара по низу экрана (вид скриншота 2) без паразитного люфта и шатания
      const targetY = scrollY + windowHeight - bottomSpacing - layoutAbsoluteTop - sidebarHeight;
      currentY = Math.max(0, Math.min(targetY, maxTranslate));

      sidebar.style.transform = `translate3d(0, ${currentY}px, 0)`;
      lastScrollY = scrollY;
      ticking = false;
    }

    updateSidebarSticky = updateSidebarPosition;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateSidebarPosition);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateSidebarPosition);
    updateSidebarPosition();
  }

  // Плавный элитный автоскролл к каталогу при первом открытии страницы
  function autoScrollToCatalog() {
    if (window.innerWidth <= 1180) return;
    if (window.scrollY > 40) return;

    const layout = document.querySelector('.gift-layout');
    if (!layout) return;

    let userScrolled = false;
    const onUserScroll = () => { userScrolled = true; };
    window.addEventListener('wheel', onUserScroll, { once: true, passive: true });
    window.addEventListener('touchmove', onUserScroll, { once: true, passive: true });

    setTimeout(() => {
      window.removeEventListener('wheel', onUserScroll);
      window.removeEventListener('touchmove', onUserScroll);

      if (userScrolled || window.scrollY > 40) return;

      const layoutRect = layout.getBoundingClientRect();
      const targetY = Math.max(0, layoutRect.top + window.scrollY - 20);
      const startY = window.scrollY;
      const distance = targetY - startY;
      if (distance <= 0) return;

      const duration = 950; // медленный, плавный проезд почти в секунду
      let startTime = null;

      // Синусоидальная кривая: постоянное, бархатное скольжение без рывков и ускорений в середине
      function smoothGlide(t) {
        return -(Math.cos(Math.PI * t) - 1) / 2;
      }

      function step(timestamp) {
        if (userScrolled) return;
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = smoothGlide(progress);

        window.scrollTo(0, startY + distance * ease);

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      }

      window.requestAnimationFrame(step);
    }, 100); // минимальная задержка (100 мс) — движение начинается сразу, без лишнего ожидания
  }

  function init() {
    initDOMElements();
    loadStateFromUrl();
    syncRadioUI();
    updateSliderVisuals();
    attachEvents();
    renderBooks();
    initStickySidebar();
    autoScrollToCatalog();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
