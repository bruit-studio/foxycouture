document.addEventListener('alpine:init', () => {
  Alpine.data('ThemeSection_filterable', (section_id) => {
    return {
      loading: false,
      focusId: '',
      filterData: [],
      init() {
        initTeleport(this.$root);

        Alpine.store('modals').register('filters', 'leftDrawer');

        window.addEventListener('popstate', this.onHistoryChange.bind(this));

        this._observeResultsMutations();
      },
      filterFormSubmit(e) {
        this.focusId = document.activeElement.getAttribute('id');
        Alpine.store('modals').close('filters');
        let form = e.target.form;
        if (e.target.tagName.toLowerCase() === 'form') {
          form = e.target;
        }
        this.loading = true;
        const formData = new FormData(form);
        const searchParams = new URLSearchParams(formData);
        searchParams.delete('price_range');
        this.renderPage(searchParams.toString(), e);
      },
      clearAllFilters(e) {
        Alpine.store('modals').close('filters');
        this.renderPage(new URL(e.currentTarget.href).searchParams.toString());
      },
      removeFilter(params) {
        this.renderPage(params);
      },
      renderPage(searchParams, event, updateURLHash = true) {
        const facetResults = document.getElementById('facets-results');
        if (facetResults != null) {
          facetResults.classList.add('opacity-50');
        }
        const url = `${window.location.pathname}?section_id=${section_id}&${searchParams}`;
        const filterDataUrl = (element) => element.url === url;
        this.filterData.some(filterDataUrl)
          ? this.renderFromCache(filterDataUrl, event)
          : this.renderFromFetch(url, event);
        if (updateURLHash) this.updateURLHash(searchParams);
      },
      renderFromFetch(url, event) {
        fetch(url)
          .then((response) => response.text())
          .then((responseText) => {
            const html = responseText;
            this.filterData = [...this.filterData, { html, url }];
            this.renderMarkup(html);
          });
      },
      renderFromCache(filterDataUrl, event) {
        const html = this.filterData.find(filterDataUrl).html;
        this.renderMarkup(html);
      },
      renderMarkup(html) {
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        const innerHTML = parsed.getElementById('facets-filterable').innerHTML;
        const filterableEl = document.getElementById('facets-filterable');

        if (innerHTML !== filterableEl.innerHTML) {
          filterableEl.closest('.shopify-section').dispatchEvent(
            new CustomEvent('switch:section:willmutate', {
              bubbles: true,
            })
          );

          setTimeout(() => {
            filterableEl.querySelectorAll('[x-teleport]').forEach((el) => {
              el.remove();
            });

            filterableEl.innerHTML = innerHTML;

            this.$nextTick(() => {
              initTeleport(filterableEl);
              document.body.dispatchEvent(
                new CustomEvent('switch:load:images', { bubbles: true })
              );
            });

            const count = parsed.getElementById(
              'facets-results-count'
            ).innerHTML;
            liveRegion(count);

            const element = document.getElementById(this.focusId);

            if (element) {
              this.$focus.focus(element);
            }

            this.loading = false;
          }, 300);
        } else {
          document
            .getElementById('facets-results')
            .classList.remove('opacity-50');

          this.loading = false;
        }
      },
      updateURLHash(searchParams) {
        history.pushState(
          { searchParams },
          '',
          `${window.location.pathname}${
            searchParams && '?'.concat(searchParams)
          }`
        );
      },
      onHistoryChange(event) {
        const searchParams = event.state.searchParams || '';
        this.renderPage(searchParams, null, false);
      },
      _observeResultsMutations() {
        const containerEl = document.getElementById('facets-filterable');

        const mutationObserverOptions = {
          childList: true,
          attributes: false,
          // Omit (or set to false) to observe only changes to the parent node
          subtree: false,
        };

        const callback = (mutationList, observer) => {
          mutationList.forEach((mutation) => {
            if (mutation.type === 'childList') {
              mutation.target.closest('.shopify-section').dispatchEvent(
                new CustomEvent('switch:section:hasmutated', {
                  bubbles: true,
                })
              );
            }
          });
        };

        const mutationObserver = new MutationObserver(callback);
        mutationObserver.observe(containerEl, mutationObserverOptions);
      },
    };
  });
});
