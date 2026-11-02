(() => {
  const section = document.querySelector('.home-directions');
  const assistant = document.querySelector('.home-assistant-visual');
  if (!section || !assistant) return;

  const viewport = section.querySelector('.home-directions__viewport');
  const group = section.querySelector('.home-directions__group');
  const mobile = matchMedia('(max-width: 760px)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const originalLinks = [...group.querySelectorAll('a')];
  const duplicate = () => {
    const copy = group.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('a').forEach(link => link.tabIndex = -1);
    return copy;
  };
  viewport.prepend(duplicate());
  viewport.append(duplicate());

  let span = 0;
  let position = 0;
  let visible = false;
  let hovering = false;
  let touching = false;
  let focused = false;
  let resumeAt = 0;
  let lastTime = 0;
  let frame = 0;

  function place() {
    if (mobile.matches) assistant.after(section);
    else assistant.before(section);
  }

  function measure() {
    const nextSpan = group.getBoundingClientRect().width;
    if (!nextSpan) return;
    const progress = span ? ((viewport.scrollLeft % span) + span) % span / span : 0;
    span = nextSpan;
    position = span + progress * span;
    viewport.scrollLeft = position;
  }

  function normalize() {
    if (!span) return;
    const current = viewport.scrollLeft;
    if (current < span * .5 || current >= span * 2) {
      viewport.scrollLeft = span + ((current % span) + span) % span;
    }
    if (touching || hovering || focused || performance.now() < resumeAt) position = viewport.scrollLeft;
  }

  function tick(now) {
    frame = 0;
    const delta = lastTime ? Math.min(now - lastTime, 50) : 0;
    lastTime = now;
    if (!hovering && !touching && !focused && now >= resumeAt && span) {
      position += delta * .014;
      if (position >= span * 2) position -= span;
      viewport.scrollLeft = position;
    }
    if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(tick);
  }

  function updateMotion() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(tick);
  }

  viewport.addEventListener('pointerenter', event => { hovering = event.pointerType === 'mouse'; });
  viewport.addEventListener('pointerleave', () => { hovering = false; });
  viewport.addEventListener('pointerdown', () => { touching = true; });
  const release = () => {
    if (!touching) return;
    touching = false;
    resumeAt = performance.now() + 3000;
    normalize();
  };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  viewport.addEventListener('wheel', () => { resumeAt = performance.now() + 3000; }, { passive: true });
  viewport.addEventListener('scroll', normalize, { passive: true });
  viewport.addEventListener('focusin', () => { focused = true; });
  viewport.addEventListener('focusout', event => { focused = viewport.contains(event.relatedTarget); });
  // Keep keyboard navigation on the real cards, rather than their visual copies.
  originalLinks.forEach(link => link.addEventListener('focus', () => {
    link.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' });
  }));
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
