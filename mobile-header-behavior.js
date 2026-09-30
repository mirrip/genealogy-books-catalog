(() => {
  const brand = document.querySelector('.catalog-brand, .brand');
  const menuButton = document.querySelector('#homeMenuButton, #logoBtn, #sectionMenuButton');

  if (!brand || !menuButton) return;

  const usesMobileHeader = () => window.getComputedStyle(menuButton).display !== 'none';

  brand.addEventListener('click', (event) => {
    if (!usesMobileHeader()) return;
    event.preventDefault();
    window.location.reload();
  });
})();
