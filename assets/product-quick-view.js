document.addEventListener('alpine:init', () => {
  /*
  document.getElementById('quick-view-drawer-slot').style.setProperty(
    '--header-height',
    `${document.getElementById('quick-view-drawer-header').offsetHeight}px`
  );
    */

  Alpine.store('quickview', {
    product_loaded: false,
    current_product_url: '',
    original_path: window.location.pathname,
    cache: {},
    init() {
      document.body.addEventListener(
        'quick-view-drawer-is-closed',
        (e) => {
          this.product_loaded = false;
          this.current_product_url = '';
        }
      );
    },
    async render(link) {
      //remove any query params from link
      link = link.split('?')[0];

      if (this.cache[link]) {
        this.renderFromCache(link);
      } else {
        await this.renderFromFetch(link);
      }

      setTimeout(() => {
        document.body.dispatchEvent(
          new CustomEvent('switch:load:images', { bubbles: true })
        );
        document
          .getElementById('product-quickview-content')
          .querySelector('[data-quick-view-scroll-container]').scrollTop = 0;
      });
    },
    renderFromCache(link) {
      document.getElementById('product-quickview-content').innerHTML =
        this.cache[link];

      this.product_loaded = true;
      this.current_product_url = link;
    },
    async renderFromFetch(link) {
      const templateURL = link + '?view=quick-view';
      const fetchedSection = await fetchSectionHTML(
        templateURL,
        '.product-quick-view-section-wrapper'
      );

      this.cache[link] = fetchedSection;
      document.getElementById('product-quickview-content').innerHTML =
        fetchedSection;

      this.product_loaded = true;
      this.current_product_url = link;
    },
  });
});
