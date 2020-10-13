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
      .tap((array) => this.items = array)
      .groupBy((item) => item.name[0])
      .value();

    this.metadata = metadata;
    this.options = options;
    this.recent = recent;
    this.renderDialog();
    this.addHandlers();
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
      const { ref, clickable } = $(this).data();

      if (clickable) {
        BrowserAutomationStudio_OpenAction(ref);
        self.closeDialog();
      }

      e.preventDefault();
    });

    this.$modal.on('mouseover', '.modal-list-item', function (e) {
      if (isClickable(e.target)) return;
      $(this).css('background', '#f0fbeb');
      e.preventDefault();
    });

    this.$modal.on('mouseout', '.modal-list-item', function (e) {
      if (isClickable(e.target)) return;
      $(this).css('background', '#ffffff');
      e.preventDefault();
    });

    this.$modal.on('click', '.modal-recent-item', function (e) {
      self.closeDialog(_.find(self.items, 'id', $(this).data('id')));
      e.preventDefault();
    });

    this.$modal.on('click', '.modal-list-item', function (e) {
      self.closeDialog(_.find(self.items, 'id', $(this).data('id')));
      e.preventDefault();
    });

    this.$modal.on('click', '.modal-option', function (e) {
      $(this).find('input').prop('checked', (_, checked) => !checked);
      e.preventDefault();
    });

    this.$modal.on('click', '#modalRecentContainer', (e) => {
      if (self.$showRecent.is(':hidden')) return;
      e.stopPropagation();
      e.preventDefault();
      self.showRecent();
    });

    this.$modal.on('click', '#modalRecentHeader', (e) => {
      if (self.$hideRecent.is(':hidden')) return;
      e.stopPropagation();
      e.preventDefault();
      self.hideRecent();
    });

    this.$modal.on('click', '#modalSearchClose', (e) => {
      e.stopPropagation();
      e.preventDefault();
      self.closeDialog();
    });

    this.$modal.on('click', '#modalRecentHide', (e) => {
      e.stopPropagation();
      e.preventDefault();
      self.hideRecent();
    });

    this.$modal.on('click', '#modalRecentShow', (e) => {
      e.stopPropagation();
      e.preventDefault();
      self.showRecent();
    });

    this.$modal.on('click', '#modalListAdd', (e) => {
      e.stopPropagation();
      e.preventDefault();
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

    function isClickable(target) {
      return _.any([
        target.parentNode.dataset.clickable === 'true',
        target.dataset.clickable === 'true'
      ]);
    }
  }

  /**
   * Perform an items search using the selected query.
   * @param {String} query - selected query string.
   */
  search(query) {
    const trim = (str) => str.toLowerCase().trim(), target = trim(query);

    _.each($('.modal-list-wrap'), (list) => {
      const $list = $(list), search = !!target.length; let some = false;

      _.each($(list).find('.modal-list-item'), (item) => {
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

      $list.toggle(!search || some);
    });

    if ($('.modal-list-wrap:hidden').size() === _.size(this.map)) {
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
    this.$recentContainer = $('#modalRecentContainer');
    this.$recentContent = $('#modalRecentContent');
    this.$recentWrapper = $('#modalRecentWrapper');
    this.$listWrapper = $('#modalListWrapper');
    this.$listContent = $('#modalListContent');
    this.$searchInput = $('#modalSearchInput');
    this.$hideRecent = $('#modalRecentHide');
    this.$showRecent = $('#modalRecentShow');
    this.$listEmpty = $('#modalListEmpty');
    this.$listAdd = $('#modalListAdd');

    this.$recentWrapper.scrollTop(this.constructor.recentItemsScroll);
    this.$listWrapper.scrollTop(this.constructor.listItemsScroll);

    $(document.body).css('overflow', 'hidden');

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
    this.constructor.recentItemsScroll = this.$recentWrapper.scrollTop();
    this.constructor.listItemsScroll = this.$listWrapper.scrollTop();
    $(document.body).css('overflow', 'visible');
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
    $('#modalRecentHeaderText').hide();
    this.$recentContent.css('overflow', 'visible')
      .removeClass('modal-pseudo-lg')
      .addClass('modal-pseudo-sm');
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
    $('#modalRecentHeaderText').show();
    this.$recentContent.css('overflow', 'hidden')
      .removeClass('modal-pseudo-sm')
      .addClass('modal-pseudo-lg');
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

    if (window.matchMedia('(max-width: 525px)').matches && this.recent.length) {
      this.$recentContainer.hide();
    }

    if (window.matchMedia('(min-width: 525px)').matches && this.recent.length) {
      this.$recentContainer.show();
    }

    this.$modal.css('height', `${window.innerHeight * (100.0 / _Z)}px`);
  }
}