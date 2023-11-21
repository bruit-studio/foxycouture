let availabilityStoreRegistered = false,
  availabilityContextRegistered = false;

const registerAvailabilityStore = () => {
  if (availabilityStoreRegistered) return;

  Alpine.store('availability', {
    loading: false,
    current_variant: null,
    availability: {},
  });

  availabilityStoreRegistered = true;
};

const registerAvailabilityContext = () => {
  if (availabilityContextRegistered) return;

  Alpine.data('ThemeComponent_StoreAvailabilityDrawer', (productID) => {
    return {
      init() {
        if (!Alpine.store('modals').modals.availability) {
          Alpine.store('modals').register('availability', 'rightDrawer');
        }

        setTimeout(() => {
          const existingDrawerContents = document.getElementById(
            `store-availability-drawer-contents-${productID}`
          );

          if (!existingDrawerContents) {
            initTeleport(this.$root);
          }
        });
      },
      get currentVariantAvailabilityList() {
        // this is on a lag to the actual current variant so that we can display an intermediary state while the fetch request is happening
        if (window.Alpine.store('availability').current_variant) {
          const id = window.Alpine.store('availability').current_variant;
          const storeData =
            window.Alpine.store('availability').availability[id];
          if (storeData) {
            return storeData.list;
          }
        }
        return [];
      },
    };
  });

  availabilityContextRegistered = true;
};

document.addEventListener('alpine:init', () => {
  registerAvailabilityStore();
  registerAvailabilityContext();
});

document.addEventListener('switch:productquickbuy:willadd', () => {
  registerAvailabilityStore();
  registerAvailabilityContext();
});
