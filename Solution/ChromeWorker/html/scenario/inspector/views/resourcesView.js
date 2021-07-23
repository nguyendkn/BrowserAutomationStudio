(function (global, $, _) {
  const Model = Backbone.Model.extend({
    defaults: {
      resources: {},
      highlight: true,
    },

    init: false,

    data: {},

    getResource(pointer) {
      const source = this.get('resources');
      return jsonpatch.getValueByPointer(source, pointer);
    },

    update(resources) {
      const highlight = this.get('highlight');
      if (resources) {
        const diff = jsonpatch.compare(this.get('resources'), resources);
        this.set('resources', resources);

        if (this.init) diff.forEach(({ path, value, op }) => {
          if (!_.has(this.data, path)) {
            this.data[path] = { usage: 6, value, op };
          } else if (op === 'remove') {
            delete this.data[path];
          }
        });

        if (highlight) _.each(this.data, (item, path) => {
          item.usage = diff.some(v => v.path === path) ? 1 : (item.usage + 1);
          this.trigger('highlight:resources', { ...item, path });
        });
        this.init = true;
      }
      this.set('highlight', true);
    },
  });

  const View = Backbone.View.extend({
    template: global.Scenario.JST['inspector/resources'],

    initialize() {
      const model = new Model();

      model.on('change:resources', (__, resources) => {
        const $data = this.$('#inspectorResourcesData');
        const isEmpty = _.isEmpty(resources);

        if (!isEmpty) this.resourcesTree.render(resources);
        $data.toggle(!isEmpty).prev().toggle(isEmpty);
      });

      this.model = model;
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template());

        this.resourcesTree = new JSONTree(this.$('#inspectorResourcesData')[0], {
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