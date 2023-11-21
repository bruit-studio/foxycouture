document.addEventListener('alpine:init', () => {
  Alpine.data('priceRange', (settings) => {
    return {
      minprice: settings.minprice,
      maxprice: settings.maxprice,
      min: settings.min,
      max: settings.max,
      minthumb: 0,
      maxthumb: 0,
      thumbkeystep: 1,
      init() {
        if (this.max - this.min > 500) {
          this.thumbkeystep = 5;
        }

        if (this.max - this.min > 1000) {
          this.thumbkeystep = 10;
        }
      },
      mintrigger() {
        this.validation();
        this.minprice = Math.min(this.minprice, this.maxprice - 1);
        this.minthumb =
          ((this.minprice - this.min) / (this.max - this.min)) * 100;
      },
      maxtrigger() {
        this.validation();
        this.maxprice = Math.max(this.maxprice, this.minprice + 1);
        this.maxthumb =
          100 - ((this.maxprice - this.min) / (this.max - this.min)) * 100;
      },
      thumbkeydown(thumb) {
        // loading is a property on the parent component
        if (this.loading) return;

        if (
          !['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(
            this.$event.key
          )
        )
          return;

        this.$event.preventDefault();

        const step = this.thumbkeystep * (this.$event.shiftKey ? 2 : 1);

        switch (this.$event.key) {
          case 'ArrowUp':
          case 'ArrowRight':
            if (thumb === 'min') {
              this.minprice += step;
            }

            if (thumb === 'max') {
              this.maxprice += step;
            }
            break;
          case 'ArrowDown':
          case 'ArrowLeft':
            if (thumb === 'min') {
              this.minprice -= step;
            }

            if (thumb === 'max') {
              this.maxprice -= step;
            }
            break;
        }

        if (thumb === 'min') this.mintrigger();
        if (thumb === 'max') this.maxtrigger();
      },
      thumbkeyup(thumb) {
        if (this.loading) return;

        if (
          !['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(
            this.$event.key
          )
        )
          return;

        this.$event.preventDefault();

        const target =
          thumb === 'min' ? this.$refs.mininput : this.$refs.maxinput;

        target.dispatchEvent(new Event('change'));
      },
      validation() {
        if (/^\d*$/.test(this.minprice)) {
          if (this.minprice > this.max) {
            this.minprice = this.max - 1;
          }
          if (this.minprice < this.min) {
            this.minprice = this.min;
          }
        } else {
          this.minprice = 0;
        }
        if (/^\d*$/.test(this.maxprice)) {
          if (this.maxprice > this.max) {
            this.maxprice = this.max;
          }
          if (this.maxprice < this.min) {
            this.maxprice = this.min + 1;
          }
        } else {
          this.maxprice = this.max;
        }
      },
    };
  });
});
