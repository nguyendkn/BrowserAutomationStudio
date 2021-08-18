(({ App, Backbone }, $, _) => {
  const { Inspector, utils } = App;

  const View = Backbone.View.extend({
    initialize() {
      const model = this.model;

      if (model.get('allowHighlight')) {
        model.on('highlight', ({ count, path }) => {
          const $node = this.$(`[data-path="${path}"]`);

          if ($node.length) {
            const { type } = $node[0].dataset;
            if (type === 'object') return;
            if (type === 'array') return;

            $node.css('color', utils.scaleColors(['red', Inspector.Viewer.colors[type]], 6)[count - 1]);
          }
        });
      }

      model.on('change:visibility', () => {
        this.filterItems();
      });

      model.on('change:source', (__, source) => {
        const $data = this.$('.inspector-panel-data');
        const isEmpty = _.isEmpty(source);

        if (!isEmpty) this.viewer.model.update(source);
        $data.toggle(!isEmpty).prev().toggle(isEmpty);
      });

      model.on('change:sortType', (__, type) => {
        this.sortItems(type);
      });
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
            this.sortItems(this.model.get('sortType'));
            this.filterItems().loadState();
          });

        this.$('.inspector-panel-data').append(this.viewer.el);
      }

      return this;
    },

    sortItems(type) {
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

    filterItems() {
      const query = this.$('.inspector-filter-input').val().toLowerCase();
      const visibility = this.model.get('visibility');

      for (const el of this.$('.jst-group')) {
        const $group = $(el), $items = $group.find('.jst-root > li > ul > li');

        const $visible = $items.filter((__, el) => {
          const $item = $(el), { dataset } = $item.children('[data-path]')[0];
          const visible = visibility[dataset.type];

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

    loadState(state = this.model.get('state')) {
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
      'change .inspector-filter-menu-item > input': function (e) {
        this.model.set('visibility', {
          ...this.model.get('visibility'),
          [e.target.value]: e.target.checked
        });
      },

      'click .inspector-filter-menu-item': function (e) {
        e.stopPropagation();
      },

      'click .inspector-sort-menu-item': function (e) {
        e.preventDefault();
        this.model.set('sortType', e.target.dataset.sortType);
      },

      'input .inspector-filter-input': _.debounce(function (e) {
        this.filterItems()
      }, 200),
    }
  });

  Inspector.ScriptDataView = View;
})(window, jQuery, _);