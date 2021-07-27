(function (global, $, _) {
  const Model = Backbone.Model.extend({
    defaults: {
      visible: false,
      state: {},
      tab: '',
    },
  });

  const View = Backbone.View.extend({
    template: Scenario.JST['inspector/main'],

    initialize() {
      this.model = new Model();

      _GobalModel.on('change:isscriptexecuting', (__, value) => {
        if (!value && this.model.get('visible')) {
          this.variables.model.set('highlight', true);
          this.resources.model.set('highlight', true);
        }
      });

      _GobalModel.on('change:istaskexecuting', (__, value) => {
        if (!value && this.model.get('visible')) {
          this.variables.model.set('highlight', true);
          this.resources.model.set('highlight', true);
        }
      });

      this.model.on('change:tab', (__, tab) => {
        const $tabs = this.$('.inspector-tab');

        $tabs.filter((__, el) => {
          return el.dataset.tabName !== tab;
        }).hide();

        $tabs.filter((__, el) => {
          return el.dataset.tabName === tab;
        }).show();
      });

      this.on('show', () => BrowserAutomationStudio_AskForVariablesUpdateOrWait());
    },

    render() {
      this.setElement('#inspector');

      if (this.$el.is(':empty')) {
        this.$el.html(this.template({}));

        this.variables = new Scenario.Inspector.Variables({
          el: this.$('[data-tab-name="variables"]')[0]
        }).on('renderTree', () => this.loadState()).render();

        this.resources = new Scenario.Inspector.Resources({
          el: this.$('[data-tab-name="resources"]')[0]
        }).on('renderTree', () => this.loadState()).render();

        this.callstack = new Scenario.Inspector.Callstack({
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
              height = Math.max(height, 100);

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

    loadState(state) {
      const $container = this.$('#inspectorContent');
      state = state || this.model.get('state');

      if (Array.isArray(state.objects)) {
        state.objects.forEach(({ path, folded }) => {
          const $el = $container.find(`[data-path="${path}"]`);
          if (folded && !$el.hasClass('jst-collapsed')) {
            $el.prev('.jst-collapse').click();
          }
        });
      }

      if (Array.isArray(state.arrays)) {
        state.arrays.forEach(({ path, folded }) => {
          const $el = $container.find(`[data-path="${path}"]`);
          if (folded && !$el.hasClass('jst-collapsed')) {
            $el.prev('.jst-collapse').click();
          }
        });
      }

      this.model.set('state', state);
    },

    saveState() {
      const $container = this.$('#inspectorContent');

      this.model.set('state', {
        objects: _.map($container.find('[data-type="object"]'), el => ({
          folded: el.classList.contains('jst-collapsed'),
          path: el.dataset.path,
        })),

        arrays: _.map($container.find('[data-type="array"]'), el => ({
          folded: el.classList.contains('jst-collapsed'),
          path: el.dataset.path,
        })),
      });

      return this.model.get('state');
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

  global.Scenario.Inspector.Main = View;
})(window, jQuery, _);