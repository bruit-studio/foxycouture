document.addEventListener('alpine:init', () => {
  Alpine.data('PredictiveSearch', (resources) => ({
    loading: false,
    resultsOpen: false,
    rawQuery: '',
    resultsHTML: null,
    showViewAll: false,
    resources: resources,
    selectedElement: null,
    activeElement: null,
    allOptionsArray: null,
    get activeElementId() {
      return this.activeElement ? this.activeElement.getAttribute('id') : '';
    },
    get currentResultsGroup() {
      return this._currentResultsGroup;
    },
    set currentResultsGroup(newValue) {
      if (newValue === '') {
        this._currentResultsGroup = newValue;
        return;
      }

      if (this._currentResultsGroup === '') {
        if (this.$refs[`${newValue}Results`]) {
          this.$refs[`${newValue}Results`].hidden = false;
        }

        this._currentResultsGroup = newValue;
        return;
      }

      const currentResultsGroupEl =
        this.$refs[`${this._currentResultsGroup}Results`];

      this._currentResultsGroup = newValue;

      const nextResultsGroupEl = this.$refs[`${newValue}Results`];

      this.switchResultsGroup(currentResultsGroupEl, nextResultsGroupEl);
    },
    get trimmedQuery() {
      return this.rawQuery.trim();
    },
    get shouldAnimate() {
      return window.matchMedia('(prefers-reduced-motion: no-preference)')
        .matches;
    },
    get queryKey() {
      return this.trimmedQuery.replace(' ', '-').toLowerCase();
    },
    init() {
      this.$watch('trimmedQuery', (value) => {
        if (!value.length) {
          this.closeResults();
          this.resultsHTML = null;
        } else {
          this.openResults();
          this.getSearchResults();
        }
      });
      this.$watch('resultsHTML', async (value) => {
        if (Boolean(value) === true) {
          this.$refs.results.hidden = false;
          this.showViewAll = true;

          this.currentResultsGroup = '';

          this.$nextTick(() => {
            this.setInitialResultsGroup();
            this.$refs.resultsSlot.scrollTo(0, 0);
          });
        } else {
          this.$refs.results.hidden = true;
          this.showViewAll = false;
        }
      });
    },
    close(clearSearchTerm = true, focusAfter) {
      this.closeResults(clearSearchTerm);

      if (focusAfter) {
        setTimeout(() => {
          this.$focus.focus(focusAfter);
        });
      }
    },
    openResults() {
      this.resultsOpen = true;

      document.documentElement.style.overflowY = 'hidden';
    },
    closeResults(clearSearchTerm = false) {
      this.resultsOpen = false;

      if (clearSearchTerm) {
        this.rawQuery = '';
      }

      this.selectedElement = null;

      document.documentElement.style.overflowY = 'auto';
    },
    setInitialResultsGroup() {
      if (this.$refs.groupToggles) {
        this.currentResultsGroup = this.$refs.groupToggles.querySelector(
          'input[type="radio"]'
        ).value;
      } else {
        this.currentResultsGroup = 'products';
      }
    },
    async getSearchResults() {
      this.loading = true;

      liveRegion(window.theme.strings.loading);

      const updatedHTML = await fetchHTML(
        getURLWithParams(window.theme.routes.predictive_search_url, {
          q: this.trimmedQuery,
          'resources[type]': this.resources,
          'resources[limit_scope]': 'each',
          section_id: 'predictive-search',
        })
      );

      const resultsMarkup = querySelectorInHTMLString(
        '#shopify-section-predictive-search',
        updatedHTML
      ).innerHTML;

      const liveRegionText = querySelectorInHTMLString(
        '#predictive-search-count',
        updatedHTML
      ).innerHTML;

      this.resultsHTML = resultsMarkup;

      liveRegion(liveRegionText);

      this.$nextTick(() => {
        this.allOptionsArray = Array.from(
          this.$root.querySelectorAll('[role="option"]')
        );

        document.dispatchEvent(
          new CustomEvent('switch:load:images', {
            detail: { container: this.$refs.results },
          })
        );
      });

      this.loading = false;

      this.openResults();
    },
    onFocus() {
      if (!this.trimmedQuery.length) return;

      if (this.resultsHTML) {
        this.openResults();
      } else {
        this.getSearchResults();
      }
    },
    onFormSubmit(event) {
      if (
        !this.trimmedQuery.length ||
        this.$el.querySelector('[aria-selected="true"] a')
      )
        event.preventDefault();
    },
    onOpen() {
      setTimeout(() => {
        this.$focus.focus(this.$refs.input);
      }, 350);
    },
    async switchResultsGroup(fromEl, toEl) {
      if (this.shouldAnimate) {
        await fromEl.animate(
          {
            opacity: [1, 0],
          },
          { duration: 75, easing: 'ease' }
        ).finished;
      }

      fromEl.hidden = true;
      toEl.hidden = false;

      if (this.shouldAnimate) {
        await toEl.animate(
          {
            opacity: [0, 1],
          },
          { duration: 150, easing: 'ease' }
        ).finished;
      }

      if (this.selectedElement && this.selectedElement.offsetParent) {
        this.scrollSelectedElementIntoView();
      }
    },
    switchOption(direction) {
      if (direction === 'previous' && !this.selectedElement) return;

      if (direction === 'next') {
        this.selectedElement = nextOrFirst(
          this.allOptionsArray,
          this.selectedElement
        );
      } else if (direction === 'previous') {
        this.selectedElement = previousOrLast(
          this.allOptionsArray,
          this.selectedElement
        );
      }

      if (!this.selectedElement.offsetParent) {
        this.currentResultsGroup = this.selectedElement.closest(
          '[data-results-group]'
        ).dataset.resultsGroup;
      }

      this.scrollSelectedElementIntoView();
    },
    scrollSelectedElementIntoView() {
      this.selectedElement.scrollIntoView({
        behavior: this.shouldAnimate ? 'smooth' : 'auto',
        block: 'end',
      });
    },
    selectOption() {
      if (this.selectedElement) {
        const selectedOptionAction =
          this.selectedElement.querySelector('a, button');

        if (selectedOptionAction) selectedOptionAction.click();
      }
    },
    onKeyup() {
      this.$event.preventDefault();

      switch (this.$event.code) {
        case 'ArrowUp':
          this.switchOption('previous');
          break;
        case 'ArrowDown':
          this.switchOption('next');
          break;
        case 'Enter':
          this.selectOption();
          break;
      }
    },
    onKeydown() {
      // Prevent the cursor from moving in the input when using the up and down arrow keys
      if (this.$event.code === 'ArrowUp' || this.$event.code === 'ArrowDown') {
        this.$event.preventDefault();
      }

      if (this.$event.code === 'Escape') {
        this.handleEscape();
      }
    },
    handleEscape() {
      const searchToggleEl = Array.from(
        document.querySelectorAll('[data-search-toggle]')
      ).filter((el) => !!el.offsetParent)[0];

      this.close(true, searchToggleEl);
    },
    isSelected() {
      return this.$el === this.selectedElement ? 'true' : 'false';
    },
  }));
});
