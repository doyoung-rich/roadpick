const mobileMenu = document.querySelector('.mobile-menu');
mobileMenu?.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    mobileMenu.open = false;
    mobileMenu.querySelector('summary').focus();
  }
});
document.addEventListener('click', event => {
  if (mobileMenu?.open && !mobileMenu.contains(event.target)) mobileMenu.open = false;
});
