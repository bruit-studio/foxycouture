document.addEventListener('alpine:init', () => {
  Alpine.data('ThemeFollowMouse', () => ({
    hover: false,
    labelShown: false,
    init() {
      //this.focusVisible = this.$refs.tileLink.matches(':focus-visible');
      this.$watch('labelContent', (value) => {
        if (value !== '') {
          this.enableMouseListener();
        } else {
          this.disableMouseListener();
        }
      });
      this.$watch('focusVisible', (focusVisible) => {
        if (focusVisible) {
          this.$root.style.setProperty("--x",  0 );
          this.$root.style.setProperty("--y",  0 );
        }
      });
    },
    enableMouseListener() {
      document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    },
    disableMouseListener() {
      document.removeEventListener('mousemove', (e) => this.onMouseMove(e));
    },
    onMouseMove(e) {
      if (this.focusVisible) return;
      this.$root.style.setProperty("--x",  e.clientX );
      this.$root.style.setProperty("--y",  e.clientY );
    },
  }));
});