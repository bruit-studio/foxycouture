window.theme.designMode = window.theme.designMode || {};
window.theme.designMode.selected = '';

document.addEventListener('shopify:section:select', (e) => {
  window.theme.designMode.selected = e.detail.sectionId;
});

document.addEventListener('shopify:section:deselect', () => {
  window.theme.designMode.selected = '';
});


/**
 * Slideshow management
 */

document.addEventListener('shopify:section:load', (e) => {
  if (!e.target.querySelector('.splide')) return;

  e.target.querySelectorAll('.splide').forEach((splideRoot) => {
    makeSlideshow(splideRoot);
  });
});

document.addEventListener('shopify:section:unload', (e) => {
  if (!e.target.querySelector('.splide')) return;

  e.target.querySelectorAll('.splide').forEach((splideRoot) => {
    destroySlideshow(splideRoot);
  });
});

document.addEventListener('shopify:block:select', (e) => {
  if (e.target.closest('.splide')) {
    const block = e.target,
      splideRoot = e.target.closest('.splide'),
      slideshowSplide = window.slideshows[splideRoot.id];

    const slideIndex = Array.from(
      block.closest('.splide__list').children
    ).indexOf(block);

    if (splideIsNotDestroyed(splideRoot)) {
      slideshowSplide.go(slideIndex);
    }
  }
});

/**
 * Product Sidebar management
 * Event "shopify:section:load" works in sections with "presets".
 */

const productSidebar = document.querySelector('[data-product-sidebar]');

if (productSidebar) {
  const productSidebarDialog = productSidebar.querySelector(
    '[data-product-sidebar-dialog]'
  );
  productSidebarDialog.classList.remove('translate-x-full');
  productSidebarDialog.classList.add(
    'transition',
    'ease-energetic',
    'duration-[580ms]',
    'translate-x-0'
  );
}

document.addEventListener('shopify:block:select', (e) => {
  const productSidebar = document.querySelector('[data-product-sidebar]');

  if (!productSidebar) return;

  const productSidebarDialog = productSidebar.querySelector(
    '[data-product-sidebar-dialog]'
  );
  productSidebarDialog.classList.remove('translate-x-full');
  productSidebarDialog.classList.add(
    'transition',
    'ease-energetic',
    'duration-[580ms]',
    'translate-x-0'
  );
});

/*
Mobile drawer management
*/

window.theme.menuDrawer = window.theme.menuDrawer|| {};


document.addEventListener('shopify:section:select', (e) => {
  if (!e.target.querySelector('[data-menu-drawer-section]')) return;
  let newPosition = e.target.querySelector('[data-menu-drawer-section]').dataset.position;

  //if newPosition is different to window.theme.menuDrawer.position, then close current drawer and open new one
  if (newPosition !== window.theme.menuDrawer.position) {
    //close current drawer
    window.theme.menuDrawer.position = newPosition;
    Alpine.store('modals').leftDrawer.open = false;
    Alpine.store('modals').rightDrawer.open = false;
    //set timeout to allow other modals to close
    setTimeout(function(){
      Alpine.store('modals').open('menu-drawer');
    }, 100);
  } else {
    Alpine.store('modals').open('menu-drawer');
  }
});

document.addEventListener('shopify:section:deselect', (e) => {
  if (!e.target.querySelector('[data-menu-drawer-section]')) return;

  Alpine.store('modals').close('menu-drawer');
});
