(({ App, Backbone, $, _ }) => {
  const { Inspector } = App;

  const Model = Backbone.Model.extend({
    defaults: () => ({
      highlight: false,
      metadata: {},
      history: [],
      source: {},
      state: {},
    }),

    update: function (source) {
      const diff = jsonpatch.compare(this.get('source'), source);
      const highlight = this.get('highlight');
      const metadata = this.get('metadata');

      if (diff.length) {
        let history = [...this.get('history'), _.pluck(diff, 'path')].slice(-100);

        _.each(diff, ({ path, op }) => {
          const now = performance.now();

          if (_.has(metadata, path)) {
            if (op === 'remove') return (delete metadata[path]);
            metadata[path].modifiedAt = now;
            metadata[path].usages += 1;
            metadata[path].count += 0;
          } else {
            metadata[path] = { modifiedAt: now, createdAt: now, usages: 1, count: 5 };
          }
        });

        this.set('history', history);
        this.set('source', source);
      }

      _.each(metadata, (item, path) => {
        if (highlight) {
          item.count = diff.some(v => v.path === path) ? 0 : Math.min(item.count + 1, 5);
        }
        this.trigger('highlight', { count: item.count, path });
      });

      this.set('highlight', false);
    }
  })

  const View = Backbone.View.extend({
    initialize() {
      const model = this.model = new Model();

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
    },

    render() {
      const $el = this.$el;

      if ($el.is(':empty')) {
        $el.html(this.template());
        this.$('.inspector-panel-data').append(this.tree.el);
      }

      return this;
    },

    applyFilters() {
      // const filters = this.tools.model.get('filters');
      // const query = this.tools.model.get('query');

      // this.$('.jst-group').each((at, el) => {
      //   const $group = $(el), $items = $group.find('.jst-root > li > ul > li');

      //   if ($items.length) {
      //     const $visible = $items.filter((at, el) => {
      //       const visible = filters[el.dataset.type];

      //       if (query) {
      //         const text = $(el).find('.jst-label').text().slice(0, -1);
      //         return text.trim().toLowerCase().includes(query) && visible;
      //       }

      //       return visible;
      //     });

      //     $items.not($visible.show()).hide();
      //     $group.toggle(!!$visible.length);
      //   }
      // });

      // return this;
    },

    applySorting() {
      // const sorting = this.tools.model.get('sorting');
      // const metadata = this.model.get('metadata');
      // const history = this.model.get('history');
      // const cache = history.flat(), updates = history.length;

      // _.each(this.tree.sortable.nodes, nodes => {
      //   nodes.sort(nodes.toArray().sort((a, b) => {
      //     return (a.startsWith('/GLOBAL:') - b.startsWith('/GLOBAL:')) || (() => {
      //       switch (sorting) {
      //         case 'dateModified':
      //           return metadata[b].modifiedAt - metadata[a].modifiedAt;
      //         case 'dateCreated':
      //           return metadata[b].createdAt - metadata[a].createdAt;
      //         case 'frequency':
      //           const f2 = cache.filter(v => v === b).length + updates;
      //           const f1 = cache.filter(v => v === a).length + updates;
      //           return metadata[b].usages / f2 - metadata[a].usages / f1;
      //       }

      //       return a.localeCompare(b);
      //     })();
      //   }));
      // });

      return this;
    },

    restoreState(state = this.model.get('state')) {
      _.each(state, (expanded, path) => {
        const $el = this.$(`[data-path="${path}"] > .jst-list`);
        if ($el.hasClass('collapsed') && expanded) $el.prev().click();
      });
      this.model.set('state', state);
      return this;
    },

    openModal(e) {
      e.stopPropagation();
      const { path, type } = e.target.closest('li').dataset;

      const modal = new Inspector.Modal({
        callback: result => this.trigger(`modal:${result.cancel ? 'cancel' : 'accept'}`, result),
        value: this.tree.model.getValue(path),
        type,
        path,
      }).render();
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

  Inspector.JsonView = View;
})(window);