const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const mobileLayout = window.matchMedia("(max-width: 760px)");
const hero = document.querySelector(".hero");
const cards = document.querySelectorAll(".memory-card");
const heroSlides = [...document.querySelectorAll(".hero__slide")];
const heroProgress = document.querySelector(".hero__progress");
const progressItems = [...document.querySelectorAll(".hero__progress i")];
const revealItems = document.querySelectorAll(".reveal");
const mobileDock = document.querySelector(".mobile-dock");
const HERO_SLIDE_INTERVAL = 9000;
const HERO_TRANSITION_DURATION = 760;

function addFrameLimitedPointerEffect(element, update) {
  let frame = 0;
  let latestEvent;

  element.addEventListener(
    "pointermove",
    (event) => {
      latestEvent = event;
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update(latestEvent);
      });
    },
    { passive: true }
  );
}

if (!reduceMotion.matches && finePointer.matches) {
  if (hero) {
    addFrameLimitedPointerEffect(hero, (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 100;
      const y = ((event.clientY - bounds.top) / bounds.height) * 100;

      hero.style.setProperty("--glow-x", `${Math.max(8, Math.min(58, x))}%`);
      hero.style.setProperty("--glow-y", `${Math.max(12, Math.min(88, y))}%`);
    });
  }

  for (const card of cards) {
    addFrameLimitedPointerEffect(card, (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;

      card.style.setProperty("--card-rx", `${(0.5 - y) * 2.4}deg`);
      card.style.setProperty("--card-ry", `${(x - 0.5) * 2.4}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--card-rx");
      card.style.removeProperty("--card-ry");
    });
  }
}

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

if (
  "IntersectionObserver" in window &&
  !reduceMotion.matches &&
  !mobileLayout.matches
) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.08 }
  );

  for (const item of revealItems) observer.observe(item);
} else {
  for (const item of revealItems) item.classList.add("is-visible");
}

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
