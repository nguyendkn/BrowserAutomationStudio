(({ App, Backbone, _ }) => {
  const { Inspector, JST } = App;

  const Model = Backbone.Model.extend({
    defaults: () => ({
      stack: [],
      state: {},
    }),

    update: function (stack) {
      this.set('stack', stack);
    }
  });

  Inspector.CallstackView = Backbone.View.extend({
    template: JST['inspector/callstack'],

    initialize() {
      const model = this.model = new Model()
        .on('change:stack', () => {
          this.renderStack()
        });

      this.tools = new Inspector.ToolsView({
        filters: {
          functions: true,
          actions: true,
        }
      });

      this.tools.model.on('change:filters', this.applyFilters, this);
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template());
        this.$el.prepend(this.tools.render().el);
      }

      return this.renderStack();
    },

    renderStack() {
      const panel = this.el.querySelector('.inspector-panel');
      panel.dataset.empty = _.isEmpty(this.model.get('stack'));
      const html = JST['inspector/stack']({
        ...this.model.toJSON(),
        filters: this.tools.model.get('filters'),
        sorting: this.tools.model.get('sorting'),
      });

      morphdom(panel.querySelector('.inspector-panel-data'), `<div class="inspector-panel-data">${html}</div>`, {
        onBeforeElUpdated: (from, to) => !from.isEqualNode(to),
        getNodeKey({ classList, dataset, id }) {
          if (classList) {
            if (classList.contains('callstack-item')) {
              return dataset.id;
            }
          }
          return id;
        },
        childrenOnly: true
      });

      return this;
    },

    applyFilters() {
      _.each(this.tools.model.get('filters'), (visible, type) => {
        this.$(`[data-type="${type.slice(0, -1)}"]`).toggle(visible);
      });
      return this;
    },

    restoreState(state = this.model.get('state')) {
      this.model.set('state', state);
      return this;
    },

    events: {
      'change .inspector-tools > ul > li > input': function (e) {
        const { checked, value } = e.target;
        this.model.set('filters', { ...this.model.get('filters'), [value]: checked });
      },

      'show.bs.collapse .callstack-item': function (e) {
        const { id } = e.currentTarget.dataset;
        this.model.set('state', { ...this.model.get('state'), [id]: false });
      },

      'hide.bs.collapse .callstack-item': function (e) {
        const { id } = e.currentTarget.dataset;
        this.model.set('state', { ...this.model.get('state'), [id]: true });
      },

      'click .callstack-item-name': function (e) {
        const { id } = e.target.closest('li').dataset;
        BrowserAutomationStudio_FocusAction(id);
      },

      'click .callstack-item-data': function (e) {
        e.target.classList.toggle('text-truncate');
      }
    }
  });
})(window);