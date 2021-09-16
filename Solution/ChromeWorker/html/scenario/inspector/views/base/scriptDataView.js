(({ App, Backbone, $, _ }) => {
  const { Inspector } = App;

  const View = Backbone.View.extend({
    initialize() {
      if (this.allowHighlight) {
        this.model.on('highlight', ({ count, path }) => {
          const [node] = this.$(`[data-path="${path}"] > .jst-node`);

          if (node) {
            const { dataset } = node.parentNode;
            const colors = View.colors[dataset.type];
            if (colors) node.style.color = colors[count];
          }
        });
      }

      this.model.on('change:source', (__, source) => {
        const panel = this.el.querySelector('.inspector-panel');
        panel.dataset.empty = _.size(source) === 0;
        this.viewer.model.update(prepareData(source));
      });

      this.tools = new Inspector.ToolsView();
      this.tools.model.on('change:filters', this.filterItems, this);
      this.tools.model.on('change:sorting', this.sortItems, this);
      this.tools.model.on('change:query', this.filterItems, this);
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

        this.$el.prepend(this.tools.render().el);
        this.$('.inspector-panel-data').append(this.viewer.el);
      }

      return this;
    },

    filterItems() {
      const filters = this.tools.model.get('filters');
      const query = this.tools.model.get('query');

      _.each(this.$('.jst-group'), el => {
        const $group = $(el), $items = $group.find('.jst-root > li > ul > li');

        const $visible = $items.filter((__, el) => {
          const visible = filters[el.dataset.type];

          if (query) {
            const text = $(el).children('.jst-label').text();
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
      const sorting = this.tools.model.get('sorting');
      const metadata = this.model.get('metadata');
      const updates = this.model.get('updates');
      const history = this.model.get('history');

      _.keys(this.model.get('source')).sort((a, b) => {
        return (a.startsWith('GLOBAL:') - b.startsWith('GLOBAL:')) || (() => {
          if (sorting === 'alphabetically') return a.localeCompare(b);
          const pathA = `/${a}`, metaA = metadata[pathA];
          const pathB = `/${b}`, metaB = metadata[pathB];

          if (sorting === 'dateModified') {
            return metaB.modifiedAt - metaA.modifiedAt;
          }

          if (sorting === 'dateCreated') {
            return metaB.createdAt - metaA.createdAt;
          }

          const f1 = history.filter(v => v === pathA).length + updates;
          const f2 = history.filter(v => v === pathB).length + updates;
          return metaB.usages / f2 - metaA.usages / f1;
        })();
      }).forEach(key => {
        const el = this.el.querySelector(`[data-path="/${key}"]`);
        el.parentNode.appendChild(el);
      });

      return this;
    },

    restoreState(state = this.model.get('state')) {
      _.each(state.items, ({ path, folded }) => {
        const $el = this.$el.find(`[data-path="${path}"] > .jst-list`);
        if (folded && !$el.hasClass('collapsed')) {
          $el.prev('.jst-collapse').click();
        }
      });
      this.model.set('state', state);
      return this;
    },

    saveState() {
      this.model.set('state', {
        items: [...this.el.querySelectorAll('[data-type] > .jst-list')].map(el => ({
          folded: el.classList.contains('collapsed'),
          path: el.parentNode.dataset.path
        }))
      });
      return this.model.get('state');
    },

    openModal(e) {
      e.stopPropagation();
      const { path, type } = e.target.closest('li').dataset;

      const modal = new Inspector.Modal({
        callback: result => this.trigger(`modal:${result.cancel ? 'cancel' : 'accept'}`, result),
        value: this.viewer.model.getValue(path),
        allowEdit: this.allowEdit,
        type,
        path,
      });

      modal.render();
    },

    events: {
      'dblclick .jst-root > li > ul > li > .jst-node': 'openModal',

      'dblclick .jst-root > li > ul > li > .jst-list': 'openModal',
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
    return _.reduce(data, (res, val, key) => {
      if (typeof (val) === 'string') {
        if (val.startsWith('__UNDEFINED__')) {
          val = undefined;
        } else if (val.startsWith('__DATE__')) {
          val = dayjs(val.slice(8), 'yyyy-MM-dd hh:mm:ss [UTC]Z').toDate();
        }
      } else if (_.isObject(val)) {
        val = prepareData(val);
      }
      return (res[key] = val, res);
    }, _.isArray(data) ? [] : {});
  }

  Inspector.ScriptDataView = View;
})(window);