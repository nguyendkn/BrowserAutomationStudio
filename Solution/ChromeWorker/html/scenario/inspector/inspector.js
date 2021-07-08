(function (global, $, _) {
  const InspectorModel = Backbone.Model.extend({
    defaults: {
      callStackPanelScroll: 0,
      variablesPanelScroll: 0,
      resourcesPanelScroll: 0,
      showContent: false,
      showNotice: false,
      resources: {},
      variables: {},
      state: {},
    },

    resourcesData: {},

    variablesData: {},

    update([variables, resources] = []) {
      if (resources != null) {
        const diff = jsonpatch.compare(resources, this.get('resources'));
        this.unset('resources', { silent: true }).set('resources', resources);

        if (diff.length && !diff.every((v) => v.op === 'remove')) {
          diff.forEach(({ path, value, op }) => {
            if (_.has(this.resourcesData, path)) return;
            this.resourcesData[path] = { usage: 0, value, op };
          });
        }
        _.each(this.resourcesData, (item, path) => {
          item.usage = diff.some((v) => v.path === path) ? 1 : (item.usage + 1);
          this.trigger('diff:resources', { ...item, path });
        });
      }

      if (variables != null) {
        const diff = jsonpatch.compare(variables, this.get('variables'));
        this.unset('variables', { silent: true }).set('variables', variables);

        if (diff.length && !diff.every((v) => v.op === 'remove')) {
          diff.forEach(({ path, value, op }) => {
            if (_.has(this.variablesData, path)) return;
            this.variablesData[path] = { usage: 0, value, op };
          });
        }
        _.each(this.variablesData, (item, path) => {
          item.usage = diff.some((v) => v.path === path) ? 1 : (item.usage + 1);
          this.trigger('diff:variables', { ...item, path });
        });
      }
    },

    getVariable(pointer) {
      const source = this.get('variables');
      return jsonpatch.getValueByPointer(source, pointer);
    },

    getResource(pointer) {
      const source = this.get('resources');
      return jsonpatch.getValueByPointer(source, pointer);
    },
  });

  const InspectorView = Backbone.View.extend({
    template: _.template(/*html*/`
      <div style="position: absolute; top: 9px; right: 30px;">
        <a href="#" id="inspectorClose" class="text-danger">
          <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 150%; background-color: #fafafa; padding: 5px;"></i>
        </a>
      </div>
      <div id="inspectorNotice" style="display: none">
        <span><%= tr("Variables will be loaded on next script pause") %></span>
      </div>
      <div id="inspectorContent" style="display: block">
        <ul class="inspector-navigation" style="display: none">
          <li id="inspectorShowVariables"><%= tr('Variables') %></li>
          <li id="inspectorShowResources"><%= tr('Resources') %></li>
          <li id="inspectorShowCallStack"><%= tr('Call stack') %></li>
        </ul>
        <div class="inspector-data-tab">
          <div class="inspector-label-container">
            <span class="inspector-label"><%= tr('Variables:') %></span>
          </div>
          <div id="inspectorVariablesData"></div>
          <div id="inspectorNoVariables" style="font-size: smaller; margin-top: 10px; display: none;"><%= tr('No variables') %></div>
        </div>
        <div class="inspector-data-tab">
          <div class="inspector-label-container">
            <span class="inspector-label"><%= tr('Resources:') %></span>
          </div>
          <div id="inspectorResourcesData"></div>
          <div id="inspectorNoResources" style="font-size: smaller; margin-top: 10px; display: none;"><%= tr('No resources') %></div>
        </div>
      </div>
    `),

    initialize() {
      const model = new InspectorModel();

      model.on('change:resources', (__, data) => {
        const $data = this.$('#inspectorResourcesData'), isEmpty = _.isEmpty(data);

        if (!isEmpty) {
          if (!this.resourcesTree)
            this.resourcesTree = new JSONTree($data[0], {
              rootSort: Scenario.utils.sortBy.localsFirst,
              onExpand: BrowserAutomationStudio_PreserveInterfaceState,
              onCollapse: BrowserAutomationStudio_PreserveInterfaceState,
            });
          this.resourcesTree.update(data);
          this.loadState();
        }
        this.$('#inspectorNoResources').toggle(isEmpty);
        $data.toggle(!isEmpty);
      });

      model.on('change:variables', (__, data) => {
        const $data = this.$('#inspectorVariablesData'), isEmpty = _.isEmpty(data);

        if (!isEmpty) {
          if (!this.variablesTree)
            this.variablesTree = new JSONTree($data[0], {
              rootSort: Scenario.utils.sortBy.localsFirst,
              onExpand: BrowserAutomationStudio_PreserveInterfaceState,
              onCollapse: BrowserAutomationStudio_PreserveInterfaceState,
            });
          this.variablesTree.update(data);
          this.loadState();
        }
        this.$('#inspectorNoVariables').toggle(isEmpty);
        $data.toggle(!isEmpty);
      });

      model.on('diff:variables', ({ usage, path }) => {
        const $element = this.$(`[data-path="${path}"]`);
        if ($element.data('type') === 'object') return;
        if ($element.data('type') === 'array') return;

        const scale = chroma.scale(['red', $element.css('color')]).mode('rgb');
        $element.css('color', scale.colors(6, 'css')[Math.min(usage, 6) - 1]);
      });

      this.model = model;
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
        objects: _.map($container.find('[data-type="object"]'), (el) => {
          const $el = $(el);
          return { path: $el.data('path'), folded: $el.hasClass('jst-collapsed') };
        }),

        arrays: _.map($container.find('[data-type="array"]'), (el) => {
          const $el = $(el);
          return { path: $el.data('path'), folded: $el.hasClass('jst-collapsed') };
        })
      });

      return this.model.get('state');
    },

    events: {
      'dblclick #inspectorVariablesData [data-path]': function (e) {
        const raw = $(e.target).hasClass('jst-list');
        let { path } = e.target.dataset;
        let { type } = e.target.dataset;
        type = raw ? 'raw' : type;

        global.Scenario.InspectorModal.show({
          value: this.model.getVariable(path),

          callback: ({ isChanged, value, cancel, type }) => {
            if (!cancel && isChanged) {
              Scenario.utils.updateVariable(value, path, type);
            }
          },

          type,
        });

        e.stopPropagation();
      },

      'click #inspectorShowCallStack': function (e) {
        e.preventDefault();
      },

      'click #inspectorShowResources': function (e) {
        e.preventDefault();
      },

      'click #inspectorShowVariables': function (e) {
        e.preventDefault();
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