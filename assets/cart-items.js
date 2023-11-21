document.addEventListener('alpine:init', () => {
  Alpine.data('ThemeModule_CartItems', (context) => {
    return {
      context: context,
      itemsRoot: null,
      locked: null,
      items_section: '',
      sections: '',
      init() {
        if (context === 'drawer') {
          this.items_section = 'drawer-cart-items';
          this.sections =
            'drawer-cart-items,drawer-cart-footer,cart-item-count,cart-live-region';
        } else {
          this.items_section = 'cart-items';
          this.sections =
            'cart-items,cart-items,cart-footer,cart-item-count,cart-live-region';
        }

        this.itemsRoot = this.$root;

        window.addEventListener('switch:cart:afteradditem', (e) => {
          Alpine.morph(
            this.itemsRoot,
            querySelectorInHTMLString(
              '[data-cart-items]',
              e.detail.response.sections[this.items_section]
            ).outerHTML
          );
          this.$nextTick(() => {
            document.body.dispatchEvent(new CustomEvent('switch:load:images', { bubbles: true }));
          });
        });

        window.addEventListener('switch:modalcart:cartqtychange', (e) => {
          if (!this.itemsRoot.contains(e.detail.originalTarget)) return;

          Alpine.morph(
            this.itemsRoot,
            querySelectorInHTMLString(
              '[data-cart-items]',
              e.detail.response.sections[this.items_section]
            ).outerHTML
          );

          this.$nextTick(() => {
            document.body.dispatchEvent(new CustomEvent('switch:load:images', { bubbles: true }));
            this.itemsRoot.querySelectorAll('input').forEach((inputEl) => {
              inputEl.value = inputEl.getAttribute('value');
            });
          });

          const liveRegionText = parseDOMFromString(
            e.detail.response.sections['cart-live-region']
          ).firstElementChild.textContent;

          const cartStatus = document.getElementById('cart-live-region-text');

          cartStatus.textContent = liveRegionText;

          cartStatus.setAttribute('aria-hidden', false);

          setTimeout(() => {
            cartStatus.setAttribute('aria-hidden', true);
          }, 1000);

          if (e.detail.originalTarget) {
            this.$nextTick(() => {
              if (!this.itemsRoot.contains(e.detail.originalTarget)) {
                let focusRoot;

                if (this.itemsRoot.closest('[role="dialog"]')) {
                  focusRoot =
                    this.itemsRoot.closest('[role="dialog"]').parentNode;
                } else {
                  focusRoot = this.itemsRoot;
                }

                this.$focus.within(focusRoot).first();
              }
            });
          }
        });
      },
      itemQuantityChange(key, value) {
        if (this.locked) return;

        const lineItemEl = this.$el.closest('li[data-cart-item-key]');
        const id = key ? key : lineItemEl.getAttribute('data-cart-item-key'),
          quantity = parseInt(!isNaN(value) ? value : this.$el.value, 10);

        const config = fetchConfigDefaults();

        let sections = this.sections;

        config.headers.Accept = 'application/javascript';

        config.body = JSON.stringify({
          id,
          quantity,
          sections,
          sections_url: window.location.pathname,
        });

        const lastValue = parseInt(this.$el.dataset.lastValue, 10);

        if (quantity !== lastValue) {
          lineItemEl.classList.add('opacity-50', 'cursor-progress');

          const currentCount = Alpine.raw(Alpine.store('cart_count').count);

          this.locked = lineItemEl;

          fetch(theme.routes.cart_change_url, config)
            .then((res) => res.json())
            .then((data) => {
              if (data.status === 422) {
                const errorEl = lineItemEl.querySelector(
                  '[data-cart-quantity-error]'
                );

                errorEl.textContent = data.message;

                errorEl.classList.remove('hidden');

                lineItemEl.classList.remove('opacity-50', 'cursor-progress');

                this.$el.value = lastValue;
                this.$el.dispatchEvent(new Event('input'));
              } else {
                document.body.dispatchEvent(
                  new CustomEvent('switch:modalcart:cartqtychange', {
                    bubbles: true,
                    detail: { response: data, originalTarget: lineItemEl },
                  })
                );
              }
            })
            .catch(() => {
              document.getElementById('cart-errors').textContent =
                theme.strings.cartError;
            })
            .finally(() => {
              this.locked = null;
            });
        }
      },
      removeItem(key) {
        this.itemQuantityChange(key, 0);
      },
      _adjustQty(el, operation) {
        const inputEl = el
          .closest('li[key]')
          .querySelector('input[type="number"]');

        const lastValue = parseInt(inputEl.dataset.lastValue, 10);

        let newValue;

        if (operation == 'increment') {
          newValue = lastValue + 1;
        }

        if (operation == 'decrement') {
          if (lastValue > 1) {
            newValue = lastValue - 1;
          } else {
            newValue = 1;
          }
        }

        if (operation == 'remove') {
          newValue = 0;
        }

        inputEl.value = newValue;

        // this.$nextTick(() => {
        inputEl.dispatchEvent(new Event('change', { bubbles: true }));
        // });
      },
      increment() {
        this._adjustQty(this.$el, 'increment');
      },
      decrement() {
        this._adjustQty(this.$el, 'decrement');
      },
      remove() {
        this._adjustQty(this.$el, 'remove');
      },
    };
  });
});
