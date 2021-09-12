(({ App, Backbone, _ }) => {
  const { Inspector, JST } = App;

  const Model = Backbone.Model.extend({
    defaults: () => ({
      filters: {
        function: true,
        action: true,
      },
      stack: [],
      state: {}
    }),

    update: function (source) {
      this.set('stack', source.concat({
        type: 'function',
        name: 'Main',
        id: 0,
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
      const html = JST['inspector/stack'](this.model.toJSON());

      morphdom(panel.querySelector('.inspector-panel-data'), `<div class="inspector-panel-data">${html}</div>`, {
        onBeforeElUpdated: (from, to) => !from.isEqualNode(to),
        childrenOnly: true,
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
      return this;
    },

    saveState() {

    },

    events: {
      'change .inspector-tools > ul > li > input': function (e) {
        const { checked, value } = e.target;
        this.model.set('filters', { ...this.model.get('filters'), [value]: checked });
      },

      'show.bs.collapse .callstack-item > ul': function (e) {
        const { id } = e.target.closest('li').dataset;
        this.model.set('state', { ...this.model.get('state'), [id]: false });
      },

      'hide.bs.collapse .callstack-item > ul': function (e) {
        const { id } = e.target.closest('li').dataset;
        this.model.set('state', { ...this.model.get('state'), [id]: true });
      },

      'click .callstack-item-name': function (e) {
        e.preventDefault();
        const { id } = e.target.closest('li').dataset;
        BrowserAutomationStudio_FocusAction(id, false);
      },

      'click .callstack-item-data': function (e) {
        e.preventDefault();
        e.target.classList.toggle('text-truncate');
      }
    }
  });
})(window);