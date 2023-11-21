Alpine.magic('fetchedSection', () => {
  return (url, selector) => {
    return async () => {
      return await fetchSectionHTML(url, selector);
    };
  };
});

Alpine.directive(
  'html-with-slideshow',
  (el, { expression }, { evaluateLater, effect, cleanup }) => {
    let getHTMLString = evaluateLater(expression);

    effect(() => {
      getHTMLString((value) => {
        el.innerHTML = value;
        if (value.indexOf('splide') !== -1) {
          window.discoverNewSlideshows(el);
        }
      });
    });

    cleanup(() => {
      window.destroySlideshowsIn(el);
    });
  }
);

// document.addEventListener('DOMContentLoaded', () => {
Alpine.start();
// });
