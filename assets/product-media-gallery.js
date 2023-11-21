document.addEventListener('alpine:init', () => {
  Alpine.data('productMediaGallery', (section_id) => ({
    labelContent: '',
    sectionID: section_id,
    openZoom(mediaId) {
      const zoomModalId = `image-zoom-${this.sectionID}`;

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
  }));
});
