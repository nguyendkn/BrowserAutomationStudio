(({ App, Backbone, $, _ }) => {
  const { Inspector } = App;
  const { ScriptDataModel } = Inspector;

  const View = Backbone.View.extend({
    initialize() {
      const model = this.model = new ScriptDataModel();

      if (this.allowHighlight) {
        model.on('highlight', ({ count, path }) => {
          const [node] = this.$(`[data-path="${path}"] > .jst-node`);

          if (node) {
            const { dataset } = node.parentNode;
            const colors = View.colors[dataset.type];
            if (colors) node.style.color = colors[count];
          }
        });
      }

      model.on('change:source', (__, source) => {
        const panel = this.el.querySelector('.inspector-panel');
        panel.dataset.empty = _.isEmpty(source);
        this.tree.model.update(prepareData(source));
      });

      this.tree = new Inspector.TreeView()
        .on('node:collapse', ({ path }) => {
          model.set('state', { ...model.get('state'), [path]: false });
          BrowserAutomationStudio_PreserveInterfaceState();
        })
        .on('node:expand', ({ path }) => {
          model.set('state', { ...model.get('state'), [path]: true });
          BrowserAutomationStudio_PreserveInterfaceState();
        })
        .on('render', () => {
          this.restoreState();
          this.applyFilters();
          this.applySorting();
        });

      this.tools = new Inspector.ToolsView();
      this.tools.model.on('change:sorting', this.applySorting, this);
      this.tools.model.on('change:filters', this.applyFilters, this);
      this.tools.model.on('change:query', this.applyFilters, this);
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template());
        this.$el.prepend(this.tools.render().el);
        this.$('.inspector-panel-data').append(this.tree.el);
      }

      return this;
    },

    applyFilters() {
      const filters = this.tools.model.get('filters');
      const query = this.tools.model.get('query');

      _.each(this.$('.jst-group'), el => {
        const $group = $(el), $items = $group.find('.jst-root > li > ul > li');

        if ($items.length) {
          const $visible = $items.filter((__, el) => {
            const visible = filters[el.dataset.type];

            if (query) {
              const text = $(el).find('.jst-label').text();
              const lower = _.toLower(text.slice(0, -1));
              return lower.includes(query) && visible;
            }

            return visible;
          });

          $items.not($visible.show()).hide();
          $group.toggle(!!$visible.length);
        }
      });

      return this;
    },

    applySorting() {
      const sorting = this.tools.model.get('sorting');
      const metadata = this.model.get('metadata');
      const history = this.model.get('history');
      const updates = history.length, cache = history.flat();

      _.each(this.tree.sortable.nodes, nodes => {
        const order = nodes.toArray().sort((a, b) => {
          return (a.startsWith('/GLOBAL:') - b.startsWith('/GLOBAL:')) || (() => {
            if (sorting === 'alphabetically') return a.localeCompare(b);

            if (sorting === 'dateModified') {
              return metadata[b].modifiedAt - metadata[a].modifiedAt;
            }

            if (sorting === 'dateCreated') {
              return metadata[b].createdAt - metadata[a].createdAt;
            }

            const f2 = cache.filter(v => v === b).length + updates;
            const f1 = cache.filter(v => v === a).length + updates;
            return metadata[b].usages / f2 - metadata[a].usages / f1;
          })();
        });

        nodes.sort(order);
      });

      return this;
    },

    restoreState(state = this.model.get('state')) {
      _.each(state, (expanded, path) => {
        const $el = this.$(`[data-path="${path}"] > .jst-list`);
        if (expanded || $el.hasClass('collapsed')) return;
        $el.prev('.jst-collapse').click();
      });
      this.model.set('state', state);
      return this;
    },

    getState() {
      return this.model.get('state');
    },

    openModal(e) {
      e.stopPropagation();
      const { path, type } = e.target.closest('li').dataset;

      const modal = new Inspector.Modal({
        callback: result => this.trigger(`modal:${result.cancel ? 'cancel' : 'accept'}`, result),
        value: this.tree.model.getValue(path),
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
    const scale = _.compose(color2K.parseToRgba, color2K.getScale('#ff0000', color));
    return _.range(size).map(n => `rgb(${scale(n / (size - 1)).slice(0, -1).join(', ')})`);
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