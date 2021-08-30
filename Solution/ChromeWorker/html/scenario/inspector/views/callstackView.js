(({ App, Backbone, _ }) => {
  const { Inspector, JST, utils } = App;

  const Model = Backbone.Model.extend({
    actions: ['if', 'for', 'while', 'foreach'],

    update: function (source) {
      this.set('stack', source.map(({ info, iterator, arguments }) => {
        if (!this.actions.includes(info.name.toLowerCase())) {
          info.type = 'function';
        } else {
          info.type = 'action';
        }
        return { ...info, iterator, arguments }
      }).concat({ type: 'function', name: 'Main' }))
    },

    defaults: {
      filters: {
        functions: true,
        actions: true,
      },
      stack: [],
      state: {},
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
      const $panel = this.$('.inspector-panel');
      $panel[0].dataset.empty = _.isEmpty(this.model.get('stack'));
      const html = JST['inspector/stack'](this.model.toJSON());

      utils.morph($panel.children('.inspector-panel-data')[0], `<div class="inspector-panel-data">${html}</div>`, {

      });

      return this;
    },

    filterStack() {
      _.each(this.model.get('filters'), (visible, type) => {
        this.$(`[data-type="${type.slice(0, -1)}"]`).toggle(visible);
      });
      return this;
    },

    events: {
      'change .inspector-tools > ul > li > input': function (e) {
        const { checked, value } = e.target;
        this.model.set('filters', { ...this.model.get('filters'), [value]: checked })
      },

      'show.bs.collapse .callstack-item > ul': function (e) {
        const { id } = e.target.closest('li').dataset;
        this.model.set('state', { ...this.model.get('state'), [id]: false })
      },

      'hide.bs.collapse .callstack-item > ul': function (e) {
        const { id } = e.target.closest('li').dataset;
        this.model.set('state', { ...this.model.get('state'), [id]: true })
      },

      'click .callstack-item-name': function (e) {
        e.preventDefault();
        const { id } = e.target.closest('li').dataset;
        BrowserAutomationStudio_FocusAction(id, false);
      }
    }
  });
})(window);