(function (global) {
  const InspectorModel = Backbone.Model.extend({
    defaults: {
      showInspectorContent: false,
      showInspectorNotice: false,
      variablesPanelScroll: 0,
      resourcesPanelScroll: 0,
      inspectorHeight: 300,
      inspectorData: [],
      resources: {},
      variables: {},
    },

    resourcesData: {},

    variablesData: {},

    update() {
      const [variables, resources] = this.get('inspectorData');

      if (resources != null) {
        const diff = jsonpatch.compare(resources, this.get('resources'));
        this.unset('resources', { silent: true }).set('resources', resources);

        if (diff.length && !diff.every((v) => v.op === 'remove')) {
          diff.forEach(({ path, value, op }) => {
            if (!_.has(this.resourcesData, path)) {
              this.resourcesData[path] = { usage: 0, value, op };
            }
          });
          Object.entries(this.resourcesData).forEach(([path, entry]) => {
            entry.usage = diff.some((v) => v.path === path) ? 1 : (entry.usage + 1);
            this.trigger('diff:resources', { ...entry, path });
          });
        }
      }

      if (variables != null) {
        const diff = jsonpatch.compare(variables, this.get('variables'));
        this.unset('variables', { silent: true }).set('variables', variables);

        if (diff.length && !diff.every((v) => v.op === 'remove')) {
          diff.forEach(({ path, value, op }) => {
            if (!_.has(this.variablesData, path)) {
              this.variablesData[path] = { usage: 0, value, op };
            }
          });
          Object.entries(this.variablesData).forEach(([path, entry]) => {
            entry.usage = diff.some((v) => v.path === path) ? 1 : (entry.usage + 1);
            this.trigger('diff:variables', { ...entry, path });
          });
        }
      }
    }
  });

  const InspectorView = Backbone.View.extend({
    template: _.template(/*html*/`
      <div style="position: absolute; top: 9px; right: 30px;">
        <a href="#" id="variableInspectorClose" class="text-danger">
          <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 150%; background-color: #fafafa; padding: 5px;"></i>
        </a>
      </div>
      <div id="inspectorDataNotice" style="<%= model.showInspectorNotice ? '' : 'display: none' %>">
        <span><%= tr("Variables will be loaded on next script pause") %></span>
      </div>
      <div id="inspectorDataContainer" style="<%= model.showInspectorNotice ? 'display: none' : '' %>">
        <div class="inspector-data-tab">
          <div class="inspector-label-container">
            <span class="inspector-label"><%= tr('Variables:') %></span>
          </div>
          <div id="inspectorVariablesData"></div>
          <div id="inspectorNoVariables" style='font-size: smaller; margin-top: 10px; display: none;'><%= tr('No variables') %></div>
        </div>
        <div class="inspector-data-tab">
          <div class="inspector-label-container">
            <span class="inspector-label"><%= tr('Resources:') %></span>
          </div>
          <div id="inspectorResourcesData"></div>
          <div id="inspectorNoResources" style='font-size: smaller; margin-top: 10px; display: none;'><%= tr('No resources') %></div>
        </div>
      </div>
    `),

    initialize() {
      this.model = new InspectorModel();

      this.model.on('change:resources', (__, resources) => {
        const $resources = this.$('#inspectorResourcesData'),
          isEmpty = _.isEmpty(resources);

        if (!isEmpty) $resources.html(JSONTree.create(resources));
        this.$('#inspectorNoResources').toggle(isEmpty);
        $resources.toggle(!isEmpty);
      });

      this.model.on('change:variables', (__, variables) => {
        const $variables = this.$('#inspectorVariablesData'),
          isEmpty = _.isEmpty(variables);

        if (!isEmpty) $variables.html(JSONTree.create(variables));
        this.$('#inspectorNoVariables').toggle(isEmpty);
        $variables.toggle(!isEmpty);
      });

      this.model.on('diff:variables', ({ usage, path }) => {
        const $element = this.$(`[data-path="${path}"]`);
        if ($element.data('type') === 'object') return;
        if ($element.data('type') === 'array') return;

        const colors = _.rgbGradientToRed($element.css('color'));
        $element.css('color', colors[Math.min(usage, 5)]);
      });
    },

    render() {
      this.setElement('#variableInspector');

      this.$el.html(this.template({ model: this.model.toJSON() }));
      this.model.update();
      if (this.model.get('showInspectorContent')) {
        this.$el.show();
      } else {
        this.$el.hide();
      }

      if (!this.interact) {
        this.interact = interact(this.el)
          .resizable({
            edges: { top: true },
            inertia: false,
            modifiers: [],
          })
          .off('resizemove')
          .on('resizemove', (event) => {
            const windowHeight = $(window).height();
            const functionsHeight = $('#functions').outerHeight();

            let height = windowHeight - event.client.y - functionsHeight;
            height = Math.min(height, windowHeight - functionsHeight - 300);
            height = Math.max(height, 100);
            this.$el.css('height', height + 'px');

            $('.main').css('padding-bottom', (50 + height).toString() + 'px');
            this.model.set('inspectorHeight', height);
          });
      }

      return this;
    },

    toggle() {
      const showInspectorContent = !this.model.get('showInspectorContent');
      this.model.set("showInspectorContent", showInspectorContent);

      if (showInspectorContent) {
        this.$el.show();
        $('.main').css('padding-bottom', (50 + this.model.get('inspectorHeight')).toString() + 'px')

        BrowserAutomationStudio_AskForVariablesUpdateOrWait();
      } else {
        $('.main').css('padding-bottom', '50px');
        this.$el.hide();
      }
    },

    preserveScrollState() {
      if (!this.$('#inspectorDataNotice').is(':visible')) {
        this.model.set('variablesPanelScroll', this.$el.scrollTop());
        // this.model.set('resourcesPanelScroll', this.$el.scrollTop());
      }
    },

    restoreScrollState() {
      if (!this.$('#inspectorDataNotice').is(':visible')) {
        this.$el.scrollTop(this.model.get('variablesPanelScroll'));
        // this.$el.scrollTop(this.model.get('resourcesPanelScroll'));
      }
    },

    hidePendingNotice() {
      this.model.set('showInspectorNotice', false);
      this.$('#inspectorDataNotice').hide();
      this.$('#inspectorDataContainer').show();
      this.restoreScrollState();
    },

    showPendingNotice() {
      this.model.set('showInspectorNotice', true);
      this.preserveScrollState();
      this.$('#inspectorDataNotice').show();
      this.$('#inspectorDataContainer').hide();
    },

    loadState(state) {
      const $container = this.$('#inspectorDataContainer');

      state.objects.forEach(({ path, folded }) => {
        const $el = $container.find(`[data-path="${path}"]`);
        if ($el.hasClass('jstFolded') && folded) return;
        $el.children('.jstExpand').click();
      });

      state.arrays.forEach(({ path, folded }) => {
        const $el = $container.find(`[data-path="${path}"]`);
        if ($el.hasClass('jstFolded') && folded) return;
        $el.children('.jstExpand').click();
      });
    },

    saveState() {
      const $container = this.$('#inspectorDataContainer');

      const objects = _.map($container.find('[data-type="object"]'), (el) => {
        return { path: $(el).data('path'), folded: $(el).hasClass('jstFolded') };
      });

      const arrays = _.map($container.find('[data-type="array"]'), (el) => {
        return { path: $(el).data('path'), folded: $(el).hasClass('jstFolded') };
      });

      return { objects, arrays };
    },

    events: {
      'click #variableInspectorClose': function (event) {
        event.preventDefault();
        this.model.set('showInspectorContent', false);
        $('.main').css('padding-bottom', '50px');
        this.$el.hide();
      },
    }
  });

  global.Scenario.Inspector = InspectorView;
})(window);