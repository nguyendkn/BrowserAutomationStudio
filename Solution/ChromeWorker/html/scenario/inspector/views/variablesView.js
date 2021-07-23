(function (global, $, _) {
  const Model = Backbone.Model.extend({
    defaults: {
      variables: {},
      highlight: true,
    },

    init: false,

    data: {},

    getVariable(pointer) {
      const source = this.get('variables');
      return jsonpatch.getValueByPointer(source, pointer);
    },

    update(variables) {
      const highlight = this.get('highlight');
      if (variables) {
        const diff = jsonpatch.compare(this.get('variables'), variables);
        this.set('variables', variables);

        if (this.init) diff.forEach(({ path, value, op }) => {
          if (!_.has(this.data, path)) {
            this.data[path] = { usage: 6, value, op };
          } else if (op === 'remove') {
            delete this.data[path];
          }
        });

        if (highlight) _.each(this.data, (item, path) => {
          item.usage = diff.some(v => v.path === path) ? 1 : (item.usage + 1);
          this.trigger('highlight:variables', { ...item, path });
        });
        this.init = true;
      }
      this.set('highlight', true);
    },
  });

  const View = Backbone.View.extend({
    template: global.Scenario.JST['inspector/variables'],

    initialize() {
      const model = new Model();

      model.on('highlight:variables', ({ usage, path }) => {
        const $node = this.$(`[data-path="${path}"]`);

        if ($node.length) {
          const type = $node.data('type');
          if (type === 'object') return;
          if (type === 'array') return;

          const scale = chroma.scale(['red', JSONTree.colors[type]]).mode('rgb');
          $node.css('color', scale.colors(6, 'css')[Math.min(usage, 6) - 1]);
        }
      });

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
        this.$el.html(this.template());

        this.tree = new JSONTree(this.$('#inspectorVariablesData')[0], {
          onCollapse: BrowserAutomationStudio_PreserveInterfaceState,
          onExpand: BrowserAutomationStudio_PreserveInterfaceState,
          rootSort: Scenario.utils.sortByLocals,
          onRender: () => this.trigger('renderTree'),
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

        const modal = new global.Scenario.InspectorModal({
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
    }
  });

  global.Scenario.Inspector.Variables = View;
})(window, jQuery, _);