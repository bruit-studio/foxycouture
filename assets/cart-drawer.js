document.addEventListener('alpine:init', () => {
  Alpine.data('ThemeModule_CartDrawer', ({ openOnAddToCart }) => {
    return {
      init() {
        if (openOnAddToCart === true) {
          document.body.addEventListener(
            'switch:cart:afteradditem',
            () => {

              Object.keys(Alpine.store('modals').modals).forEach((modal) => {
                Alpine.store('modals').close(modal);
              });

              Alpine.store('modals').open('cart');
            }
          );
        }

        Alpine.store('modals').register('cart', 'rightDrawer');
      },
    };
  });
});
