const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealItems = document.querySelectorAll(".reveal");
const homeMenuButton = document.querySelector("#homeMenuButton");
const homeMenuDrawer = document.querySelector("#homeMenuDrawer");
const homeMenuClose = document.querySelector("#homeMenuClose");
const homeMenuOverlay = document.querySelector("#homeMenuOverlay");

function setHomeMenu(open) {
  if (!homeMenuDrawer || !homeMenuOverlay) return;

  homeMenuDrawer.classList.toggle("is-open", open);
  homeMenuOverlay.classList.toggle("is-open", open);
  homeMenuDrawer.setAttribute("aria-hidden", String(!open));
  homeMenuButton?.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("home-menu-open", open);

  if (open) homeMenuClose?.focus();
  else homeMenuButton?.focus({ preventScroll: true });
}

homeMenuButton?.addEventListener("click", () => setHomeMenu(true));
homeMenuClose?.addEventListener("click", () => setHomeMenu(false));
homeMenuOverlay?.addEventListener("click", () => setHomeMenu(false));
document.querySelectorAll("[data-home-menu-close]").forEach((link) => {
  link.addEventListener("click", () => setHomeMenu(false));
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && homeMenuDrawer?.classList.contains("is-open")) {
    setHomeMenu(false);
  }
});

for (const item of revealItems) item.classList.add("is-visible");

const homeTrustCards = [...document.querySelectorAll(".home-trust-enter")];

if (homeTrustCards.length > 0) {
  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    for (const card of homeTrustCards) card.classList.add("is-entered");
  } else {
    for (const card of homeTrustCards) card.classList.add("is-enter-pending");

    const trustCardObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove("is-enter-pending");
        entry.target.classList.add("is-entered");
        observer.unobserve(entry.target);
      }
    }, {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.1
    });

    for (const card of homeTrustCards) trustCardObserver.observe(card);
  }
}
