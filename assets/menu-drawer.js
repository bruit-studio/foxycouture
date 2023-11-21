document.addEventListener('alpine:init', () => {
  Alpine.data('ThemeSection_MenuDrawer', (position = 'leftDrawer') => {
    return {
      init() {
        initTeleport(this.$root);
        Alpine.store('modals').register('menu-drawer', position);
      },
    };
  });
});
