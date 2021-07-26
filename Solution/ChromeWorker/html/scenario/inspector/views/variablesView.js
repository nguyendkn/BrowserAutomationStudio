(function (global, $, _) {
  const Model = Backbone.Model.extend({
    defaults: {
      sort: '',
      variables: {},
      highlight: false,
      supportHighlight: true,
    },

    data: {},

    getVariable(path) {
      const source = this.get('variables');
      return jsonpatch.getValueByPointer(source, path);
    },

    update(variables) {
      if (!variables) return;
      const previous = this.get('variables');
      this.set('variables', variables);

      if (this.get('supportHighlight')) {
        const diff = jsonpatch.compare(previous, variables), time = Date.now();

        diff.forEach(({ path, value, op }) => {
          if (!_.has(this.data, path)) {
            this.data[path] = { usage: 6, value, op, addedAt: time, changedAt: time };
          } else {
            if (op === 'remove') {
              return (delete this.data[path]);
            }
            this.data[path].changedAt = time;
          }
        });

        if (this.get('highlight')) _.each(this.data, (item, path) => {
          item.usage = diff.some(v => v.path === path) ? 1 : (item.usage + 1);
          this.trigger('highlight', { ...item, path });
        });

        this.set('highlight', true);
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

      model.on('change:variables', (__, variables) => {
        const $data = this.$('#inspectorVariablesData');
        const isEmpty = _.isEmpty(variables);

        if (!isEmpty) this.tree.render(variables);
        $data.toggle(!isEmpty).prev().toggle(isEmpty);
      });

      this.model = model;
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template({}));

        this.tree = new JSONTree(this.$('#inspectorVariablesData')[0], {
          onCollapse: BrowserAutomationStudio_PreserveInterfaceState,
          onExpand: BrowserAutomationStudio_PreserveInterfaceState,
          onRender: () => {
            tinysort(this.el.querySelectorAll('.jst-root > ul > li'), {
              sortFunction: (a, b) => {
                const $el1 = $(a.elm).children('[data-path]');
                const $el2 = $(b.elm).children('[data-path]');
                return Scenario.utils.sortByLocals(
                  $el1[0].dataset.path.split('/')[1],
                  $el2[0].dataset.path.split('/')[1],
                );
              }
            });
            this.trigger('renderTree');
          },
        });
      }

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
          value: this.model.getVariable(path),
          type: type,
          path: path,
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