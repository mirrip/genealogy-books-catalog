(() => {
  const section = document.querySelector('.home-directions');
  const assistant = document.querySelector('.home-assistant-visual');
  if (!section || !assistant) return;

  const viewport = section.querySelector('.home-directions__viewport');
  const group = section.querySelector('.home-directions__group');
  const mobile = matchMedia('(max-width: 760px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const track = document.createElement('div');
  track.className = 'home-directions__track';
  viewport.append(track);
  track.append(group);
  const copy = group.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  copy.querySelectorAll('a').forEach(link => link.tabIndex = -1);
  track.append(copy);

  let animation;
  let duration = 0;
  let visible = false;

  function place() {
    assistant.before(section);
  }

  function updateMotion() {
    if (!animation) return;
    if (visible && !document.hidden && !reducedMotion.matches) animation.play();
    else animation.pause();
  }

  function measure() {
    const span = group.getBoundingClientRect().width;
    if (!span) return;
    const progress = animation && duration ? (Number(animation.currentTime) % duration) / duration : 0;
    animation?.cancel();
    duration = span / (mobile.matches ? 15.75 : 28) * 1000;
    // Animate one shared layer; hovering and touching never restart the movement.
    animation = track.animate([
      { transform: 'translate3d(0, 0, 0)' },
      { transform: `translate3d(${-span}px, 0, 0)` }
    ], { duration, iterations: Infinity, easing: 'linear' });
    animation.currentTime = progress * duration;
    updateMotion();
  }

  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    updateMotion();
  }).observe(viewport);
  new ResizeObserver(measure).observe(group);
  mobile.addEventListener('change', () => { place(); measure(); });
  reducedMotion.addEventListener('change', updateMotion);
  document.addEventListener('visibilitychange', updateMotion);
  place();
  measure();
})();
