function checkImagesLoaded(container = document) {
  const images = container.querySelectorAll('img.track-loaded');

  images.forEach((image) => {
    if (image.complete) {
      image.classList.add('is-complete');
    } else {
      image.addEventListener('load', () => {
        image.classList.add('is-complete');
      });
    }
  });
}

checkImagesLoaded();

document.addEventListener('shopify:section:load', () => {
  checkImagesLoaded();
});

document.addEventListener('switch:load:images', (e) => {
  const container = e.detail && e.detail.container ? e.detail.container : document;
  checkImagesLoaded(container);
});
