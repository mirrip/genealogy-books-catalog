const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileLayout = window.matchMedia("(max-width: 760px)");
const heroSlides = [...document.querySelectorAll(".hero__slide")];
const heroProgress = document.querySelector(".hero__progress");
const progressItems = [...document.querySelectorAll(".hero__progress i")];
const revealItems = document.querySelectorAll(".reveal");
const mobileDock = document.querySelector(".mobile-dock");
const homeMenuButton = document.querySelector("#homeMenuButton");
const mobileMenuButton = document.querySelector("#mobileMenuButton");
const homeMenuDrawer = document.querySelector("#homeMenuDrawer");
const homeMenuClose = document.querySelector("#homeMenuClose");
const homeMenuOverlay = document.querySelector("#homeMenuOverlay");
const HERO_SLIDE_INTERVAL = 9000;
const HERO_TRANSITION_DURATION = 760;

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
mobileMenuButton?.addEventListener("click", () => setHomeMenu(true));
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

if (heroSlides.length > 0) {
  let activeHeroSlide = Math.max(
    0,
    heroSlides.findIndex((slide) => slide.classList.contains("is-active"))
  );
  let heroSlideTimer = 0;
  let heroTransitionTimer = 0;
  const setHeroFrameDuration = (slide, duration) => {
    slide.style.setProperty("--hero-slide-duration", `${duration}ms`);
  };

  const updateHeroProgress = () => {
    for (const [index, item] of progressItems.entries()) {
      item.classList.toggle("is-active", index === activeHeroSlide);
    }

    heroProgress?.setAttribute(
      "aria-label",
      `Слайд ${activeHeroSlide + 1} из ${heroSlides.length}`
    );
  };

  const resetHeroCarousel = () => {
    window.clearTimeout(heroTransitionTimer);
    activeHeroSlide = 0;

    for (const [index, slide] of heroSlides.entries()) {
      const isFirstSlide = index === 0;
      slide.classList.toggle("is-active", isFirstSlide);
      slide.classList.remove("is-leaving");
      slide.setAttribute("aria-hidden", String(!isFirstSlide));
    }

    setHeroFrameDuration(heroSlides[0], HERO_SLIDE_INTERVAL);
    updateHeroProgress();
  };

  const showHeroSlide = (nextIndex) => {
    if (nextIndex === activeHeroSlide) return;

    const currentSlide = heroSlides[activeHeroSlide];
    const nextSlide = heroSlides[nextIndex];

    window.clearTimeout(heroTransitionTimer);
    nextSlide.classList.remove("is-leaving");
    nextSlide.setAttribute("aria-hidden", "false");

    // Keep the incoming frame at its right-side starting position before animating it.
    void nextSlide.offsetWidth;

    currentSlide.classList.remove("is-active");
    currentSlide.classList.add("is-leaving");
    nextSlide.classList.add("is-active");
    activeHeroSlide = nextIndex;
    updateHeroProgress();

    heroTransitionTimer = window.setTimeout(() => {
      currentSlide.classList.remove("is-leaving");
      currentSlide.setAttribute("aria-hidden", "true");
    }, HERO_TRANSITION_DURATION);
  };

  const stopHeroCarousel = () => {
    window.clearTimeout(heroSlideTimer);
    heroSlideTimer = 0;
  };

  const scheduleHeroCarousel = () => {
    stopHeroCarousel();
    if (document.hidden || heroSlides.length < 2) return;

    const frameDuration = HERO_SLIDE_INTERVAL;
    setHeroFrameDuration(heroSlides[activeHeroSlide], frameDuration);

    heroSlideTimer = window.setTimeout(() => {
      const nextIndex = (activeHeroSlide + 1) % heroSlides.length;
      setHeroFrameDuration(heroSlides[nextIndex], HERO_SLIDE_INTERVAL);
      showHeroSlide(nextIndex);
      scheduleHeroCarousel();
    }, frameDuration);
  };

  updateHeroProgress();
  scheduleHeroCarousel();

  document.addEventListener("visibilitychange", scheduleHeroCarousel);
  reduceMotion.addEventListener("change", () => {
    stopHeroCarousel();
    scheduleHeroCarousel();
  });
}

for (const item of revealItems) item.classList.add("is-visible");

if (mobileDock) {
  let scrollFrame = 0;
  let lastScrollY = window.scrollY;

  const setDockHidden = (hidden) => {
    mobileDock.classList.toggle("is-hidden", hidden);
    mobileDock.toggleAttribute("inert", hidden);
    mobileDock.setAttribute("aria-hidden", String(hidden));
  };

  const updateMobileDock = () => {
    const currentScrollY = window.scrollY;
    const movedDown = currentScrollY > lastScrollY + 2;
    const nearTop = currentScrollY < 180;
    const shouldHide = !mobileLayout.matches || nearTop || movedDown;

    setDockHidden(shouldHide);
    lastScrollY = currentScrollY;
  };

  updateMobileDock();

  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;

      scrollFrame = window.requestAnimationFrame(() => {
        updateMobileDock();
        scrollFrame = 0;
      });
    },
    { passive: true }
  );

  mobileLayout.addEventListener("change", updateMobileDock);
}
