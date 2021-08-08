(({ Scenario, Backbone }, $, _) => {
  const { Inspector, utils } = Scenario;

  const View = Backbone.View.extend({
    initialize() {
      const model = this.model;

      if (model.get('allowHighlight')) {
        model.on('highlight', ({ count, path }) => {
          const $node = this.$(`[data-path="${path}"]`);

          if ($node.length) {
            const { type } = $node[0].dataset;
            if (['object', 'array'].includes(type)) return;

            const scale = chroma.scale(['red', Scenario.JSONViewer.colors[type]]);
            $node.css('color', scale.mode('rgb').colors(6)[Math.min(count, 6) - 1]);
          }
        });
      }

      model.on('change:typesVisibility', () => {
        this.filterTree();
      });

      model.on('change:source', (__, source) => {
        const $data = this.$('.inspector-panel-data');
        const isEmpty = _.isEmpty(source);

        if (!isEmpty) this.viewer.model.update(source);
        $data.toggle(!isEmpty).prev().toggle(isEmpty);
      });

      model.on('change:sortType', (__, type) => {
        this.sortTree(type);
      });

      $(document).on('click', ':not(.inspector-filter-menu)', (e) => {
        this.$('.inspector-filter-menu').hide();
      });

      $(document).on('click', ':not(.inspector-sort-menu)', (e) => {
        this.$('.inspector-sort-menu').hide();
      });
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template(this.model.toJSON()));

        this.viewer = (new Scenario.JSONViewer())
          .on('node:collapse', () => {
            BrowserAutomationStudio_PreserveInterfaceState();
          })
          .on('node:expand', () => {
            BrowserAutomationStudio_PreserveInterfaceState();
          })
          .on('render', () => {
            this.sortTree(this.model.get('sortType'));
            this.filterTree().loadState();
          });

        this.$('.inspector-panel-data').append(this.viewer.el);
      }

      return this;
    },

    sortTree(type) {
      const metadata = this.model.get('metadata');
      const updates = this.model.get('updates');
      const cache = this.model.get('cache');

      utils.sortByLocals(this.model.get('source'), (a, b) => {
        if (type !== 'alphabetically') {
          const meta1 = metadata[`/${a}`];
          const meta2 = metadata[`/${b}`];

          if (type === 'dateModified') {
            return meta2.modifiedAt - meta1.modifiedAt;
          }

          if (type === 'dateAdded') {
            return meta2.addedAt - meta1.addedAt;
          }

          const f1 = cache.filter(v => v === a).length + updates;
          const f2 = cache.filter(v => v === b).length + updates;
          return (meta2.usages / f2) - (meta1.usages / f1);
        }

        return a.localeCompare(b);
      }).forEach(key => {
        const el = this.el.querySelector(`[data-path="/${key}"]`);
        el.parentNode.parentNode.appendChild(el.parentNode);
      });

      return this;
    },

    filterTree() {
      const query = this.$('.inspector-filter-input').val().toLowerCase();

      this.$('.jst-root > li > ul > li').each((__, el) => {
        const $el = $(el);

        if (query.length) {
          const $label = $el.children('.jst-label');
          const text = $label.text().toLowerCase();
          return $el.toggle(text.includes(query));
        } else {
          const { dataset } = $el.children('[data-path]')[0];
          const types = this.model.get('typesVisibility');

          if (_.has(types, dataset.type)) {
            return $el.toggle(types[dataset.type]);
          }
        }

        $el.show();
      });

      return this;
    },

    loadState(state = this.model.get('state')) {
      [state.objects, state.arrays].forEach((data) => {
        if (Array.isArray(data)) {
          data.forEach(({ path, folded }) => {
            const $el = this.$el.find(`[data-path="${path}"]`);
            if (folded && !$el.hasClass('jst-collapsed')) {
              $el.prev('.jst-collapse').click();
            }
          });
        }
      });

      this.model.set('state', state);
    },

    saveState() {
      this.model.set('state', {
        objects: _.map(this.$el.find('[data-type="object"]'), el => ({
          folded: el.classList.contains('jst-collapsed'),
          path: el.dataset.path,
        })),
        arrays: _.map(this.$el.find('[data-type="array"]'), el => ({
          folded: el.classList.contains('jst-collapsed'),
          path: el.dataset.path,
        })),
      });

      return this.model.get('state');
    },

    events: {
      'change .inspector-filter-menu-item > input': function (e) {
        const $el = $(e.target), type = $el.val();

        this.model.set('typesVisibility', {
          ...this.model.get('typesVisibility'),
          [type]: $el.prop('checked')
        });
      },

      'click .inspector-filter-menu-item': function (e) {
        e.stopPropagation();
      },

      'click .inspector-sort-menu-item': function (e) {
        e.preventDefault();
        e.stopPropagation();
        const $el = $(e.target);
        const type = $el.data('sortType');
        this.model.set('sortType', type);
      },

      'click .inspector-filter-button': function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $menu = $(e.currentTarget).next('.inspector-filter-menu');
        const isVisible = $menu.toggle().is(':visible');
        if (isVisible) $menu.prevAll('ul').hide();
      },

      'click .inspector-sort-button': function (e) {
        e.preventDefault();
        e.stopPropagation();

        const $menu = $(e.currentTarget).next('.inspector-sort-menu');
        const isVisible = $menu.toggle().is(':visible');
        if (isVisible) $menu.nextAll('ul').hide();
      },

      'input .inspector-filter-input': _.debounce(function (e) {
        this.filterTree()
      }, 200),

      'keydown .inspector-filter-input': function (e) {
        if (e.key === ' ') e.preventDefault();
      },
    }
  });

  Inspector.ScriptDataView = View;
})(window, jQuery, _);