document.addEventListener('alpine:init', () => {
  Alpine.data('ThemeModule_CartFooter', (context) => {
    return {
      context: context,
      footerRoot: null,
      drawer_section: '',
      _morphFooter(e) {
        const newFooterSection = querySelectorInHTMLString(
          '[data-cart-footer]',
          e.detail.response.sections[this.drawer_section]
        );

        Alpine.morph(
          this.footerRoot,
          newFooterSection ? newFooterSection.outerHTML : '',
          {
            updating(el, toEl, childrenOnly, skip) {
              if (
                el.classList &&
                el.classList.contains('additional-checkout-buttons')
              ) {
                skip();
              }
            },
          }
        );
      },
      init() {
        this.footerRoot = this.$root;

        if (context === 'drawer') {
          this.drawer_section = 'drawer-cart-footer';
        } else {
          this.drawer_section = 'cart-footer';
        }

        window.addEventListener('switch:cart:afteradditem', (e) => {
          this._morphFooter(e);
        });

        window.addEventListener('switch:modalcart:cartqtychange', (e) => {
          this._morphFooter(e);
        });
      },
    };
  });
});
