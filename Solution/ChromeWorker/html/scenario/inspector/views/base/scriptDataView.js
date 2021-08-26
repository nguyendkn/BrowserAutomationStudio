(({ App, Backbone }, $, _) => {
  const { Inspector, utils } = App;

  const View = Backbone.View.extend({
    colors: scaleColors({
      undefined: '#808080',
      boolean: '#2525cc',
      string: '#2db669',
      number: '#d036d0',
      date: '#ce904a',
      null: '#808080',
    }),

    initialize() {
      const model = this.model;

      if (model.get('allowHighlight')) {
        model.on('highlight', ({ count, path }) => {
          const $node = this.$(`[data-path="${path}"]`);

          if ($node.length) {
            const { type } = $node[0].dataset;
            if (type === 'object') return;
            if (type === 'array') return;

            $node.css('color', this.colors[type][count]);
          }
        });
      }

      model.on('change:source', (__, source) => {
        this.$('.inspector-panel')[0].dataset.empty = _.isEmpty(source);
        this.viewer.model.update(source);
      });

      model.on('change:filters', this.filterItems, this);

      model.on('change:sorting', this.sortItems, this);
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template(this.model.toJSON()));

        this.viewer = (new Inspector.Viewer())
          .on('node:collapse', () => {
            BrowserAutomationStudio_PreserveInterfaceState();
          })
          .on('node:expand', () => {
            BrowserAutomationStudio_PreserveInterfaceState();
          })
          .on('render', () => {
            this.restoreState();
            this.filterItems();
            this.sortItems();
          });

        this.$('.inspector-panel-data').append(this.viewer.el);
      }

      return this;
    },

    filterItems() {
      const query = this.$('.inspector-filter-input').val().toLowerCase();
      const filters = this.model.get('filters');

      for (const el of this.$('.jst-group')) {
        const $group = $(el), $items = $group.find('.jst-root > li > ul > li');

        const $visible = $items.filter((__, el) => {
          const $item = $(el), { dataset } = $item.children('[data-path]')[0];
          const visible = filters[dataset.type];

          if (query.length) {
            const $label = $item.children('.jst-label');
            const text = $label.text().toLowerCase();
            return visible && text.includes(query);
          }

          return visible;
        });

        $items.not($visible.show()).hide();
        $group.toggle(!!$visible.length);
      }

      return this;
    },

    sortItems() {
      const metadata = this.model.get('metadata');
      const updates = this.model.get('updates');
      const sorting = this.model.get('sorting');
      const cache = this.model.get('cache');

      utils.sortByLocals(this.model.get('source'), (a, b) => {
        if (sorting !== 'alphabetically') {
          const meta1 = metadata[`/${a}`];
          const meta2 = metadata[`/${b}`];

          if (sorting === 'dateModified') {
            return meta2.modifiedAt - meta1.modifiedAt;
          }

          if (sorting === 'dateAdded') {
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

    restoreState(state = this.model.get('state')) {
      if (Array.isArray(state.items)) {
        state.items.forEach(({ path, folded }) => {
          const $el = this.$el.find(`[data-path="${path}"]`);
          if (folded && !$el.hasClass('jst-collapsed')) {
            $el.prev('.jst-collapse').click();
          }
        });
      }
      this.model.set('state', state);
    },

    saveState() {
      this.model.set('state', {
        items: [
          ..._.map(this.$el.find('[data-type="object"]'), el => ({
            folded: el.classList.contains('jst-collapsed'),
            path: el.dataset.path,
          })),
          ..._.map(this.$el.find('[data-type="array"]'), el => ({
            folded: el.classList.contains('jst-collapsed'),
            path: el.dataset.path,
          })),
        ]
      });
      return this.model.get('state');
    },

    events: {
      'change .inspector-filter-menu > li > input': function (e) {
        this.model.set('filters', {
          ...this.model.get('filters'),
          [e.target.value]: e.target.checked
        });
      },

      'click .inspector-filter-menu > li': function (e) {
        e.stopPropagation();
      },

      'click .inspector-sort-menu > li': function (e) {
        e.preventDefault();
        this.model.set('sorting', e.target.dataset.sorting);
      },

      'input .inspector-filter-input': _.debounce(function () {
        this.filterItems()
      }, 200)
    }
  });

  function scaleColors(map, count = 6) {
    return _.reduce(map, (acc, value, key) => {
      const scale = _.compose(color2K.toHex, color2K.getScale('red', value));
      acc[key] = [...Array(count).keys()].map(n => scale(n / (count - 1)));
      return acc;
    }, {});
  }

  Inspector.ScriptDataView = View;
})(window, jQuery, _);