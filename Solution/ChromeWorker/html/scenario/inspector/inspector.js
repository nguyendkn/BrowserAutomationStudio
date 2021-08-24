(({ App, Backbone }, $, _) => {
  const { Inspector, JST } = App;

  Inspector.Main = Backbone.View.extend({
    template: JST['inspector/main'],

    initialize() {
      _GobalModel.on('change:isscriptexecuting', (__, value) => {
        if (value || this.$el.is(':hidden')) return;
        this.variables.model.set('highlight', true);
        this.resources.model.set('highlight', true);
      });

      _GobalModel.on('change:istaskexecuting', (__, value) => {
        if (value || this.$el.is(':hidden')) return;
        this.variables.model.set('highlight', true);
        this.resources.model.set('highlight', true);
      });

      this.on('show', () => BrowserAutomationStudio_AskForVariablesUpdateOrWait());
    },

    render() {
      if (this.$el.is(':empty')) {
        this.setElement('#inspector').$el.html(this.template());

        this.variables = new Inspector.VariablesView({
          el: this.$('#variables')[0]
        }).render();

        this.resources = new Inspector.ResourcesView({
          el: this.$('#resources')[0]
        }).render();

        this.callstack = new Inspector.CallstackView({
          el: this.$('#callstack')[0]
        }).render();

        this.interact = interact(this.el).resizable({
          listeners: {
            move: ({ client }) => {
              const h1 = $('#functions').outerHeight();
              const h2 = $(window).outerHeight();
              let height = h2 - h1 - client.y;
              const max = h2 - h1 - 300;

              height = Math.min(height, max);
              height = Math.max(height, 120);

              this.$el.css('height', `${height}px`);
            }
          },
          edges: { top: true }
        });
      }

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

    hideNotice() {
      this.$('.inspector-nav > li').removeClass('disabled');
      this.$('.inspector-notice').hide();
      this.$('.inspector-tabs').show();
      return this;
    },

    showNotice() {
      this.$('.inspector-nav > li').addClass('disabled');
      this.$('.inspector-notice').show();
      this.$('.inspector-tabs').hide();
      return this;
    },

    events: {
      'click #inspectorClose': function (e) {
        e.preventDefault();
        this.hide();
      },

      'keydown': function (e) {
        e.stopPropagation();
      },

      'keyup': function (e) {
        e.stopPropagation();
      }
    }
  });
})(window, jQuery, _);