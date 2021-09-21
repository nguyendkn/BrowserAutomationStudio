(({ App, Backbone, $, _ }) => {
  const { Inspector, JST } = App;

  Inspector.Main = Backbone.View.extend({
    template: JST['inspector/main'],

    initialize() {
      ['isscriptexecuting', 'istaskexecuting'].forEach(attr => {
        _GobalModel.on(`change:${attr}`, (__, value) => {
          if (value || this.$el.is(':hidden')) return;
          this.variables.model.set('highlight', true);
          this.resources.model.set('highlight', true);
        });
      });

      this.on('show', () => BrowserAutomationStudio_AskForVariablesUpdateOrWait());
    },

    render() {
      if (this.$el.is(':empty')) {
        this.setElement('#inspector');
        this.$el.html(this.template());

        this.variables = new Inspector.VariablesView({
          el: '#variables'
        }).render();

        this.resources = new Inspector.ResourcesView({
          el: '#resources'
        }).render();

        this.callstack = new Inspector.CallstackView({
          el: '#callstack'
        }).render();

        this.resizable = interact(this.el).resizable({
          listeners: {
            move: ({ client: { y: pos } }) => {
              this.$el.outerHeight(Math.max(120, Math.min(
                window.outerHeight - 300 - 30,
                window.outerHeight - pos - 30,
              )));
            }
          },
          edges: { top: true }
        });
      }

      return this;
    },

    showNotice() {
      this.$('.inspector-notice').show();
      this.$('.inspector-tabs').hide();
      return this;
    },

    hideNotice() {
      this.$('.inspector-notice').hide();
      this.$('.inspector-tabs').show();
      return this;
    },

    show() {
      if (this.$el.is(':visible')) return this;
      return this.$el.show(), this.trigger('show');
    },

    hide() {
      if (this.$el.is(':hidden')) return this;
      return this.$el.hide(), this.trigger('hide');
    },

    events: {
      'keydown': e => e.stopPropagation(),

      'keyup': e => e.stopPropagation(),

      'click #inspectorClose': 'hide'
    }
  });
})(window);