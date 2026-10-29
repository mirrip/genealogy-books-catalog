const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileHeroLayout = window.matchMedia("(max-width: 760px)");
const heroSlideElements = [...document.querySelectorAll(".hero__slide")];
const heroSlides = mobileHeroLayout.matches
  ? [0, 3, 4, 1, 2].map((index) => heroSlideElements[index])
  : heroSlideElements;
const heroProgress = document.querySelector(".hero__progress");
const progressItems = [...document.querySelectorAll(".hero__progress i")];
const revealItems = document.querySelectorAll(".reveal");
const homeMenuButton = document.querySelector("#homeMenuButton");
const homeMenuDrawer = document.querySelector("#homeMenuDrawer");
const homeMenuClose = document.querySelector("#homeMenuClose");
const homeMenuOverlay = document.querySelector("#homeMenuOverlay");
const HERO_SLIDE_INTERVAL = 9000;
const HERO_INITIAL_OFFSET = 5000;
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

if (heroSlides.length > 0) {
  let activeHeroSlide = Math.max(
    0,
    heroSlides.findIndex((slide) => slide.classList.contains("is-active"))
  );
  let heroSlideTimer = 0;
  let heroTransitionTimer = 0;
  let isInitialHeroFrame = true;
  const initialHeroDeadline = performance.now() + (HERO_SLIDE_INTERVAL - HERO_INITIAL_OFFSET);
  const setHeroFrameTiming = (slide, duration, delay = 0) => {
    slide.style.setProperty("--hero-slide-duration", `${duration}ms`);
    slide.style.setProperty("--hero-slide-delay", `${delay}ms`);
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

    setHeroFrameTiming(heroSlides[0], HERO_SLIDE_INTERVAL, -HERO_INITIAL_OFFSET);
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

    const frameDuration = isInitialHeroFrame
      ? Math.max(0, initialHeroDeadline - performance.now())
      : HERO_SLIDE_INTERVAL;

    setHeroFrameTiming(
      heroSlides[activeHeroSlide],
      HERO_SLIDE_INTERVAL,
      isInitialHeroFrame ? -HERO_INITIAL_OFFSET : 0
    );

    heroSlideTimer = window.setTimeout(() => {
      isInitialHeroFrame = false;
      const nextIndex = (activeHeroSlide + 1) % heroSlides.length;
      setHeroFrameTiming(heroSlides[nextIndex], HERO_SLIDE_INTERVAL);
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

// One continuous contour, cropped into the hero and the lower canvas.
(() => {
  const hero = document.querySelector(".hero");
  const surface = document.querySelector(".hero__dark-surface");
  const lower = document.querySelector(".lower-night");
  const cards = document.querySelector(".trust-foundations");
  if (!hero || !surface || !lower || !cards) return;
  const desktop = window.matchMedia("(min-width: 761px)");
  const image = (viewBox, content) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="none">${content}</svg>`)}")`;
  const updateWave = () => {
    if (!desktop.matches) {
      for (const key of ["--hero-wave-mask", "--hero-wave-line", "--hero-wave-width"]) hero.style.removeProperty(key);
      lower.style.removeProperty("--lower-wave-paint");
      return;
    }
    const w = surface.clientWidth;
    const h = hero.clientHeight;
    const fullWidth = lower.clientWidth;
    const lowerHeight = lower.clientHeight;
    const cardHeight = Math.max(...[...cards.children].map(card => card.offsetHeight));
    const turnY = h + cards.offsetTop + cards.offsetHeight;
    const minX = Math.min(200, fullWidth * .24);
    const maxX = Math.min(fullWidth * .48, minX + 220);
    const lobeHeight = cardHeight * 1.75;
    let contour = `M${w} 0C${w * .98} ${h * .12} ${w * .8} ${h * .2} ${w * .8} ${h * .4}C${w * .8} ${h * .66} ${minX} ${h * .87} ${minX} ${turnY}`;
    let currentY = turnY;
    let currentX = minX;
    while (currentY < h + lowerHeight) {
      const nextX = currentX === minX ? maxX : minX;
      const nextY = currentY + lobeHeight;
      // Vertical tangents at every extremum keep all sizes free of corners.
      contour += `C${currentX} ${currentY + lobeHeight / 2} ${nextX} ${nextY - lobeHeight / 2} ${nextX} ${nextY}`;
      currentY = nextY;
      currentX = nextX;
    }
    const area = `${contour}H0V0Z`;
    hero.style.setProperty("--hero-wave-mask", image(`0 0 ${w} ${h}`, `<path fill="black" d="${area}"/>`));
    hero.style.setProperty("--hero-wave-width", `${w}px`);
    const line = `<path d="${contour}" fill="none" stroke="#c69455" stroke-opacity=".32" stroke-width="1.2"/>`;
    hero.style.setProperty("--hero-wave-line", image(`0 0 ${w} ${h}`, line));
    const light = `<defs><linearGradient id="light" x1="0" y1="${h}" x2="0" y2="${h + cardHeight}" gradientUnits="userSpaceOnUse"><stop stop-color="#edbd79" stop-opacity="0"/><stop offset="1" stop-color="#edbd79" stop-opacity=".12"/></linearGradient></defs><path d="${area}" fill="url(#light)"/>${line}`;
    lower.style.setProperty("--lower-wave-paint", image(`0 ${h} ${fullWidth} ${lowerHeight}`, light));
  };
  updateWave();
  const observer = new ResizeObserver(updateWave);
  for (const element of [hero, lower, cards]) observer.observe(element);
  desktop.addEventListener("change", updateWave);
})();

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
