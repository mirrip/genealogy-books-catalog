const readStored = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

let profileUser = readStored("currentUser", null);
const profileCart = readStored("cart", []);
const profileFavorites = readStored("favorites", []);
const profileOrders = readStored("orderHistory", []);

const profileForm = document.querySelector("#profileForm");
const initialsInput = document.querySelector("#profileInitials");
const phoneInput = document.querySelector("#profilePhone");
const usernameInput = document.querySelector("#profileUsername");
const profileAvatar = document.querySelector("#profileAvatar");
const profileFormError = document.querySelector("#profileFormError");
const profileToast = document.querySelector("#profileToast");

const getInitials = (value) => {
  const parts = String(value || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "Г";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
};

const formatPrice = (value) => `${Number(value || 0).toLocaleString("ru-RU")} ₽`;

const showToast = (message) => {
  if (!profileToast) return;
  profileToast.textContent = message;
  profileToast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => profileToast.classList.remove("is-visible"), 2600);
};

const setCount = (selector, count) => {
  const element = document.querySelector(selector);
  if (element) element.textContent = String(count);
};

const setHeaderBadge = (selector, count) => {
  const badge = document.querySelector(selector);
  if (!badge) return;
  badge.textContent = String(count);
  badge.hidden = count === 0;
};

const fillProfile = () => {
  const name = profileUser?.fullName || "";
  initialsInput.value = name;
  phoneInput.value = profileUser?.phone || "";
  usernameInput.value = profileUser?.telegram || "";
  profileAvatar.textContent = getInitials(name);
};

const updateSummary = () => {
  const cartCount = profileCart.reduce((total, item) => total + Number(item.quantity || 1), 0);
  const cartTotal = profileCart.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 1), 0);
  setCount("#favoritesCount", profileFavorites.length);
  setCount("#cartCount", cartCount);
  setCount("#ordersCount", profileOrders.length);
  setCount("#ordersPanelCount", profileOrders.length);
  setHeaderBadge("#headerFavoritesCount", profileFavorites.length);
  setHeaderBadge("#headerCartCount", cartCount);
  const summary = document.querySelector("#cartSummary");
  if (summary) summary.textContent = cartCount ? `${cartCount} шт. · ${formatPrice(cartTotal)}` : "Пока пусто";
};

const renderOrders = () => {
  const list = document.querySelector("#ordersList");
  const empty = document.querySelector("#ordersEmpty");
  if (!list || !empty) return;
  list.replaceChildren();
  empty.hidden = profileOrders.length > 0;

  profileOrders.forEach((order, index) => {
    const row = document.createElement("article");
    row.className = "order-row";

    const main = document.createElement("div");
    main.className = "order-row__main";
    const title = document.createElement("strong");
    title.textContent = `Заказ №${profileOrders.length - index}`;
    const details = document.createElement("small");
    const itemCount = Array.isArray(order.items)
      ? order.items.reduce((total, item) => total + Number(item.quantity || 1), 0)
      : 0;
    details.textContent = `${order.date || "Дата не указана"} · ${itemCount} ${itemCount === 1 ? "позиция" : "позиций"}`;
    main.append(title, details);

    const total = document.createElement("span");
    total.className = "order-row__total";
    total.textContent = formatPrice(order.total);
    row.append(main, total);
    list.append(row);
  });
};

profileForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const fullName = initialsInput.value.trim();
  const phone = phoneInput.value.trim();
  const telegram = usernameInput.value.trim();
  const phoneDigits = phone.replace(/\D/g, "");

  if (!fullName) {
    profileFormError.textContent = "Укажите имя или инициалы.";
    profileFormError.hidden = false;
    initialsInput.focus();
    return;
  }

  if (phone && (phoneDigits.length < 10 || phoneDigits.length > 11)) {
    profileFormError.textContent = "Проверьте номер телефона: необходимо 10 или 11 цифр.";
    profileFormError.hidden = false;
    phoneInput.focus();
    return;
  }

  profileFormError.hidden = true;
  profileUser = {
    ...(profileUser || {}),
    fullName,
    phone,
    telegram,
    lastUpdated: new Date().toISOString(),
  };
  localStorage.setItem("currentUser", JSON.stringify(profileUser));
  profileAvatar.textContent = getInitials(fullName);
  showToast("Изменения сохранены");
});

initialsInput?.addEventListener("input", () => {
  profileAvatar.textContent = getInitials(initialsInput.value);
});

document.querySelectorAll(".profile-faq__item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".profile-faq__item");
    const open = !item.classList.contains("is-open");
    item.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
  });
});

fillProfile();
updateSummary();
renderOrders();
