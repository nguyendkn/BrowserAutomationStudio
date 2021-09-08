(({ App, Backbone, $, _ }) => {
  const { Inspector, JST } = App;

  Inspector.Main = Backbone.View.extend({
    template: JST['inspector/main'],

    initialize() {
      _.each(['isscriptexecuting', 'istaskexecuting'], attr => {
        _GobalModel.on(`change:${attr}`, (__, value) => {
          if (value || this.$el.is(':hidden')) return;
          this.variables.model.set('highlight', true);
          this.resources.model.set('highlight', true);
        });
      });

      this.on('show', BrowserAutomationStudio_AskForVariablesUpdateOrWait);
    },

    render() {
      if (this.$el.is(':empty')) {
        this.setElement('#inspector').$el.html(this.template());

        this.variables = new Inspector.VariablesView({
          el: this.el.querySelector('#variables')
        }).render();

        this.resources = new Inspector.ResourcesView({
          el: this.el.querySelector('#resources')
        }).render();

        this.callstack = new Inspector.CallstackView({
          el: this.el.querySelector('#callstack')
        }).render();

        this.interact = interact(this.el).resizable({
          listeners: {
            move: ({ client }) => {
              const pos = client.y, height = Math.min(
                window.outerHeight - 300 - 30,
                window.outerHeight - pos - 30,
              );
              this.$el.outerHeight(Math.max(height, 120));
            }
          },
          edges: { top: true }
        });
      }

      return this;
    },

    hideNotice() {
      this.$('.inspector-notice').hide();
      this.$('.inspector-tabs').show();
      return this;
    },

    showNotice() {
      this.$('.inspector-notice').show();
      this.$('.inspector-tabs').hide();
      return this;
    },

    hide() {
      if (!this.$el.is(':visible')) return this;
      this.$el.hide();
      return this.trigger('hide');
    },

    show() {
      if (!this.$el.is(':hidden')) return this;
      this.$el.show();
      return this.trigger('show');
    },

    events: {
      'click #inspectorClose': function (e) {
        e.preventDefault();
        this.hide();
      },

      'keypress': e => e.stopPropagation(),

      'keydown': e => e.stopPropagation(),

      'keyup': e => e.stopPropagation(),
    }
  });
})(window);