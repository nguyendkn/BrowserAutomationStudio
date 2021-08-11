(({ Scenario, Backbone }, $, _) => {
  const { Inspector, JST } = Scenario;

  const Model = Backbone.Model.extend({
    defaults: {
      visible: false,
    },
  });

  const View = Backbone.View.extend({
    template: JST['inspector/main'],

    initialize() {
      this.model = new Model();

      _GobalModel.on('change:isscriptexecuting', (__, value) => {
        if (value || !this.model.get('visible')) return;
        this.variables.model.set('highlight', true);
        this.resources.model.set('highlight', true);
      });

      _GobalModel.on('change:istaskexecuting', (__, value) => {
        if (value || !this.model.get('visible')) return;
        this.variables.model.set('highlight', true);
        this.resources.model.set('highlight', true);
      });

      this.on('show', () => BrowserAutomationStudio_AskForVariablesUpdateOrWait());
    },

    render() {
      if (this.$el.is(':empty')) {
        const html = this.template(this.model.toJSON());
        this.setElement('#inspector').$el.html(html);

        this.variables = new Inspector.VariablesView({
          el: this.$('#variables')[0]
        }).render();

        this.resources = new Inspector.ResourcesView({
          el: this.$('#resources')[0]
        }).render();

        this.callstack = new Inspector.CallstackView({
          el: this.$('#callstack')[0]
        }).render();

        interact(this.el).resizable({
          listeners: {
            move: ({ client }) => {
              const h1 = $(functions).outerHeight();
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
      this.model.set('visible', false);
      this.trigger('hide').$el.hide();
      return this;
    },

    show() {
      if (!this.$el.is(':hidden')) return this;
      this.model.set('visible', true);
      this.trigger('show').$el.show();
      return this;
    },

    hideNotice() {
      this.$('.inspector-nav-item').removeClass('disabled');
      this.$('.inspector-notice').hide();
      return this;
    },

    showNotice() {
      this.$('.inspector-nav-item').addClass('disabled');
      this.$('.inspector-notice').show();
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
      },
    }
  });

  Inspector.Main = View;
})(window, jQuery, _);