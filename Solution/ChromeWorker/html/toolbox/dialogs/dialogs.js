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
  static recentItemsScroll = 0;

  /**
   * Scroll position in pixels for `list-items` container.
   * @static
   */
  static listItemsScroll = 0;

  /**
   * Create an instance of `BasModalDialog` class.
   * @param {Object} configuration - dialog configuration object.
   * @param {String} configuration.itemColor - item color string.
   * @param {Object} configuration.itemNames - item names object.
   * @param {String} configuration.selector - element selector.
   * @param {Object[]} configuration.options - options array.
   * @param {Object[]} configuration.history - history array.
   * @param {Object[]} configuration.items - items array.
   * @constructor
   */
  constructor ({
    template = () => { },
    handler = () => { },
    itemColor = 'dark',
    itemNames = {},
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
    this.itemNames = itemNames;
    this.selector = selector;
    this.template = template;
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

    $(document).on('click', '.modal-recent-item', function (e) {
      self.closeDialog(self.items.find((i) => i.id === $(this).data('id')));
    });

    $(document).on('click', '.modal-list-item', function (e) {
      self.closeDialog(self.items.find((i) => i.id === $(this).data('id')));
    });

    $(document).on('input', '#modalSearchInput', (e) => {
      self.search($(e.target).val());
    });

    $(document).on('click', '#modalSearchClose', (e) => {
      self.closeDialog();
    });

    $(document).on('click', '#modalRecentClose', (e) => {
      self.closeRecent();
    });

    $(document).on('click', '#modalRecentOpen', (e) => {
      self.openRecent();
    });

    $(document).on('keyup', function (e) {
      if (!(self.$modal && e.key === 'Escape')) return;
      e.stopPropagation();
      self.closeDialog();
    });

    $(window).resize(function (e) {
      if (!self.$modal) return;
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
      const $list = $(list), search = !!target.length;
      let some = false;

      if (trim($header.text()) === target[0] || !search) {
        _.each($items, (item) => {
          const $item = $(item).unmark();

          if (search) {
            const { name } = _.find(this.items, { id: $item.data('id') });

            if (trim(name).includes(target)) {
              some = true; return $item.show().mark(target, {
                className: 'modal-text-mark',
                diacritics: false,
                iframes: false
              });
            }

            return $item.hide();
          }

          $item.show();
        });

        if (search && !some) {
          $list.hide();
        } else {
          $list.show();
        }
      } else {
        $list.hide();
      }
    });
  }

  /**
   * Render the modal window.
   */
  render() {
    const template = _.template(`
      <div id="modalDialogContainer">
        <div id="modalSearchContainer">
          <input type="text" id="modalSearchInput" placeholder="<%= tr('Start typing ' + itemNames.single + ' name...') %>">
          <span id="modalSearchIcon" class="modal-search-control">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.167 22.833a6.667 6.667 0 100-13.333 6.667 6.667 0 000 13.333zM24.5 24.5l-3.625-3.625" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>        
          </span>
          <button id="modalSearchClose" class="modal-search-control">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 6l-8 8M6 6l8 8" stroke="#c56d5f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div id="modalContentContainer">
          <div class="modal-list-container">
            <div class="modal-list-wrapper">
              <% _.keys(map).forEach((header) => { %>
                <div class="modal-list-wrap">
                  <div class="modal-list">
                    <div class="modal-list-header">
                      <div class="modal-list-header-content"><%= header %></div>
                      <div class="modal-list-header-splitter"></div>
                    </div>
                    <ul class="modal-list-items">
                      <% map[header].forEach((item) => { %>
                        <li class="modal-list-item" data-id="<%= item.id %>">
                          <div class="modal-text-normal modal-text-<%= itemColor %>">
                            <%= template(item) %>
                          </div>
                        </li>
                      <% }); %>
                    </ul>
                  </div>
                </div>
              <% }); %>
            </div>
          </div>
          <div class="modal-recent-container">
            <div id="modalRecentHeader">
              <div class="modal-recent-header-content">Recent <%= itemNames.many %>:</div>
              <div class="modal-recent-header-image-icon">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 16L11 1M14.3333 16L2.66667 16C1.74619 16 1 15.2538 1 14.3333L1 2.66667C1 1.74619 1.74619 1 2.66667 1L14.3333 1C15.2538 1 16 1.74619 16 2.66667V14.3333C16 15.2538 15.2538 16 14.3333 16Z" stroke="#4f4f4f" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              <button id="modalRecentClose" class="modal-recent-header-button">
                <svg width="6" height="17" viewBox="0 0 6 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 1 12.5 L 5 8.5 L 1 4.5" stroke="#7b7b7b" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>                
              </button>
            </div>
            <div id="modalRecentContent">
              <ul class="modal-recent-items">
                <% history.forEach((item) => { %>
                  <li class="modal-recent-wrap">
                    <div class="modal-recent-item" data-id="<%= items.find(({ name }) => name === item.name).id %>">
                      <div class="modal-recent-icon-left"></div>
                      <div class="modal-recent-text modal-text-<%= itemColor %>">
                        <%= item.name %>
                      </div>
                      <div class="modal-recent-icon-right">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.5 5.583H15a4.167 4.167 0 010 8.334h-2.5m-5 0H5a4.167 4.167 0 010-8.334h2.5M6.667 9.75h6.666" stroke="#E3E3E3" stroke-opacity=".5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>                
                      </div>
                    </div>
                  </li>
                <% }); %>
              </ul>
              <button id="modalRecentOpen" class="modal-recent-header-button">
                <svg width="6" height="17" viewBox="0 0 6 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 1 12.5 L 5 8.5 L 1 4.5" stroke="#7b7b7b" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>                
              </button>
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

    this.$recent = $('.modal-recent-container').show()
      .scrollTop(this.constructor.recentItemsScroll);

    this.$list = $('.modal-list-container').show()
      .scrollTop(this.constructor.listItemsScroll);

    $('body').css('overflow', 'hidden');

    if (!this.history.length) {
      this.$recent.hide();
    }

    this.addHandlers();
    this.closeRecent();
  }

  /**
   * Close the dialog window.
   */
  closeDialog(value = {}) {
    if (!this.$modal) return;

    const options = _.object(this.options.map((o) => [o.id, $(`#${o.id}`).is(':checked')]));
    this.constructor.recentItemsScroll = this.$recent.scrollTop();
    this.constructor.listItemsScroll = this.$list.scrollTop();
    $('body').css('overflow', 'visible');
    this.$modal.remove();
    this.$modal = null;

    this.handler(value.name || '', { selector: this.selector, options, ...value });
  }

  /**
   * Close the recent window.
   */
  closeRecent() {
    const recent = this.$recent.css('width', '48px');
    recent.find('.modal-recent-header-content').hide();
    recent.find('.modal-recent-items').hide();
    recent.find('#modalRecentClose').hide();
    recent.find('#modalRecentOpen').show();
    recent.find('#modalRecentContent')
      .removeClass('modal-pseudo-lg')
      .addClass('modal-pseudo-sm')
      .css('overflow', 'visible');
  }

  /**
   * Open the recent window.
   */
  openRecent() {
    const recent = this.$recent.css('width', 'auto');
    recent.find('.modal-recent-header-content').show();
    recent.find('.modal-recent-items').show();
    recent.find('#modalRecentClose').show();
    recent.find('#modalRecentOpen').hide();
    recent.find('#modalRecentContent')
      .removeClass('modal-pseudo-sm')
      .addClass('modal-pseudo-lg')
      .css('overflow', 'hidden');
  }
}