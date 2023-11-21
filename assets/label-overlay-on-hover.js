document.addEventListener('alpine:init', () => {
  Alpine.data('LabelOverlayOnHover', () => ({
    labelShown: false,
    hoverLabelContent: '',
    outTimer: null,
    init() {
      this.$watch('labelContent', (value) => {
        if (!isLgBreakpoint()) {
          this.labelShown = false;
        } else {
          if (Boolean(value)) {
            clearTimeout(this.outTimer);

            this.hoverLabelContent = value;
            this.labelShown = true;
          } else {
            this.labelShown = false;

            this.outTimer = setTimeout(() => {
              this.hoverLabelContent = value;
            }, 75);
          }
        }
      });
    },
  }));
});
