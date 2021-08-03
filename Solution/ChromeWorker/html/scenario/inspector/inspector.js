(({ Scenario, Backbone }, $, _) => {
  const { Inspector, JST } = Scenario;

  const Model = Backbone.Model.extend({
    defaults: {
      tab: 'variables',
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

      this.model.on('change:tab', (__, tab) => {
        this.$('.inspector-tab').each((__, el) => {
          const $el = $(el), { tabName } = el.dataset;

          if (tabName !== tab) {
            return $el.hide();
          }

          if (tabName === tab) {
            return $el.show();
          }
        });
      });

      this.on('show', () => BrowserAutomationStudio_AskForVariablesUpdateOrWait());
    },

    render() {
      if (this.$el.is(':empty')) {
        const html = this.template(this.model.toJSON());
        this.setElement('#inspector').$el.html(html);

        this.variables = new Inspector.Variables({
          el: this.$('[data-tab-name="variables"]')[0]
        }).render();

        this.resources = new Inspector.Resources({
          el: this.$('[data-tab-name="resources"]')[0]
        }).render();

        this.callstack = new Inspector.Callstack({
          el: this.$('[data-tab-name="callstack"]')[0]
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
      if (this.$el.is(':visible')) {
        this.model.set('visible', false);
        this.trigger('hide').$el.hide();
      }
      return this;
    },

    show() {
      if (this.$el.is(':hidden')) {
        this.model.set('visible', true);
        this.trigger('show').$el.show();
      }
      return this;
    },

    hideNotice() {
      this.$('.inspector-nav-item').removeClass('disabled');
      this.$('#inspectorNotice').hide();
    },

    showNotice() {
      this.$('.inspector-nav-item').addClass('disabled');
      this.$('#inspectorNotice').show();
    },

    events: {
      'click #inspectorShowCallstack': function (e) {
        e.preventDefault();
        this.model.set('tab', 'callstack');
      },

      'click #inspectorShowResources': function (e) {
        e.preventDefault();
        this.model.set('tab', 'resources');
      },

      'click #inspectorShowVariables': function (e) {
        e.preventDefault();
        this.model.set('tab', 'variables');
      },

      'click #inspectorClose': function (e) {
        e.preventDefault();
        this.hide();
      }
    }
  });

  Inspector.Main = View;
})(window, jQuery, _);