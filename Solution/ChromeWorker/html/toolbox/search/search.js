class SearchManager {
  /**
   * Create an instance of `SearchManager` class.
   * @constructor
   */
  constructor () {
    const store = new DocumentsStore();

    this.searchEngine = new BasSearchEngine([
      ...store.getActionItems(),
      ...store.getVideoItems(),
      ...store.getWikiItems(),
    ]);

    this.registerHandlers();
    this.lastQuery = null;
    this.pagesCount = 1;
    this.pageIndex = 0;
  }

  /**
   * Register all event handlers associated with the search page.
   */
  registerHandlers() {
    const self = this;

    $(document).on({
      mouseover(e) {
        if (!self.isModuleTarget(e)) $(this).css('border-color', '#7699af');
      },
      mouseout(e) {
        if (!self.isModuleTarget(e)) $(this).css('border-color', '#f2f5f7');
      },
      click(e) {
        const { group, popup, name, type, key } = $(this).data();

        if (self.isModuleTarget(e) && group) {
          BrowserAutomationStudio_GotoGroup(group);
          return self.hide();
        }

        if (type === 'link') {
          BrowserAutomationStudio_OpenUrl(key);
        } else if (!popup) {
          BrowserAutomationStudio_OpenAction(key);
        } else if (popup) {
          BrowserAutomationStudio_Notify('search', name);
        }
      }
    }, '.result-item');

    $(document).on('click', '#nextpage', (e) => {
      e.preventDefault();
      this.showPage(++this.pageIndex);
    });

    $(document).on('click', '#prevpage', (e) => {
      e.preventDefault();
      this.showPage(--this.pageIndex);
    });

    $(window).resize(() => {
      if (this.$search.is(':hidden')) return;

      if (this.lastQuery) {
        this.search(this.lastQuery);
      } else {
        this.recent();
      }
    });
  }

  /**
   * Check that the event target contains a class that belongs to the action module.
   * @param {{target: HTMLInputElement}} target - selected event target.
   */
  isModuleTarget({ target }) {
    return [
      target.parentNode.className,
      target.className
    ].includes('item-module');
  }

  /**
   * Check if all results are visible on the search page.
   * @readonly
   */
  get resultsVisible() {
    const bounding = this.$results.get(0).getBoundingClientRect();
    const { clientHeight, clientWidth } = document.documentElement;
    const { innerHeight, innerWidth } = window;

    return _.every([
      bounding.bottom <= (innerHeight || clientHeight),
      bounding.right <= (innerWidth || clientWidth),
      bounding.left >= 0,
      bounding.top >= 0
    ]);
  }

  /**
   * Perform an action search using the selected query.
   * @param {String} query - selected query string.
   */
  search(query) {
    this.$recentHeader.hide();
    this.$emptyHeader.hide();
    this.lastQuery = query;
    this.render(this.searchEngine.search(query));
  }

  /**
   * Perform an action search using the action history.
   */
  recent() {
    this.$recentHeader.show();
    this.$emptyHeader.hide();
    this.lastQuery = null;
    this.render(this.searchEngine.recent());
  }

  /**
   * Render the search results using selected items array.
   * @param {Object[]} items - selected items array.
   */
  render(items) {
    this.$results.empty();
    this.pagesCount = 1;
    this.pageIndex = 0;
    const results = [];

    items.slice(0, 100).forEach((item, index) => {
      const prev = this.pagesCount - 1;
      const next = this.pagesCount - 0;
      results.push(this.renderItem({
        page: prev,
        index,
        item
      }));

      if (!this.resultsVisible) {
        _.initial(results).forEach((res) => res.hide());

        if (index === 0) {
          _.last(results).data('page', prev);
        } else {
          _.last(results).data('page', next);
        }

        this.pagesCount += (index === 0) ? 0 : 1;
      }
    });

    this.showPage(0);
  }

  /**
   * Show the results page with the selected page index.
   * @param {Number} pageIndex - selected page index.
   */
  showPage(pageIndex) {
    const results = $('.result-item');

    results.each(function () {
      const { keywords, page } = $(this).data();
      // console.log('data:', $(this).data());

      if (page === pageIndex) {
        $(this).unmark();

        keywords.forEach(({ match, field }) => {
          if (field === 'suggestion') {
            $(this).find(`.item-additional`).mark(match);
          } else {
            $(this).find(`.item-${field}`).mark(match);
          }
        });
      }

      $(this).toggle(page === pageIndex);
    });

    this.$nextPage.prop('disabled', this.pageIndex === this.pagesCount - 1);
    this.$prevPage.prop('disabled', this.pageIndex === 0);
    this.$pagination.toggle(this.pagesCount > 1);
    this.$currPage.html(this.pageIndex + 1);
    this.$lastPage.html(this.pagesCount);

    if (this.lastQuery === null) {
      this.$emptyHeader.html(tr('No recent actions found'));
    } else {
      this.$emptyHeader.html(tr('Nothing found'));
    }

    this.$recentHeader.toggle(results.length !== 0 && this.lastQuery === null);
    this.$emptyHeader.toggle(results.length === 0);
  }

  /**
   * Initialize search page.
   */
  initialize() {
    this.$recentHeader = $('.results-recent').hide();
    this.$emptyHeader = $('.results-empty').hide();
    this.$recentHeader.text(tr('Recent actions'));

    this.$searchClear = $('#searchclear');
    this.$searchInput = $('#searchinput');

    this.$pagination = $('#pagination');
    this.$prevPage = $('#prevpage');
    this.$nextPage = $('#nextpage');
    this.$currPage = $('#currpage');
    this.$lastPage = $('#lastpage');

    this.$results = $('#results');
    this.$actions = $('.actions');
    this.$search = $('.search');

    this.toggle(true);
  }

  /**
   * Show or hide search page content depending on the condition.
   * @param {Boolean} hide - toggle condition.
   */
  toggle(hide) {
    $(document.body).css('overflow', hide ? 'visible' : 'hidden');

    this.$pagination.toggle(!hide);
    this.$actions.toggle(hide);
    this.$search.toggle(!hide);

    if (!hide) {
      this.$searchInput.focus().val('');
      this.recent();
    } else {
      this.$searchInput.blur().val('');
    }

    this.$searchClear.toggle(!hide);
  }

  /**
   * Show search page content if it's not already visible.
   */
  show() {
    if (this.$search.is(':visible')) return;
    this.toggle(false);
  }

  /**
   * Hide search page content if it's not already hidden.
   */
  hide() {
    if (this.$search.is(':hidden')) return;
    this.toggle(true);
  }

  /**
   * Render the search result using selected properties.
   * @param {Object} properties - selected properties.
   * @param {Number} properties.index - result index.
   * @param {Object} properties.item - result object.
   * @param {Number} properties.page - result page.
   * @returns {Object} rendered result.
   */
  renderItem({ item, page, index }) {
    const temp = { ...item, index };
    const data = { ...item, page };
    const template = _.template(`
      <li class="result-item bg-<%= type %>">
        <div class="result-item-left">
          <img draggable="false" class="item-icon" src="<%= icon %>">
          <span class="item-index"><%= _.padLeft(index + 1, 2, '0') %></span>
        </div>
        <div class="result-item-right">
          <div>
            <div class="item-name"><%= name %></div>
            <% if (type === 'action') { %>
              <div class="item-description"><%= description %></div>
            <% } %>
            <% if (suggestionInfo.found) { %>
              <div class="item-additional"><%= suggestion[suggestionInfo.index] %></div>
            <% } %>
          </div>
          <% if (type === 'action') { %>
            <div class="item-module"><%= module %></div>
          <% } %>
        </div>
      </li>
    `);

    return $(template(temp)).data(data).appendTo(this.$results);
  }
}