window['ThemeTile'] = (link, title) => {
  return {
    hover: false,
    link: link,
    title: title,
    showLabel() {
      this.labelContent = this.$refs.labelContent.innerHTML;
      this.focusVisible = this.$refs.tileLink.matches(':focus-visible');
    },
    hideLabel() {
      this.labelContent = '';
      this.focusVisible = false;
    },
    async openQuickView() {
      this.$store.quickview.render(link);
      this.$store.modals.open('productQuickView');
    },
  };
};
