class BasModalDialog {
  /**
   * Create an instance of the modal dialog using the configuration object.
   * @param {Object} configuration - dialog configuration object.
   * @returns {BasModalDialog} modal dialog instance.
   * @static
   */
  static create(configuration) { return new this(configuration); }

  /**
   * Store instance that contains different recent items arrays.
   * @static
   */
  static store = new DialogsStore();

  /**
   * Scroll position in pixels for `recent-items` container.
   * @static
   */
  static recentItemsScrollTop = 0;

  /**
   * Scroll position in pixels for `list-items` container.
   * @static
   */
  static listItemsScrollTop = 0;

  /**
   * Create an instance of `BasModalDialog` class.
   * @param {Object} configuration - dialog configuration object.
   * @param {String} configuration.itemColor - item color string.
   * @param {Object} configuration.itemTypes - item types object.
   * @param {String} configuration.selector - element selector.
   * @param {Object[]} configuration.options - options array.
   * @param {Object[]} configuration.history - history array.
   * @param {Object[]} configuration.items - items array.
   * @constructor
   */
  constructor ({
    handler = () => { },
    itemColor = 'dark',
    itemTypes = {},
    selector = '',
    options = [],
    history = [],
    items = []
  } = {}) {
    this.map = _(jsort(items))
      .map((val, id) => ({ id, ...val }))
      .tap((array) => this.items = array)
      .groupBy((val) => val.name[0])
      .value();

    this.helper = new DialogsHelper();
    this.itemColor = itemColor;
    this.itemTypes = itemTypes;
    this.selector = selector;
    this.handler = handler;
    this.options = options;
    this.history = history;

    this.$recent = null;
    this.$modal = null;
    this.$list = null;

    this.render();
  }

  /**
   * Add all event handlers associated with the modal dialog.
   */
  addHandlers() {
    const self = this;

    $(document).on('click', '#modalSearchRecent', function (e) {
      self.recent();
    });

    $(document).on('click', '#modalSearchClose', function (e) {
      self.close();
    });

    $(document).on('input', '#modalSearchInput', function (e) {
      const value = $(e.target).val().trim();
      self.search(value);
    });

    $(document).on('click', '.modal-list-item', function (e) {
      const value = self.items.find((i) => i.id === $(this).data('id'));
      self.close(value);
    });

    $(document).on('keyup', function (e) {
      if (!(self.$modal && e.key === 'Escape')) return;
      e.stopPropagation();
      self.close();
    });

    $(window).resize(function (e) {
      self.$modal.css('height', window.innerHeight * (100.0 / _Z) + 'px');
    });
  }

  /**
   * Perform an items search using the selected query.
   * @param {String} query - selected query string.
   */
  search(query) {
    const trim = (str) => str.toLowerCase().trim(), target = trim(query);

    _.each($('.modal-list'), (list) => {
      const $header = $(list).find('.modal-list-header');
      const $items = $(list).find('.modal-list-item');

      if (trim($header.text()) === target[0] || !target.length) {
        _.each($items, (item) => {
          if (target.length) {
            const { name } = _.find(this.items, { id: $(item).data('id') });

            if (trim(name).includes(target)) {
              $(item).show();
            } else {
              $(item).hide();
            }

            return;
          }

          $(item).show();
        });

        $(list).show();
      } else {
        $(list).hide();
      }
    });
  }

  /**
   * Render the modal window.
   */
  render() {
    const template = _.template(`
      <div class="modal-dialog-container">
        <div class="modal-search-container">
          <input type="text" id="modalSearchInput" class="modal-search-input" placeholder="<%= tr('Start typing ' + itemTypes.single + ' name...') %>">
          <button type="button" id="modalSearchClose" class="modal-search-button modal-search-close">
            <i class="fa fa-fw fa-times" aria-hidden="true" />
          </button>
          <button type="button" id="modalSearchRecent" class="modal-search-button modal-search-recent">
            <i class="fa fa-fw fa-list" aria-hidden="true" />
          </button>
        </div>
        <div class="modal-content-container">
          <div class="modal-list-container">
            <% _.keys(map).forEach((header) => { %>
              <div class="modal-list">
                <div class="modal-list-header">
                  <div class="modal-list-header-content"><%= header %></div>
                  <div class="modal-list-header-splitter"></div>
                </div>
                <ul class="modal-list-items">
                  <% map[header].forEach((item) => { %>
                    <li class="modal-list-item" data-id="<%= item.id %>">
                      <div class="modal-text-normal modal-text-<%= itemColor %>">
                        <%= itemContentTemplate({ item }) %>
                      </div>
                    </li>
                  <% }); %>
                </ul>
              </div>
            <% }); %>
          </div>
          <div class="modal-recent-container">
            <div class="modal-recent">
              <div class="modal-recent-header">Recent <%= itemTypes.many %>:</div>
              <ul class="modal-recent-items">
                <% history.forEach((item) => { %>
                  <li class="modal-recent-item"><%= item.name %></li>
                <% }); %>
              </ul>
            </div>
          </div>
        </div>
        <% if (options.length) { %>
          <div class="modal-options-container">
            <% options.forEach((option) => { %>
              <div class="modal-option" data-toggle="tooltip" data-placement="top" title="<%= tr(option.description) %>">
                <input type="checkbox" id="<%= option.id %>" <%= option.checked ? 'checked' : '' %> /> 
                <label for="<%= option.id %>"><%= option.text %></label>
              </div>
            <% }); %>
          </div>
        <% } %>
      </div>
    `);

    this.$modal = $(template(this)).appendTo('body').show();

    this.$recent = $('.modal-recent-container');
    this.$recent.scrollTop(this.constructor.recentItemsScrollTop);
    this.$list = $('.modal-list-container');
    this.$list.scrollTop(this.constructor.listItemsScrollTop);

    $('.modal-recent-container').hide();

    this.addHandlers();
  }

  /**
   * Close the modal window.
   */
  close(value = {}) {
    if (!this.$modal) return;

    const options = _.object(this.options.map((o) => [o.id, $(`#${o.id}`).is(':checked')]));
    this.constructor.recentItemsScrollTop = this.$recent.scrollTop();
    this.constructor.listItemsScrollTop = this.$list.scrollTop();
    this.$modal.remove();
    this.$modal = null;

    this.handler(value.name ? value.name : '', { selector: this.selector, options, ...value });
  }


  /**
   * Show or hide the recent elements.
   */
  recent() {
    if (this.$recent.is(':visible')) {
      this.$recent.hide();
    } else {
      this.$recent.show();
    }
  }
}