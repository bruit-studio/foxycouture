window['Theme_Product'] = ({
  product,
  variant,
  featuredMediaID,
  enableImageZoom = false,
}) => {
  return {
    productForms: null,
    productRoot: null,
    product: product,
    current_variant: variant,
    featured_media_id: featuredMediaID,
    current_media_id: featuredMediaID,
    loading: false,
    quantity: '1',
    optionHandles: [],
    storeAvailability: null,
    addedToCart: false,
    stickyAddToCartShown: false,
    variantChanged: false,
    updateStoreAvailability: null,
    video_in_view: false,
    currentOption1: variant.option1,
    currentOption2: variant.option2,
    currentOption3: variant.option3,
    inventoryData: null,
    isQuickViewModal: false,
    cartAddErrorMessage: null,
    isCartPage: false,
    hasGiftCardRecipientForm: false,
    get options() {
      let arr = [];
      if (this.currentOption1) {
        arr.push(this.currentOption1);
      }
      if (this.currentOption2) {
        arr.push(this.currentOption2);
      }
      if (this.currentOption3) {
        arr.push(this.currentOption3);
      }
      return arr;
    },
    get currentVariantId() {
      if (this.current_variant) {
        return this.current_variant.id;
      } else {
        return null;
      }
    },
    get currentVariantInventoryData() {
      if (this.inventoryData !== null) {
        if (
          this.current_variant &&
          this.inventoryData[this.current_variant.id]
        ) {
          return this.inventoryData[this.current_variant.id];
        } else {
          return null;
        }
      } else {
        return null;
      }
    },
    get currentVariantAvailabilityClosestLocation() {
      // this is on a lag to the actual current variant so that we can display an intermediary state while the fetch request is happening
      if (!Alpine.store('availability')) return null;

      const id = this.currentVariantId;
      const storeData = Alpine.store('availability').availability[id];

      if (storeData) {
        return storeData.closest_location;
      } else {
        return null;
      }
    },
    get currentVariantAvailable() {
      if (this.current_variant) {
        return this.current_variant.available;
      } else {
        return null;
      }
    },
    get currentVariantTitle() {
      if (this.current_variant && this.current_variant.title) {
        if (!this.current_variant.title.includes('Default')) {
          return this.current_variant.title;
        }
      }
      return '';
    },
    get current_price() {
      return this.current_variant.price;
    },
    get isUsingSlideshowToDisplayMedia() {
      const splideEl = this.productRoot.querySelector('.splide');

      return splideIsNotDestroyed(splideEl);
    },
    formatMoney(price, moneyFormat = theme.defaultMoneyFormat) {
      return formatMoney(price, moneyFormat);
    },
    init() {
      if (this.$root.querySelector('[x-data="Theme_GiftCardRecipient"]')) {
        this.hasGiftCardRecipientForm = true;
      }

      if (this.$root.closest('[role="dialog"]')) {
        this.isQuickViewModal = true;
      }

      // Set a product root for nested components
      // to use instead of $root (which refers to their root)
      this.productRoot = this.$root;

      this.updateStoreAvailability = debounce(
        this.__updateStoreAvailability.bind(this),
        150
      );

      this.productForm = this.$root.querySelector(
        `[data-product-form-container]`
      );

      const formEl = this.productForm.querySelector('.product-form');

      if (formEl !== null) {
        formEl.addEventListener('submit', this.submitForm.bind(this));
      }

      //check if window is /cart page
      this.isCartPage = window.location.pathname === '/cart';

      this.getOptionHandles();

      this.$root.addEventListener('switch:product:slidechange', (e) => {
        this.current_media_id = parseInt(e.detail.current_media_id);
      });

      this.$watch('current_media_id', (value, oldValue) => {
        const currentMediaObject = this.product.media.filter((media) => {
          return media.id === value;
        });

        this.video_in_view =
          currentMediaObject[0].media_type === 'video' ||
          currentMediaObject[0].media_type === 'external_video'
            ? true
            : false;

        // There can be more than one media (e.g. for different breakpoints)
        // so we check the offsetHeight to see if the wrapper could currently
        // be visible

        // https://davidwalsh.name/offsetheight-visibility

        this.$root
          .querySelectorAll(`[data-product-single-media-wrapper="${oldValue}"]`)
          .forEach((mediaWrapperEl) => {
            if (!!mediaWrapperEl.offsetHeight) {
              mediaWrapperEl.dispatchEvent(new CustomEvent('mediaHidden'));
            }
          });
        this.$root
          .querySelectorAll(`[data-product-single-media-wrapper="${value}"]`)
          .forEach((mediaWrapperEl) => {
            if (!!mediaWrapperEl.offsetHeight) {
              mediaWrapperEl.dispatchEvent(new CustomEvent('mediaVisible'));
            }
          });
      });

      this.updateStoreAvailability(this.current_variant);

      //get inventory
      if (this.$root.querySelector('[data-variant-inventory]')) {
        this.inventoryData = JSON.parse(
          this.$root.querySelector('[data-variant-inventory]').innerHTML
        );
      }

      if (this.isQuickViewModal) {
        if (Shopify && Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        }
      }
    },
    __updateStoreAvailability(variant) {
      if (!this.$refs.storeAvailabilityContainer) return;

      this.storeAvailability =
        this.storeAvailability ||
        new StoreAvailability(this.$refs.storeAvailabilityContainer);

      if (this.storeAvailability && variant) {
        this.storeAvailability.fetchContent(variant);
      }
    },
    optionChange() {
      this.getOptionHandles();

      const matchedVariant = ShopifyProduct.getVariantFromOptionArray(
        this.product,
        this.options
      );

      this.current_variant = matchedVariant;

      if (this.current_variant) {
        variantLiveRegion(this.current_variant);
        this.updateStoreAvailability(this.current_variant);

        if (
          this.current_variant.featured_media &&
          this.current_media_id !== this.current_variant.featured_media.id
        ) {
          this.current_media_id = this.current_variant.featured_media.id;
          if (isLgBreakpoint()) {
            this.$refs['product-media'].scrollIntoView({
              behavior: 'smooth',
            });
          }
        }

        const url = ShopifyProductForm.getUrlWithVariant(
          window.location.href,
          this.current_variant.id
        );

        if (!this.isQuickViewModal) {
          this.$root.dispatchEvent(
            new CustomEvent('product-url-update', {
              bubbles: true,
              detail: { url: url },
            })
          );
        }

        const inFormNameEl =
          this.$refs.singleVariantSelector || this.$refs.productFormNameField;

        inFormNameEl.dispatchEvent(new Event('change', { bubbles: true }));

        this.$root.dispatchEvent(
          new CustomEvent('switch:product:variantchange', {
            bubbles: true,
            detail: { variant: this.current_variant },
          })
        );

        this.variantChanged = true;
      }
    },
    getOptionHandles() {
      this.optionHandles = [];

      const selectors = this.productForm.querySelectorAll(
        '[data-single-option-selector]'
      );

      selectors.forEach((selector) => {
        if (selector.nodeName === 'SELECT') {
          this.optionHandles.push(
            selector.options[selector.selectedIndex].dataset.handle
          );
        } else {
          if (selector.checked) {
            this.optionHandles.push(selector.dataset.handle);
          }
        }
      });
    },
    mobileAddToCartClick(e) {
      if (theme.settings.cart_type === 'drawer') {
        const formEl = this.productForm.querySelector('.product-form');
        if (formEl !== null) {
          formEl.dispatchEvent(new Event('submit'));
        }
      }
    },
    submitForm(evt) {
      evt.preventDefault();
      this.loading = true;
      this.addedToCart = false;
      this.cartAddErrorMessage = null;

      liveRegion(window.theme.strings.loading);

      const formData = new FormData(evt.target);
      const formId = evt.target.getAttribute('id');

      let modalCart = theme.settings.cart_type === 'drawer' && !this.isCartPage;

      const config = fetchConfigDefaults('application/javascript');

      if (modalCart) {
        formData.append(
          'sections',
          'drawer-cart-items,drawer-cart-footer,cart-item-count'
        );
      } else if (this.isCartPage) {
        formData.append('sections', 'cart-items,cart-footer,cart-item-count');
      } else {
        formData.append('sections', 'cart-item-count');
      }

      formData.append('sections_url', window.location.pathname);

      config.body = formData;

      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      fetch(`${theme.routes.cart_add_url}`, config)
        .then((res) => res.json())
        .then((data) => {
          if (data.status) {
            this.loading = false;

            let errors = data.errors || data.description;
            let message = data.description || data.message;

            // Gift card recipient form errors are handled in gift-card-recipient.js
            if (!this.hasGiftCardRecipientForm) {
              this.cartAddErrorMessage =
                message || window.theme.strings.cartError;
            }

            document.body.dispatchEvent(
              new CustomEvent('switch:productform:adderror', {
                detail: {
                  source: 'product-form',
                  sourceId: formId,
                  variantId: formData.get('id'),
                  errors,
                  message,
                },
              })
            );

            return;
          }

          this.loading = false;
          this.addedToCart = true;

          const afterAddEvent = new CustomEvent('switch:cart:afteradditem', {
            bubbles: true,
            detail: { response: data },
          });
          document.body.dispatchEvent(afterAddEvent);

          if (!document.querySelector('[data-show-on-add="true"]')) {
            if (this.$refs.added)
              this.$nextTick(() => this.$refs.added.focus());
          }
        })
        .catch((error) => {
          if (typeof error === 'string') {
            alert(error);
          } else {
            this.loading = false;

            if (error.json()) {
              error.json().then((a) => {
                this.loading = false;
                alert(a.description);
              });
            } else {
              console.error(error);
            }
          }
        });
    },
    openZoom(mediaId) {
      const zoomModalId = `image-zoom-${this.productRoot.id}`;

      if (!this.$store.modals.modals[zoomModalId]) {
        this.$store.modals.register(zoomModalId, 'modal');
      }

      this.$watch('$store.modals.modal.contents', (val) => {
        if (val === zoomModalId) {
          this.$nextTick(() => {
            const zoomModalEl = document.getElementById(zoomModalId);

            waitForContent(zoomModalEl).then(() => {
              const mediaEl = zoomModalEl.querySelector(
                `[data-media-id="${mediaId}"]`
              );

              if (mediaEl) {
                mediaEl.scrollIntoView();
              }
            });
          });
        }
      });

      this.$store.modals.open(zoomModalId);
    },
  };
};
