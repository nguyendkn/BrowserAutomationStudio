(function (global, $, _) {
  const Model = Backbone.Model.extend({
    defaults: {
      sortingType: 'alphabetically',
      supportHighlight: true,
      highlight: false,
      metadata: {},
      source: {},
    },

    getValue(path) {
      const source = this.get('source');
      return jsonpatch.getValueByPointer(source, path);
    },

    update(data) {
      if (!data) return;
      const metadata = this.get('metadata');
      const source = this.get('source');
      this.set('source', data);

      const diff = jsonpatch.compare(source, data), time = Date.now();

      diff.forEach(({ path, value, op }) => {
        if (!_.has(metadata, path)) {
          metadata[path] = { usage: 6, value, op, addedAt: time, changedAt: time };
        } else {
          if (op === 'remove') {
            return (delete metadata[path]);
          }
          metadata[path].changedAt = time;
        }
      });

      if (this.get('supportHighlight')) {
        if (this.get('highlight')) _.each(metadata, (item, path) => {
          item.usage = diff.some(v => v.path === path) ? 1 : (item.usage + 1);
          this.trigger('highlight', { ...item, path });
        });
        this.set('highlight', false);
      }
    },
  });

  const View = Backbone.View.extend({
    template: global.Scenario.JST['inspector/variables'],

    initialize() {
      const model = new Model();

      if (model.get('supportHighlight')) {
        model.on('highlight', ({ usage, path }) => {
          const $node = this.$(`[data-path="${path}"]`);

          if ($node.length) {
            const { type } = $node[0].dataset;
            if (['object', 'array'].includes(type)) return;

            const scale = chroma.scale(['red', JSONTree.colors[type]]).mode('rgb');
            $node.css('color', scale.colors(6, 'css')[Math.min(usage, 6) - 1]);
          }
        });
      }

      model.on('change:source', (__, source) => {
        const $data = this.$('#inspectorVariablesData');
        const isEmpty = _.isEmpty(source);

        if (!isEmpty) this.tree.render(source);
        $data.toggle(!isEmpty).prev().toggle(isEmpty);
      });

      model.on('change:sortingType', (__, method) => {
        this.sortTree(method);
      });

      this.model = model;
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template({}));
        const preserveState = BrowserAutomationStudio_PreserveInterfaceState;

        this.tree = new JSONTree(this.$('#inspectorVariablesData')[0], {
          onRender: () => {
            this.sortTree(this.model.get('sortingType'));
            this.trigger('renderTree');
          },
          onCollapse: preserveState,
          onExpand: preserveState,
        });
      }
      return this;
    },

    sortTree(type) {
      const metadata = this.model.get('metadata');

      tinysort(this.el.querySelectorAll('.jst-root > ul > li'), {
        sortFunction: (a, b) => {
          const [path1, path2] = [a, b].map(({ elm }) => {
            const node = elm.querySelector(':scope > [data-path]');
            return node.dataset.path;
          });

          if (type !== 'alphabetically') {
            const meta1 = metadata[path1], meta2 = metadata[path2];

            if (type === 'byAddedTime') {
              return meta2.addedAt - meta1.addedAt;
            } else if (type === 'byChangedTime') {
              return meta2.changedAt - meta1.changedAt;
            } else {

            }
          }
          return Scenario.utils.sortByLocals(path1.split('/')[1], path2.split('/')[1]);
        },
      });
      return this;
    },

    events: {
      'dblclick #inspectorVariablesData [data-path]': function (e) {
        const { path } = e.target.dataset;
        const { type } = e.target.dataset;
        e.stopPropagation();
        if (!path) return;

        const modal = new global.Scenario.Inspector.Modal({
          callback: ({ isChanged, value, cancel, type }) => {
            if (!cancel && isChanged) {
              this.model.set('highlight', false);
              Scenario.utils.updateVariable(value, path, type);
            }
          },
          value: this.model.getValue(path),
          type,
          path,
        });
        modal.render();
      },

      'input #inspectorVariablesFilter': _.debounce(function (e) {
        const query = e.target.value.trim().toLowerCase();

        this.$('.jst-root > ul > li').each((__, el) => {
          const $el = $(el);

          if (query.length) {
            const $label = $el.children('.jst-property');
            const text = $label.text().toLowerCase();
            return $el.toggle(text.includes(query));
          }

          $el.show();
        });
      }, 200),
    }
  });

  global.Scenario.Inspector.Variables = View;
})(window, jQuery, _);