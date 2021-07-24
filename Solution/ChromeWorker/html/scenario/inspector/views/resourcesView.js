(function (global, $, _) {
  const Model = Backbone.Model.extend({
    defaults: {
      resources: {},
      highlight: true,
      supportHighlight: false,
    },

    init: false,

    data: {},

    getResource(pointer) {
      const source = this.get('resources');
      return jsonpatch.getValueByPointer(source, pointer);
    },

    update(resources) {
      if (!resources) return;
      const prev = this.get('resources');
      this.set('resources', resources);

      if (this.get('supportHighlight')) {
        const diff = jsonpatch.compare(prev, resources);

        if (this.init) diff.forEach(({ path, value, op }) => {
          if (!_.has(this.data, path)) {
            this.data[path] = { usage: 6, value, op };
          } else if (op === 'remove') {
            delete this.data[path];
          }
        });

        if (this.get('highlight')) _.each(this.data, (item, path) => {
          item.usage = diff.some(v => v.path === path) ? 1 : (item.usage + 1);
          this.trigger('highlight', { ...item, path });
        });
        this.set('highlight', true);
      }

      this.init = true;
    },
  });

  const View = Backbone.View.extend({
    template: global.Scenario.JST['inspector/resources'],

    initialize() {
      const model = new Model();

      if (model.get('supportHighlight')) {
        model.on('highlight:resources', ({ usage, path }) => {
          const $node = this.$(`[data-path="${path}"]`);

          if ($node.length) {
            const type = $node.data('type');
            if (type === 'object') return;
            if (type === 'array') return;

            const scale = chroma.scale(['red', JSONTree.colors[type]]).mode('rgb');
            $node.css('color', scale.colors(6, 'css')[Math.min(usage, 6) - 1]);
          }
        });
      }

      model.on('change:resources', (__, resources) => {
        const $data = this.$('#inspectorResourcesData');
        const isEmpty = _.isEmpty(resources);

        if (!isEmpty) this.tree.render(resources);
        $data.toggle(!isEmpty).prev().toggle(isEmpty);
      });

      this.model = model;
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template());

        this.tree = new JSONTree(this.$('#inspectorResourcesData')[0], {
          onCollapse: BrowserAutomationStudio_PreserveInterfaceState,
          onExpand: BrowserAutomationStudio_PreserveInterfaceState,
          rootSort: Scenario.utils.sortByLocals,
          onRender: () => this.trigger('renderTree'),
        });
      }

      return this;
    },
  });

  global.Scenario.Inspector.Resources = View;
})(window, jQuery, _);