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

// Join the desktop hero wave to the lower canvas in actual CSS pixels.
(() => {
  const hero = document.querySelector(".hero");
  const surface = document.querySelector(".hero__dark-surface");
  const lower = document.querySelector(".lower-night");
  if (!hero || !surface || !lower) return;
  const desktop = window.matchMedia("(min-width: 761px)");
  const svgMask = (width, height, path) => `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><path fill="black" d="${path}"/></svg>`
  )}")`;
  const updateWave = () => {
    if (!desktop.matches) {
      hero.style.removeProperty("--hero-wave-mask");
      lower.style.removeProperty("--lower-wave-mask");
      lower.style.removeProperty("--lower-wave-paint");
      hero.style.removeProperty("--hero-wave-line");
      return;
    }
    const width = surface.clientWidth;
    const height = hero.clientHeight;
    const lowerWidth = lower.clientWidth;
    const lowerHeight = lower.clientHeight;
    const x = value => (width * value / 1000).toFixed(2);
    const y = value => (height * value / 1000).toFixed(2);
    // Keep the upper contour, turn at 200px, and meet the next block at 240px.
    const edge = `M0 0H${width}C${x(985)} ${y(70)} ${x(910)} ${y(130)} ${x(845)} ${y(225)}S${x(805)} ${y(470)} ${x(755)} ${y(595)}S${x(535)} ${y(825)} ${Math.max(330, width * .36)} ${y(900)}C260 ${y(940)} 200 ${y(945)} 200 ${y(970)}C200 ${y(985)} 220 ${y(995)} 240 ${height}H0Z`;
    hero.style.setProperty("--hero-wave-mask", svgMask(width, height, edge));
    const paint = (w, h, path, fill) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path d="${path}" fill="${fill}" stroke="#b98243" stroke-opacity=".28" stroke-width="1.2"/></svg>`)}")`;
    hero.style.setProperty("--hero-wave-line", paint(width, height, edge.split("H0Z")[0].replace(`M0 0H${width}`, `M${width} 0`), "none"));
    hero.style.setProperty("--hero-wave-width", `${width}px`);
    // The same starting position and tangent prevent a break between blocks.
    const continuation = `M0 0H240C320 ${height * .02} ${lowerWidth * .65} ${lowerHeight * .12} ${lowerWidth * .62} ${lowerHeight * .3}S${lowerWidth * .22} ${lowerHeight * .61} ${lowerWidth * .4} ${lowerHeight * .8}S${lowerWidth * .62} ${lowerHeight * .94} ${lowerWidth * .5} ${lowerHeight}H0Z`;
    lower.style.setProperty("--lower-wave-mask", svgMask(lowerWidth, lowerHeight, continuation));
    lower.style.setProperty("--lower-wave-paint", paint(lowerWidth, lowerHeight, continuation, "#100503"));
  };
  updateWave();
  const observer = new ResizeObserver(updateWave);
  observer.observe(hero);
  observer.observe(lower);
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
