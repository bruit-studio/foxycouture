document.addEventListener('alpine:init', () => {
  Alpine.data('productContent', () => ({
    product_content_height: 0,
    init() {
      //get in
      this.getProductContentHeight();

      this._debouncedGetProductContentHeight = debounce(
        this.getProductContentHeight.bind(this),
        300
      );

      window.addEventListener('resize', this._debouncedGetProductContentHeight);
      window.addEventListener(
        'product-content-height-change',
        this._debouncedGetProductContentHeight
      );
    },
    getProductContentHeight() {
      //get height of this.$root and set it to product_content_height
      this.product_content_height =
        this.$refs.productContentContainer.offsetHeight;

      //get viewport height
      const viewportHeight = window.innerHeight;
      //get --header-height css variable and convert to a number
      const headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          '--header-height'
        )
      );
      const columnMaxHeight = viewportHeight - headerHeight;

      if (this.product_content_height < columnMaxHeight) {
        this.$root.style.setProperty('--product-content-column-height', `100%`);
        this.$root.style.setProperty(
          '--product-content-column-max-height',
          `100vh`
        );
      } else {
        this.$root.style.setProperty('--product-content-column-height', `auto`);
        this.$root.style.setProperty(
          '--product-content-column-max-height',
          `fit-content`
        );
      }
    },
  }));
});
