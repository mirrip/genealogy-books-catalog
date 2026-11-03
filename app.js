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

function autoScrollHomeHeaderOnDesktopEntry() {
  if (window.innerWidth <= 1180) return;
  if (window.scrollY > 40) return;

  const header = document.querySelector(".header");
  if (!header) return;

  let userScrolled = false;
  const onUserScroll = () => { userScrolled = true; };
  window.addEventListener("wheel", onUserScroll, { once: true, passive: true });
  window.addEventListener("touchmove", onUserScroll, { once: true, passive: true });

  setTimeout(() => {
    window.removeEventListener("wheel", onUserScroll);
    window.removeEventListener("touchmove", onUserScroll);

    if (userScrolled || window.scrollY > 40) return;

    const targetY = header.offsetHeight;
    const startY = window.scrollY;
    const distance = targetY - startY;
    if (distance <= 0) return;

    const duration = 950;
    let startTime = null;

    function smoothGlide(progress) {
      return -(Math.cos(Math.PI * progress) - 1) / 2;
    }

    function step(timestamp) {
      if (userScrolled) return;
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * smoothGlide(progress));

      if (progress < 1) window.requestAnimationFrame(step);
    }

    window.requestAnimationFrame(step);
  }, 100);
}

autoScrollHomeHeaderOnDesktopEntry();

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
