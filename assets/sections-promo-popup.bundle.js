import { a as api } from './shared-import-js.cookie.bundle.js';
document.addEventListener('alpine:init', () => {
  Alpine.data('ThemeSection_PromoPopup', settings => {
    return {
      delay: settings.delay,
      frequency: settings.frequency,
      enabled: settings.enabled,
      sectionId: settings.sectionId,
      cookie: api.get('promoPopup'),
      mounted() {
        // Prevent popup on Shopify robot challenge page
        if (window.location.pathname === '/challenge') return;
        initTeleport(this.$root);
        Alpine.store('modals').register('promoPopup', 'promo');
        document.body.addEventListener('promo-is-closed', e => {
          api.set('promoPopup', 'opened', {
            path: '/',
            expires: this.frequency
          });
        });
        const popupContent = this.$refs.teleported.content.querySelector('template').content;
        const hasErrors = Boolean(popupContent.querySelector('[data-errors]'));
        const hasSuccessMessage = Boolean(popupContent.querySelector('[data-success-message]'));
        console.log(hasErrors);
        console.log(hasSuccessMessage);
        if (hasSuccessMessage || hasErrors) {
          this.open();
          this.clearSuccessParams();
          api.set('promoPopup', 'opened', {
            path: '/',
            expires: 200
          });
        }
        if (!Shopify.designMode) {
          if (this.cookie !== 'opened') {
            setTimeout(() => {
              this.open();
              const escapeHandler = e => {
                if (e.code.toUpperCase() !== 'ESCAPE') return;
                this.$store.modals.close('promoPopup');
                document.body.removeEventListener('keydown', escapeHandler);
              };
              document.body.addEventListener('keydown', escapeHandler);
            }, this.delay * 1000);
          }
        } else {
          if (window.theme.designMode.selected === this.sectionId) {
            if (this.enabled === true) {
              this.open();
            } else {
              // It might be open from a previous instantiation
              Alpine.store('modals').close('promoPopup');
            }
          }
          document.addEventListener('shopify:section:select', e => {
            if (!e.target.contains(this.$root)) return;
            if (!this.enabled) return;
            this.open();
          });
          document.addEventListener('shopify:section:deselect', e => {
            if (!e.target.contains(this.$root)) return;
            this.$store.modals.close('promoPopup');
          });
        }
      },
      open() {
        this.$store.modals.open('promoPopup');
        this.$focus.first();
      },
      clearSuccessParams() {
        /**
         * After a successful submission, the URL becomes
         * `?customer_posted=true#contact_form`, which will cause
         * the popup to reappear when returning to the URL.
         *
         * This will remove that search param and clear the hash.
         */

        console.log(window.location);
        console.log(window.location.search);
        const updatedParams = new URLSearchParams(window.location.search);
        if (updatedParams.has('customer_posted')) {
          updatedParams.delete('customer_posted');
        }
        let newURL;
        if (updatedParams.toString().length > 0) {
          newURL = `${window.location.pathname}?${updatedParams.toString()}`;
        } else {
          newURL = window.location.pathname;
        }
        console.log(window.location.pathname + updatedParams.toString());
        history.replaceState('', document.title, newURL);
      }
    };
  });
});
