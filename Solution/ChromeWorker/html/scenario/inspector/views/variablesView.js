(function (global, $, _) {
  const { Inspector, JST } = global.Scenario;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  const Model = ScriptDataModel.extend({
    defaults: () => _.extend({}, ScriptDataModel.prototype.defaults, {
      supportHighlight: true,
      supportGroups: true,
    })
  });

  const View = ScriptDataView.extend({
    template: JST['inspector/variables'],

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

      model.on('change:visibleTypes', (__, types) => {
        this.filterTree();
      });

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
        this.$el.html(this.template({ ...this.model.toJSON() }));
        const preserveState = BrowserAutomationStudio_PreserveInterfaceState;

        this.tree = new JSONTree(this.$('#inspectorVariablesData')[0], {
          onRender: () => {
            this.sortTree(this.model.get('sortingType'));
            this.filterTree().loadState();
          },
          onCollapse: preserveState,
          onExpand: preserveState,
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

        const modal = new Inspector.Modal({
          callback: ({ isChanged, value, cancel, type }) => {
            if (!cancel && isChanged) {
              Scenario.utils.updateVariable(value, path, type);
            }
          },
          value: this.model.getValue(path),
          type,
          path,
        });
        modal.render();
      },

      'change .inspector-filter-menu-item > input': function (e) {
        const $el = $(e.target), type = $el.val();

        this.model.set('visibleTypes', {
          ...this.model.get('visibleTypes'),
          [type]: $el.prop('checked')
        });
      },

      'click .inspector-filter-button': function (e) {
        e.preventDefault();
        const $menu = $(e.currentTarget).next('.inspector-filter-menu');
        $menu.toggle($menu.is(':hidden'));
      },

      'input .inspector-filter-input': _.debounce(function (e) {
        this.filterTree()
      }, 200),

      'keydown .inspector-filter-input': function (e) {
        if (e.key === ' ') e.preventDefault();
      },
    }
  });

  Inspector.Variables = View;
})(window, jQuery, _);