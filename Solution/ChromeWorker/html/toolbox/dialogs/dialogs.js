BasDialogsLib.BasModalDialog = class {
  /**
   * Create an instance of the modal dialog using the configuration object.
   * @param {Object} configuration - dialog configuration object.
   * @returns {BasModalDialog} modal dialog instance.
   * @static
   */
  static create(configuration) { return new this(configuration); }

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
   * @param {Object} configuration.metadata - metadata object.
   * @param {Object[]} configuration.options - options array.
   * @param {Object[]} configuration.recent - recent array.
   * @param {Object[]} configuration.items - items array.
   * @constructor
   */
  constructor ({ metadata = {}, options = [], recent = [], items = [] } = {}) {
    this.map = _(jsort(items))
      .map((item, id) => ({ id, ...item }))
      .tap((array) => (this.items = array))
      .groupBy((item) => item.name[0].toUpperCase())
      .value();

    this.recent = recent.filter((r) => items.some(metadata.findPredicate(r)));
    this.metadata = metadata;
    this.options = options;
    this.renderDialog();
    this.addHandlers();
  }

  /**
   * Restore scroll state for recent and default items of the modal dialog.
   */
  restoreScrollState() {
    if (!this.$modal) return;
    this.$recentWrapper.scrollTop(this.constructor.recentItemsScroll);
    this.$listWrapper.scrollTop(this.constructor.listItemsScroll);
    $(document.body).css('overflow', 'hidden');
  }

  /**
   * Save scroll state for recent and default items of the modal dialog.
   */
  saveScrollState() {
    if (!this.$modal) return;
    this.constructor.recentItemsScroll = this.$recentWrapper.scrollTop();
    this.constructor.listItemsScroll = this.$listWrapper.scrollTop();
    $(document.body).css('overflow', 'visible');
  }

  /**
   * Add all event handlers associated with the modal dialog.
   */
  addHandlers() {
    const self = this, $document = $(document), $window = $(window);

    this.$modal.on('input', '#modalSearchInput', _.debounce((e) => {
      self.search($(e.target).val());
    }, 250));

    this.$modal.on('click', '.modal-list-item-desc', function (e) {
      const data = $(this).data();

      if (data.clickable) {
        if (data.popup) {
          BrowserAutomationStudio_Notify('search', data.description);
        } else {
          BrowserAutomationStudio_OpenAction(data.ref);
          self.closeDialog();
        }

        e.stopPropagation();
      }

      e.preventDefault();
    });

    this.$modal.on('mouseover', '.modal-list-content', function (e) {
      if (BasDialogsLib.utils.isClickable(e.target)) return;
      $(this).css('background', '#f0fbeb');
      e.preventDefault();
    });

    this.$modal.on('mouseout', '.modal-list-content', function (e) {
      if (BasDialogsLib.utils.isClickable(e.target)) return;
      $(this).css('background', '#ffffff');
      e.preventDefault();
    });

    this.$modal.on('click', '.modal-list-content', function (e) {
      self.closeDialog(_.find(self.items, 'id', $(this).data('id')));
      e.preventDefault();
    });

    this.$modal.on('click', '.modal-recent-item', function (e) {
      self.closeDialog(_.find(self.items, 'id', $(this).data('id')));
      e.preventDefault();
    });

    this.$modal.on('click', '.modal-option', function (e) {
      $(this).find('input').prop('checked', (_, checked) => !checked);
      e.preventDefault();
    });

    this.$modal.on('click', '#modalRecentContainer', (e) => {
      if (self.$showRecent.is(':hidden')) return;
      e.stopPropagation(); e.preventDefault();
      self.showRecent();
    });

    this.$modal.on('click', '#modalRecentHeader', (e) => {
      if (self.$hideRecent.is(':hidden')) return;
      e.stopPropagation(); e.preventDefault();
      self.hideRecent();
    });

    this.$modal.on('click', '#modalSearchClose', (e) => {
      e.stopPropagation(); e.preventDefault();
      self.closeDialog();
    });

    this.$modal.on('click', '#modalListAdd', (e) => {
      e.stopPropagation(); e.preventDefault();
      self.onAdd();
    });

    _GobalModel.on('change:isedit', (model) => {
      if (self.$modal && model.get('isedit')) {
        self.closeDialog();
      }
    });

    $document.keydown(function (e) {
      if (!self.$modal || e.key.length !== 1) return;
      self.focusSearch();
    });

    $document.keyup(function (e) {
      if (!self.$modal || e.key !== 'Escape') return;
      self.closeDialog();
    });

    $window.resize(() => self.resize());
  }

  /**
   * Perform an items search using the selected query.
   * @param {String} query - selected query string.
   */
  search(query) {
    const utils = BasDialogsLib.utils, target = utils.format(query);

    _.each(this.map, (items) => {
      let first = true;

      _.each(items, ({ name, id }, index) => {
        const $item = $(`.modal-list-item[data-id="${id}"]`),
          $content = $item.find('.modal-list-content'),
          $header = $item.find('.modal-list-header');
        $content.unmark();

        if (target.length) {
          if (utils.format(name).includes(target)) {
            $content.mark(target, {
              className: 'modal-text-mark',
              diacritics: false,
              iframes: false,
            });

            if (first) {
              utils.showHeader($header);
              first = false;
            }

            return $item.show();
          }

          return $item.hide();
        } else if (index === 0) {
          utils.showHeader($header);
        } else if (index !== 0) {
          utils.hideHeader($header);
        }

        $item.show();
      });
    });

    if ($('.modal-list-item:hidden').size() === _.size(this.items)) {
      this.$listEmpty.show();
    } else {
      this.$listEmpty.hide();
    }
  }

  /**
   * Render the modal dialog window.
   */
  renderDialog() {
    this.$modal = $(BasDialogsLib.templates.main(this)).appendTo('body');
    this.$recentHeaderText = $('#modalRecentHeaderText');
    this.$recentContainer = $('#modalRecentContainer');
    this.$recentContent = $('#modalRecentContent');
    this.$recentWrapper = $('#modalRecentWrapper');
    this.$listContent = $('#modalListContent');
    this.$listWrapper = $('#modalListWrapper');
    this.$searchInput = $('#modalSearchInput');
    this.$hideRecent = $('#modalRecentHide');
    this.$showRecent = $('#modalRecentShow');
    this.$listEmpty = $('#modalListEmpty');
    this.$listAdd = $('#modalListAdd');
    this.restoreScrollState();

    if (!this.recent.length) {
      this.$recentContainer.hide();
    }

    if (!this.items.length) {
      this.$listEmpty.show();
    }

    this.showRecent();
  }

  /**
   * Close the modal dialog window.
   */
  closeDialog(selected = {}) {
    if (!this.$modal) return;

    const options = _.object(this.options.map((o) => [o.id, $(`#${o.id}`).is(':checked')]));
    this.saveScrollState();
    this.$modal.unbind();
    this.$modal.remove();
    this.$modal = null;

    if (this.onClose) {
      this.onClose(selected.name || '', { options, ...selected });
    }
  }

  /**
   * Focus the modal search input. 
   */
  focusSearch() {
    if (!this.$searchInput.is(':focus')) {
      this.$searchInput.focus();
    }
  }

  /**
   * Hide the recent items window.
   */
  hideRecent() {
    this.$recentContainer.css('width', '48px');
    this.$recentContent
      .removeClass('modal-recent-lg')
      .addClass('modal-recent-sm');
    this.$recentHeaderText.hide();
    this.$recentWrapper.hide();
    this.$hideRecent.hide();
    this.$showRecent.show();
    this.resize();
  }

  /**
   * Show the recent items window.
   */
  showRecent() {
    this.$recentContainer.css('width', 'auto');
    this.$recentContent
      .removeClass('modal-recent-sm')
      .addClass('modal-recent-lg');
    this.$recentHeaderText.show();
    this.$recentWrapper.show();
    this.$hideRecent.show();
    this.$showRecent.hide();
    this.resize();
  }

  /**
   * Resize the modal window.
   */
  resize() {
    if (!this.$modal) return;

    if (this.recent.length) {
      const width = this.$recentContainer.outerWidth() + 292;

      if (window.matchMedia(`(max-width: ${width}px)`).matches) {
        this.$recentContainer.hide();
      }

      if (window.matchMedia(`(min-width: ${width}px)`).matches) {
        this.$recentContainer.show();
      }
    }

    this.$modal.css('height', `${window.innerHeight * (100.0 / _Z)}px`);
  }
}