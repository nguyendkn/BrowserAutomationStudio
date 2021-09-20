(({ App, Backbone, _ }) => {
  const { Inspector, JST } = App;

  const Model = Backbone.Model.extend({
    defaults: () => ({
      filters: {
        function: true,
        action: true,
      },
      stack: [],
      state: {},
    }),

    update: function (stack) {
      this.set('stack', stack.concat({
        type: 'function',
        name: 'Main',
        id: 0
      }));
    }
  });

  Inspector.CallstackView = Backbone.View.extend({
    template: JST['inspector/callstack'],

    initialize() {
      const model = new Model()
        .on('change:filters', () => {
          this.filterStack()
        })
        .on('change:stack', () => {
          this.renderStack()
        });

      this.model = model;
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template(this.model.toJSON()));
      }

      return this.renderStack();
    },

    renderStack() {
      const panel = this.el.querySelector('.inspector-panel');
      panel.dataset.empty = _.isEmpty(this.model.get('stack'));

      morphdom(panel.querySelector('.inspector-panel-data'), `<div class="inspector-panel-data">${JST['inspector/stack'](this.model.toJSON())}</div>`, {
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

    filterStack() {
      _.each(this.model.get('filters'), (visible, type) => {
        this.$(`[data-type="${type}"]`).toggle(visible);
      });
      return this;
    },

    restoreState(state = this.model.get('state')) {
      this.model.set('state', state);
      return this;
    },

    getState() {
      return this.model.get('state');
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
        BrowserAutomationStudio_FocusAction(id, false);
      },

      'click .callstack-item-data': function (e) {
        e.target.classList.toggle('text-truncate');
      }
    }
  });
})(window);