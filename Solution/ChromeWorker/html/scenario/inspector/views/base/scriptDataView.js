(({ App, Backbone, $, _ }) => {
  const { Inspector } = App;

  const View = Backbone.View.extend({
    initialize({ allowHighlight }) {
      if (allowHighlight) {
        this.model.on('highlight', ({ count, path }) => {
          const $node = this.$(`[data-path="${path}"]`);

          if ($node.length) {
            const colors = View.colors[$node[0].dataset.type];
            if (colors) $node.css('color', colors[count]);
          }
        });
      }

      this.model.on('change:filters', this.filterItems, this);

      this.model.on('change:sorting', this.sortItems, this);

      this.model.on('change:source', (__, source) => {
        const panel = this.el.querySelector('.inspector-panel');
        panel.dataset.empty = _.isEmpty(source);
        this.viewer.model.update(prepareData(source));
      });
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template(this.model.toJSON()));

        this.viewer = (new Inspector.Viewer())
          .on('node:collapse', BrowserAutomationStudio_PreserveInterfaceState)
          .on('node:expand', BrowserAutomationStudio_PreserveInterfaceState)
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

      _.each(this.$('.jst-group'), el => {
        const $group = $(el), $items = $group.find('.jst-root > li > ul > li');

        const $visible = $items.filter((__, el) => {
          const $item = $(el), { dataset } = $item.children('[data-path]')[0];
          const visible = filters[dataset.type];

          if (query && query.length) {
            const text = $item.children('.jst-label').text();
            const lower = text.slice(0, -1).toLowerCase();
            return lower.includes(query) && visible;
          }

          return visible;
        });

        $items.not($visible.show()).hide();
        $group.toggle(!!$visible.length);
      });

      return this;
    },

    sortItems() {
      const metadata = this.model.get('metadata');
      const updates = this.model.get('updates');
      const sorting = this.model.get('sorting');
      const history = this.model.get('history');

      _.keys(this.model.get('source')).sort((a, b) => {
        return (a.startsWith('GLOBAL:') - b.startsWith('GLOBAL:')) || (() => {
          if (sorting !== 'alphabetically') {
            const meta1 = metadata[`/${a}`];
            const meta2 = metadata[`/${b}`];

            if (sorting === 'dateModified') {
              return meta2.modifiedAt - meta1.modifiedAt;
            }

            if (sorting === 'dateAdded') {
              return meta2.addedAt - meta1.addedAt;
            }

            const f1 = history.filter(v => v === a).length + updates;
            const f2 = history.filter(v => v === b).length + updates;
            return (meta2.usages / f2) - (meta1.usages / f1);
          }

          return a.localeCompare(b);
        })();
      }).forEach(key => {
        const el = this.el.querySelector(`[data-path="/${key}"]`);
        el.parentNode.parentNode.appendChild(el.parentNode);
      });

      return this;
    },

    restoreState(state = this.model.get('state')) {
      _.each(state.items, ({ path, folded }) => {
        const $el = this.$el.find(`[data-path="${path}"]`);
        if (folded && !$el.hasClass('jst-collapsed')) {
          $el.prev('.jst-collapse').click();
        }
      });
      this.model.set('state', state);
    },

    saveState() {
      this.model.set('state', {
        items: [
          ...this.el.querySelectorAll('[data-type="object"]'),
          ...this.el.querySelectorAll('[data-type="array"]'),
        ].map(el => ({
          folded: el.classList.contains('jst-collapsed'),
          path: el.dataset.path
        }))
      });
      return this.model.get('state');
    },

    events: {
      'change .inspector-filter-menu > li > input': function (e) {
        const { checked, value } = e.target;
        this.model.set('filters', { ...this.model.get('filters'), [value]: checked });
      },

      'input .inspector-filter-input': _.debounce(function (e) {
        this.filterItems()
      }, 200),

      'click .inspector-sort-menu > li > a': function (e) {
        e.preventDefault();
        const { dataset } = e.target.closest('li');
        this.model.set('sorting', dataset.sorting);
      },

      'click .inspector-filter-menu > li': function (e) {
        e.stopPropagation();
      }
    }
  }, {
    colors: {
      undefined: scaleColor('#8546bc'),
      boolean: scaleColor('#2525cc'),
      number: scaleColor('#d036d0'),
      string: scaleColor('#2db669'),
      date: scaleColor('#ce904a'),
      null: scaleColor('#808080'),
    }
  });

  function scaleColor(color, size = 6) {
    const scale = _.compose(color2K.toHex, color2K.getScale('red', color));
    return _.range(size).map(n => scale(n / (size - 1)));
  }

  function prepareData(data) {
    return _.reduce(data, (acc, val, key) => {
      if (typeof (val) === 'string') {
        if (val.startsWith('__UNDEFINED__')) {
          val = undefined;
        } else if (val.startsWith('__DATE__')) {
          val = dayjs(val.slice(8), 'yyyy-MM-dd hh:mm:ss [UTC]Z').toDate();
        }
      } else if (_.isObject(val)) {
        val = prepareData(val);
      }
      return (acc[key] = val, acc);
    }, Array.isArray(data) ? [] : {});
  }

  Inspector.ScriptDataView = View;
})(window);