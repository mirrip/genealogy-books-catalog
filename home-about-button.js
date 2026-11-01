(() => {
  const button = document.querySelector('.home-project-intro__about');
  const arrow = button?.querySelector('svg');
  if (!arrow) return;
  const mobile = matchMedia('(max-width: 760px)');
  function positionArrow() {
    button.style.removeProperty('--about-arrow-mobile-shift');
    if (!mobile.matches) return;
    const baseline = new DOMMatrixReadOnly(getComputedStyle(arrow).transform).m41;
    const gap = button.getBoundingClientRect().right
      - arrow.querySelector('path').getBoundingClientRect().right;
    button.style.setProperty('--about-arrow-mobile-shift', `${baseline + gap / 2}px`);
  }
  new ResizeObserver(positionArrow).observe(button);
  mobile.addEventListener('change', positionArrow);
  document.fonts.ready.then(positionArrow);
  positionArrow();
})();
