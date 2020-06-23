class SearchManager {
  /**
   * Create an instance of `SearchManager` class.
   * @constructor
   */
  constructor () {
    this.engine = new BasSearchEngine();

    this.lastQuery = null;
    this.pagesCount = 1;
    this.pageIndex = 0;

    this.registerEventHandlers();
  }

  /**
   * Register all event handlers associated with the search page.
   */
  registerEventHandlers() {
    $(document).on('click', '.result-item', function () {
      const { popup, name, type, key } = $(this).data();

      if (type === 'link') {
        BrowserAutomationStudio_OpenUrl(key);
      } else if (!popup) {
        BrowserAutomationStudio_OpenAction(key);
      } else if (popup) {
        BrowserAutomationStudio_Notify('search', name);
      }
    });

    $(document).on('click', '#nextpage', (e) => {
      e.preventDefault();
      this.showPage(++this.pageIndex);
    });

    $(document).on('click', '#prevpage', (e) => {
      e.preventDefault();
      this.showPage(--this.pageIndex);
    });

    $(window).resize(() => {
      if (this.$searchContainer.is(':visible')) {
        if (this.lastQuery) {
          this.search(this.lastQuery);
        } else {
          this.recent();
        }
      }
    });
  }

  /**
   * Check if all results are visible on the search page.
   * @readonly
   */
  get resultsVisible() {
    const bounding = this.$resultsContainer.get(0).getBoundingClientRect();
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
    this.renderSearch(this.engine.search(query));
  }

  /**
   * Perform an action search using the action history.
   */
  recent() {
    this.$recentHeader.show();
    this.$emptyHeader.hide();
    this.lastQuery = null;
    this.renderSearch(this.engine.recent());
  }

  renderSearch(items) {
    this.$resultsContainer.empty();
    this.pagesCount = 1;
    this.pageIndex = 0;
    const results = [];

    items.slice(0, 100).forEach((item, idx) => {
      const prev = this.pagesCount - 1;
      const next = this.pagesCount - 0;

      const result = $(this.renderItem(item, idx))
        .appendTo(this.$resultsContainer)
        .data({ ...item, page: prev });

      results.push(result);

      if (!this.resultsVisible) {
        _.initial(results).forEach((res) => res.hide());

        if (idx === 0) {
          _.last(results).data('page', prev);
        } else {
          _.last(results).data('page', next);
        }

        this.pagesCount += (idx === 0) ? 0 : 1;
      }
    });

    this.showPage(0);
  }

  showPage(pageIndex) {
    const results = $('.result-item');

    results.each(function () {
      const matches = $(this).data('matches');
      const page = $(this).data('page');

      if (page === pageIndex) {
        $(this).unmark();

        matches.forEach(({ match, field }) => {
          $(this).find(`.item-${field}`).mark(match);
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

  initialize() {
    this.$recentHeader = $('.results-recent').hide();
    this.$emptyHeader = $('.results-empty').hide();
    this.$recentHeader.text(tr('Recent actions'));

    this.$resultsContainer = $('#results');
    this.$actionsContainer = $('.actions');
    this.$searchContainer = $('.search');

    this.$searchClear = $('#searchinputclear');
    this.$searchInput = $('#searchinput');

    this.$pagination = $('#pagination');
    this.$prevPage = $('#prevpage');
    this.$nextPage = $('#nextpage');
    this.$currPage = $('#currpage');
    this.$lastPage = $('#lastpage');

    this.toggle(true);
  }

  /**
   * Show or hide search page content depending on the condition.
   * @param {Boolean} hide - toggle condition.
   */
  toggle(hide) {
    $(document.body).css('overflow', hide ? 'visible' : 'hidden');

    this.$actionsContainer.toggle(hide);
    this.$searchContainer.toggle(!hide);
    this.$pagination.toggle(!hide);

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
    if (this.$searchContainer.is(':visible')) return;
    this.toggle(false);
  }

  /**
   * Hide search page content if it's not already hidden.
   */
  hide() {
    if (this.$searchContainer.is(':hidden')) return;
    this.toggle(true);
  }

  renderItem(item, index) {
    const templates = {
      action: _.template(`
        <li class="result-item bg-action">
          <div class="result-item-left">
            <img draggable="false" class="item-icon" src="<%= icon %>">
            <span class="item-index"><%= _.padLeft(index + 1, 2, '0') %></span>
          </div>
          <div class="result-item-right">
            <div>
              <div class="item-name"><%= name %></div>
              <div class="item-description"><%= description %></div>
            </div>
            <div class="item-module"><%= module %></div>
          </div>
        </li>
      `),
      link: _.template(`
        <li class="result-item bg-link">
          <div class="result-item-left">
            <img draggable="false" class="item-icon" src="<%= icon %>">
            <span class="item-index"><%= _.padLeft(index + 1, 2, '0') %></span>
          </div>
          <div class="result-item-right">
            <div>
              <div class="item-name"><%= name %></div>
            </div>
          </div>
        </li>
      `),
    };

    return templates[item.type]({ ...item, index });
  }
}