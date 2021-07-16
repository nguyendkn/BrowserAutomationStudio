(function (global, $, _) {
  const InspectorModel = Backbone.Model.extend({
    defaults: {
      callStackPanelScroll: 0,
      variablesPanelScroll: 0,
      resourcesPanelScroll: 0,
      highlightNext: true,
      showContent: false,
      showNotice: false,
      resources: {},
      variables: {},
      state: {},
    },

    resourcesInit: false,

    variablesInit: false,

    resourcesData: {},

    variablesData: {},

    update([variables, resources] = []) {
      const highlightNext = this.get('highlightNext');

      if (resources != null) {
        const diff = jsonpatch.compare(this.get('resources'), resources);
        this.unset('resources', { silent: true }).set('resources', resources);

        if (diff.length && this.resourcesInit) {
          diff.forEach(({ path, value, op }) => {
            if (_.has(this.resourcesData, path)) return;
            this.resourcesData[path] = { usage: 6, value, op };
          });
        }
        _.each(this.resourcesData, (item, path) => {
          if (highlightNext) item.usage = diff.some(v => v.path === path) ? 1 : (item.usage + 1);
          this.trigger('diff:resources', { ...item, path });
        });
        this.resourcesInit = true;
      }

      if (variables != null) {
        const diff = jsonpatch.compare(this.get('variables'), variables);
        this.unset('variables', { silent: true }).set('variables', variables);

        if (diff.length && this.variablesInit) {
          diff.forEach(({ path, value, op }) => {
            if (_.has(this.variablesData, path)) return;
            this.variablesData[path] = { usage: 6, value, op };
          });
        }
        _.each(this.variablesData, (item, path) => {
          if (highlightNext) item.usage = diff.some(v => v.path === path) ? 1 : (item.usage + 1);
          this.trigger('diff:variables', { ...item, path });
        });
        this.variablesInit = true;
      }

      this.set('highlightNext', true);
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

  const InspectorView = Backbone.View.extend({
    template: Scenario.JST['inspector/main'],

    initialize() {
      this.model = new InspectorModel();

      this.model.on('diff:variables', ({ usage, path }) => {
        const $element = this.$(`[data-path="${path}"]`);

        if ($element.length) {
          const type = $element.data('type');
          if (type === 'object') return;
          if (type === 'array') return;

          const scale = chroma.scale(['red', $element.css('color')]).mode('rgb');
          $element.css('color', scale.colors(6, 'css')[Math.min(usage, 6) - 1]);
        }
      });

      this.model.on('change:resources', (__, data) => {
        const $data = this.$('#inspectorResourcesData'), isEmpty = _.isEmpty(data);

        if (!isEmpty) {
          if (!this.resourcesTree)
            this.resourcesTree = new JSONTree($data[0], {
              onCollapse: BrowserAutomationStudio_PreserveInterfaceState,
              onExpand: BrowserAutomationStudio_PreserveInterfaceState,
              rootSort: Scenario.utils.sortByLocals
            });
          this.resourcesTree.render(data);
          this.loadState();
        }
        $data.toggle(!isEmpty).prev('#inspectorNoResources').toggle(isEmpty);
      });

      this.model.on('change:variables', (__, data) => {
        const $data = this.$('#inspectorVariablesData'), isEmpty = _.isEmpty(data);

        if (!isEmpty) {
          if (!this.variablesTree)
            this.variablesTree = new JSONTree($data[0], {
              onCollapse: BrowserAutomationStudio_PreserveInterfaceState,
              onExpand: BrowserAutomationStudio_PreserveInterfaceState,
              rootSort: Scenario.utils.sortByLocals
            });
          this.variablesTree.render(data);
          this.loadState();
        }
        $data.toggle(!isEmpty).prev('#inspectorNoVariables').toggle(isEmpty);
      });
    },

    render() {
      this.setElement('#variableInspector');

      if (this.$el.is(':empty')) this.$el.html(this.template());
      const showNotice = this.model.attributes['showNotice'];
      this.$('#inspectorContent').toggle(!showNotice);
      this.$('#inspectorNotice').toggle(showNotice);

      if (!this.interact) {
        this.interact = interact(this.el).resizable({
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
      const showContent = !this.model.get('showContent');
      this.model.set("showContent", showContent);

      if (showContent) {
        this.$el.show();
        BrowserAutomationStudio_AskForVariablesUpdateOrWait();
      } else {
        this.$el.hide();
      }
    },

    preserveScrollState() {
      if (!this.$('#inspectorNotice').is(':visible')) {
        this.model.set('variablesPanelScroll', this.$el.scrollTop());
        // this.model.set('resourcesPanelScroll', this.$el.scrollTop());
        // this.model.set('callStackPanelScroll', this.$el.scrollTop());
      }
    },

    restoreScrollState() {
      if (!this.$('#inspectorNotice').is(':visible')) {
        this.$el.scrollTop(this.model.get('variablesPanelScroll'));
        // this.$el.scrollTop(this.model.get('resourcesPanelScroll'));
        // this.$el.scrollTop(this.model.get('callStackPanelScroll'));
      }
    },

    hidePendingNotice() {
      if (this.model.get('showContent')) {
        this.model.set('showNotice', false);
        this.$('#inspectorNotice').hide();
        this.$('#inspectorContent').show();
        this.restoreScrollState();
      }
    },

    showPendingNotice() {
      if (this.model.get('showContent')) {
        this.model.set('showNotice', true);
        this.preserveScrollState();
        this.$('#inspectorNotice').show();
        this.$('#inspectorContent').hide();
      }
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
              this.model.set('highlightNext', false);
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
        this.model.set('showContent', false);
        this.$el.hide();
      }
    }
  });

  global.Scenario.Inspector = InspectorView;
})(window, jQuery, _);