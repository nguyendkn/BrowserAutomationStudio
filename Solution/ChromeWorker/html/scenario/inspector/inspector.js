(function (global, $, _) {
  const Model = Backbone.Model.extend({
    defaults: {
      highlight: true,
      visible: false,
      resources: {},
      variables: {},
      callstack: {},
      update: true,
      state: {},
      tab: '',
    },

    resourcesInit: false,

    variablesInit: false,

    resourcesData: {},

    variablesData: {},

    update([variables, resources] = []) {
      const highlight = this.get('highlight');

      if (resources) {
        const diff = jsonpatch.compare(this.get('resources'), resources);
        this.set('resources', resources);

        if (this.resourcesInit) diff.forEach(({ path, value, op }) => {
          if (!_.has(this.resourcesData, path)) {
            this.resourcesData[path] = { usage: 6, value, op };
          } else if (op === 'remove') {
            delete this.resourcesData[path];
          }
        });

        if (highlight) _.each(this.resourcesData, (item, path) => {
          item.usage = diff.some(v => v.path === path) ? 1 : (item.usage + 1);
          this.trigger('highlight:resources', { ...item, path });
        });
        this.resourcesInit = true;
      }

      if (variables) {
        const diff = jsonpatch.compare(this.get('variables'), variables);
        this.set('variables', variables);

        if (this.variablesInit) diff.forEach(({ path, value, op }) => {
          if (!_.has(this.variablesData, path)) {
            this.variablesData[path] = { usage: 6, value, op };
          } else if (op === 'remove') {
            delete this.variablesData[path];
          }
        });

        if (highlight) _.each(this.variablesData, (item, path) => {
          item.usage = diff.some(v => v.path === path) ? 1 : (item.usage + 1);
          this.trigger('highlight:variables', { ...item, path });
        });
        this.variablesInit = true;
      }

      this.set('highlight', true);
    },

    getResource(pointer) {
      const source = this.get('resources');
      return jsonpatch.getValueByPointer(source, pointer);
    },

    getVariable(pointer) {
      const source = this.get('variables');
      return jsonpatch.getValueByPointer(source, pointer);
    },
  });

  const View = Backbone.View.extend({
    template: Scenario.JST['inspector/main'],

    initialize() {
      this.model = new Model();

      this.model.on('highlight:variables', ({ usage, path }) => {
        const $node = this.$(`[data-path="${path}"]`);

        if ($node.length) {
          const type = $node.data('type');
          if (type === 'object') return;
          if (type === 'array') return;

          const scale = chroma.scale(['red', JSONTree.colors[type]]).mode('rgb');
          $node.css('color', scale.colors(6, 'css')[Math.min(usage, 6) - 1]);
        }
      });

      this.model.on('change:resources', (__, resources) => {
        const $data = this.$('#inspectorResourcesData');
        const isEmpty = _.isEmpty(resources);

        if (!isEmpty) this.resourcesTree.render(resources);
        $data.toggle(!isEmpty).prev('#inspectorNoResources').toggle(isEmpty);
      });

      this.model.on('change:variables', (__, variables) => {
        const $data = this.$('#inspectorVariablesData');
        const isEmpty = _.isEmpty(variables);

        if (!isEmpty) this.variablesTree.render(variables);
        $data.toggle(!isEmpty).prev('#inspectorNoVariables').toggle(isEmpty);
      });

      this.model.on('change:tab', (__, tab) => {
        const $tabs = this.$('[data-tab-name]');

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
      this.setElement('#variableInspector');

      if (this.$el.is(':empty')) {
        this.$el.html(this.template({}));

        this.resourcesTree = new JSONTree(this.$('#inspectorResourcesData')[0], {
          onCollapse: BrowserAutomationStudio_PreserveInterfaceState,
          onExpand: BrowserAutomationStudio_PreserveInterfaceState,
          rootSort: Scenario.utils.sortByLocals,
          onRender: () => this.loadState(),
        });

        this.variablesTree = new JSONTree(this.$('#inspectorVariablesData')[0], {
          onCollapse: BrowserAutomationStudio_PreserveInterfaceState,
          onExpand: BrowserAutomationStudio_PreserveInterfaceState,
          rootSort: Scenario.utils.sortByLocals,
          onRender: () => this.loadState(),
        });

        interact(this.el).resizable({
          edges: { top: true },
          inertia: false,
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
          }
        });
      }

      return this;
    },

    toggle() {
      if (this.$el.is(':hidden')) {
        this.show();
      } else {
        this.hide();
      }
      return this;
    },

    hide() {
      this.model.set('visible', false);
      this.trigger('hide').$el.hide();
      return this;
    },

    show() {
      this.model.set('visible', true);
      this.trigger('show').$el.show();
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
      'dblclick #inspectorVariablesData [data-path]': function (e) {
        const { path } = e.target.dataset;
        const { type } = e.target.dataset;
        e.stopPropagation();
        if (!path) return;

        const modal = new global.Scenario.InspectorModal({
          callback: ({ isChanged, value, cancel, type }) => {
            if (!cancel && isChanged) {
              this.model.set('highlight', false);
              Scenario.utils.updateVariable(value, path, type);
            }
          },
          value: this.model.getVariable(path),
          type: type,
          path: path,
        });
        modal.render();
      },

      'click #inspectorShowCallstack': function (e) {
        this.model.set('tab', 'callstack');
        e.preventDefault();
      },

      'click #inspectorShowResources': function (e) {
        this.model.set('tab', 'resources');
        e.preventDefault();
      },

      'click #inspectorShowVariables': function (e) {
        this.model.set('tab', 'variables');
        e.preventDefault();
      },

      'click #inspectorClose': function (e) {
        e.preventDefault();
        this.hide();
      }
    }
  });

  global.Scenario.Inspector = { View };
})(window, jQuery, _);