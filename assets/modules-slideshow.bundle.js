import { S as Splide } from './shared-import-splide.esm.bundle.js';
window.Splide = Splide;
window.slideshows = {};
const _createSplideInstance = (splideRoot, options, extensions, andRefresh = false) => {
  if (splideRoot.hasAttribute('data-thumbnails')) {
    const thumbsRoot = document.getElementById(splideRoot.getAttribute('data-thumbnails'));
    window.slideshows[thumbsRoot.id] = new Splide(`#${thumbsRoot.id}`, {
      direction: 'ttb',
      height: 'var(--thumbnails-height)',
      autoHeight: true,
      arrows: false,
      pagination: false,
      isNavigation: true,
      gap: '1.25rem',
      slideFocus: false,
      wheel: true,
      wheelSleep: 200
    });
    window.slideshows[splideRoot.id] = new Splide(`#${splideRoot.id}`, options);
    const mainSplide = window.slideshows[splideRoot.id];
    const thumbsSplide = window.slideshows[thumbsRoot.id];
    mainSplide.sync(thumbsSplide);
    mainSplide.mount(extensions);
    thumbsSplide.mount();
    if (andRefresh) {
      mainSplide.refresh();
      thumbsSplide.refresh();
    }
  } else {
    window.slideshows[splideRoot.id] = new Splide(`#${splideRoot.id}`, options).mount(extensions);
    if (andRefresh) {
      window.slideshows[splideRoot.id].refresh();
    }
  }
};
window.destroySlideshow = splideRoot => {
  window.slideshows[splideRoot.id].destroy(true);
  delete window.slideshows[splideRoot.id];
};
window.makeSlideshow = (splideRoot, andRefresh = false) => {
  if (splideRoot.matches('.splide--thumbnails')) return;
  // Thumbnails Splides’ initialization is started by their
  // main slideshow

  if (!splideRoot.id) {
    console.error('Cascade Theme: makeSlideshow requires a unique ID on the slideshow root');
    return;
  }
  if (window.slideshows[splideRoot.id]) return;
  const mobileOnly = splideRoot.matches('.splide--mobile');
  const options = {
    mediaQuery: 'min',
    perPage: 1,
    perMove: 1,
    autoWidth: true,
    arrows: true,
    rewind: true,
    easing: 'var(--timing-func-energetic)',
    speed: 600,
    breakpoints: mobileOnly ? {
      990: {
        destroy: true
      }
    } : {}
  };
  if (splideRoot.matches('.splide--product')) {
    const productOptions = {
      mediaQuery: 'min',
      perPage: 1,
      perMove: 1,
      autoWidth: true,
      arrows: true,
      rewind: true,
      easing: 'var(--timing-func-energetic)',
      speed: 600,
      drag: splideRoot.dataset.dragDisabled !== 'true',
      breakpoints: splideRoot.matches('.splide--product--everywhere') ? {} : {
        768: {
          arrows: false,
          pagination: false
        }
      }
    };
    import('./components-splide-product.bundle.js').then(({
      default: SplideProductModule,
      SplideProduct
    }) => {
      _createSplideInstance(splideRoot, productOptions, {
        SplideProduct
      }, andRefresh);
    });
  } else {
    _createSplideInstance(splideRoot, options, {}, andRefresh);
  }
};
window.discoverNewSlideshows = (container = document, andRefresh = false) => {
  container.querySelectorAll('.splide').forEach(splideRoot => {
    makeSlideshow(splideRoot, true);
  });
};
window.destroySlideshowsIn = (container = document) => {
  container.querySelectorAll('.splide').forEach(splideRoot => {
    destroySlideshow(splideRoot);
  });
};
window.refreshSlideshowsIn = (container = document) => {
  container.querySelectorAll('.splide').forEach(splideRoot => {
    refreshSlideshow(splideRoot);
  });
};
document.addEventListener('DOMContentLoaded', () => {
  discoverNewSlideshows();
});
