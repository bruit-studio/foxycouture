document.addEventListener('alpine:init', () => {
  Alpine.data('Theme_GiftCardRecipient', () => ({
    enabled: false,
    recipientMessage: '',
    get messageLength() {
      return this.recipientMessage.length;
    },
    errorMessage: null,
    errors: null,
    init() {
      document.body.addEventListener('switch:productform:adderror', (e) => {
        if (
          e.detail.source === 'product-form' &&
          e.detail.sourceId === this.$root.closest('form').getAttribute('id')
        ) {
          this.errors = e.detail.errors;
          this.enabled = true;
        }
      });
    },
  }));
});
