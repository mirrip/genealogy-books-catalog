(() => {
  const track = document.querySelector('.trust-foundations');
  if (!track) return;
  const cards = [...track.children];
  const mobile = window.matchMedia('(max-width: 760px)');
  let cleanup = null;

  function activate() {
    let active = 0;
    let destination = null;
    let timer;
    let settleTimer;
    let visible = false;
    let touching = false;
    let disposed = false;
    const clones = [cards.at(-1).cloneNode(true), cards[0].cloneNode(true)];
    for (const clone of clones) {
      clone.classList.remove('home-trust-enter', 'is-enter-pending');
      clone.setAttribute('aria-hidden', 'true');
      clone.inert = true;
    }
    track.prepend(clones[0]);
    track.append(clones[1]);
    track.classList.add('is-mobile-carousel');
    const slides = [...track.children];
    const indicator = document.createElement('div');
    indicator.className = 'trust-carousel-indicator';
    indicator.setAttribute('role', 'group');
    indicator.setAttribute('aria-label', 'Карточки об исследовании рода');
    const buttons = cards.map((card, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', card.querySelector('h2').textContent);
      button.addEventListener('click', () => go(index + 1, true));
      indicator.append(button);
      return button;
    });
    track.after(indicator);
    const position = index => slides[index].getBoundingClientRect().left
      - track.getBoundingClientRect().left + track.scrollLeft;
    const paint = () => buttons.forEach((button, index) => {
      button.setAttribute('aria-current', String(index === active));
    });
    function schedule() {
      clearTimeout(timer);
      if (!visible || touching || document.hidden || disposed) return;
      timer = setTimeout(() => go(active + 2, true), 8000);
    }
    function go(index, smooth) {
      clearTimeout(timer);
      destination = index;
      active = (index - 1 + cards.length) % cards.length;
      paint();
      track.scrollTo({
        left: position(index),
        behavior: smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'smooth' : 'auto'
      });
    }
    const nearestSlide = () => slides.reduce((best, slide, index) =>
        Math.abs(position(index) - track.scrollLeft) < Math.abs(position(best) - track.scrollLeft)
          ? index : best, 0);
    function settle() {
      if (disposed || touching) return;
      let nearest = nearestSlide();
      if (nearest === 0) {
        nearest = cards.length;
        go(nearest, false);
      } else if (nearest === slides.length - 1) {
        nearest = 1;
        go(nearest, false);
      }
      active = nearest - 1;
      destination = null;
      paint();
      schedule();
    }
    const onScroll = () => {
      clearTimeout(timer);
      if (destination === null) {
        active = (nearestSlide() - 1 + cards.length) % cards.length;
        paint();
      }
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 180);
    };
    const onDown = () => { touching = true; destination = null; clearTimeout(timer); };
    const onUp = () => { touching = false; settle(); };
    track.addEventListener('scroll', onScroll, { passive: true });
    track.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    document.addEventListener('visibilitychange', schedule);
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .25;
      schedule();
    }, { threshold: [0, .25] });
    observer.observe(track);
    const resize = new ResizeObserver(() => go(active + 1, false));
    resize.observe(track);
    paint();
    requestAnimationFrame(() => { if (!disposed) go(1, false); });
    return () => {
      disposed = true;
      clearTimeout(timer);
      clearTimeout(settleTimer);
      observer.disconnect();
      resize.disconnect();
      track.removeEventListener('scroll', onScroll);
      track.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      document.removeEventListener('visibilitychange', schedule);
      indicator.remove();
      clones.forEach(clone => clone.remove());
      track.classList.remove('is-mobile-carousel');
      track.scrollLeft = 0;
    };
  }
  function update() {
    if (cleanup) cleanup();
    cleanup = mobile.matches ? activate() : null;
  }
  mobile.addEventListener('change', update);
  update();
})();
