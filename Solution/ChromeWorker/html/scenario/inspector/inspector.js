(function (global) {
  const InspectorModel = Backbone.Model.extend({
    defaults: {
      showInspectorContent: false,
      showInspectorNotice: false,
      callStackPanelScroll: 0,
      variablesPanelScroll: 0,
      resourcesPanelScroll: 0,
      resources: {},
      variables: {},
      height: 300,
    },

    resourcesData: {},

    variablesData: {},

    update(data = []) {
      const [variables, resources] = data;

      if (resources != null) {
        const diff = jsonpatch.compare(resources, this.get('resources'));
        this.unset('resources', { silent: true }).set('resources', resources);

        if (diff.length && !diff.every((v) => v.op === 'remove')) {
          diff.forEach(({ path, value, op }) => {
            if (_.has(this.resourcesData, path)) return;
            this.resourcesData[path] = { usage: 0, value, op };
          });
        }
        Object.entries(this.resourcesData).forEach(([path, entry]) => {
          entry.usage = diff.some((v) => v.path === path) ? 1 : (entry.usage + 1);
          this.trigger('diff:resources', { ...entry, path });
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
        Object.entries(this.variablesData).forEach(([path, entry]) => {
          entry.usage = diff.some((v) => v.path === path) ? 1 : (entry.usage + 1);
          this.trigger('diff:variables', { ...entry, path });
        });
      }
    }
  });

  const InspectorView = Backbone.View.extend({
    template: _.template(/*html*/`
      <div style="position: absolute; top: 9px; right: 30px;">
        <a href="#" id="inspectorClose" class="text-danger">
          <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 150%; background-color: #fafafa; padding: 5px;"></i>
        </a>
      </div>
      <div id="inspectorDataNotice" style="<%= model.showInspectorNotice ? '' : 'display: none' %>">
        <span><%= tr("Variables will be loaded on next script pause") %></span>
      </div>
      <div id="inspectorDataContainer" style="<%= model.showInspectorNotice ? 'display: none' : '' %>">
        <ul class="inspector-navigation" style="display: none">
          <li id="inspectorOpenVariables"><%= tr('Variables') %></li>
          <li id="inspectorOpenResources"><%= tr('Resources') %></li>
          <li id="inspectorOpenCallStack"><%= tr('Call stack') %></li>
        </ul>
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
      const model = new InspectorModel()
        .on('change:resources', (__, resources) => {
          const $resources = this.$('#inspectorResourcesData'),
            isEmpty = _.isEmpty(resources);

          if (!isEmpty) {
            morphdom($resources[0], `<div id="inspectorResourcesData">${JSONTree.create(resources)}</div>`, {
              onBeforeElUpdated: (fromEl, toEl) => !fromEl.isEqualNode(toEl),
              childrenOnly: true
            });
          }
          this.$('#inspectorNoResources').toggle(isEmpty);
          $resources.toggle(!isEmpty);
        })
        .on('change:variables', (__, variables) => {
          const $variables = this.$('#inspectorVariablesData'),
            isEmpty = _.isEmpty(variables);

          if (!isEmpty) {
            morphdom($variables[0], `<div id="inspectorVariablesData">${JSONTree.create(variables)}</div>`, {
              onBeforeElUpdated: (fromEl, toEl) => !fromEl.isEqualNode(toEl),
              childrenOnly: true
            });
            $variables.html(JSONTree.create(variables));
          }
          this.$('#inspectorNoVariables').toggle(isEmpty);
          $variables.toggle(!isEmpty);
        })
        .on('diff:variables', ({ usage, path }) => {
          const $element = this.$(`[data-path="${path}"]`);
          if ($element.data('type') === 'object') return;
          if ($element.data('type') === 'array') return;

          const scale = chroma.scale(['red', $element.css('color')]).mode('rgb');
          $element.css('color', scale.colors(6, 'css')[Math.min(usage, 6) - 1]);
        });

      $(document).on('focus', '[data-path][contenteditable]', function (e) {
        // handle content-editable `focus` event.
        const $el = $(this), text = $el.text();

        $(/*html*/`<i class="fa fa-ellipsis-v" aria-hidden="true"></i>`).appendTo($el.parent());

        context.attach('.fa-ellipsis-v', [
          {
            text: tr('Date object'), action: (e) => {
              e.preventDefault();
              updateVariable(text, $el.text(), 'DateObject');
            }
          },
          {
            text: tr('Boolean'), action: (e) => {
              e.preventDefault();
              updateVariable(text, $el.text(), 'Boolean');
            }
          },
          {
            text: tr('String'), action: (e) => {
              e.preventDefault();
              updateVariable(text, $el.text(), 'String');
            }
          },
          {
            text: tr('Number'), action: (e) => {
              e.preventDefault();
              updateVariable(text, $el.text(), 'Number');
            }
          },
        ]);
      });

      $(document).on('blur', '[data-path][contenteditable]', function (e) {
        // handle content-editable `blur` event.
        const $el = $(this), text = $el.text();
        $el.find('.fa-ellipsis-v').remove();
      });

      function updateVariable(oldValue, newValue, type) {
        console.log('update variable:', {
          oldValue,
          newValue,
          type
        });
      }

      this.model = model;
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
            this.model.set('height', height);
          });
      }

      return this;
    },

    toggle() {
      const showInspectorContent = !this.model.get('showInspectorContent');
      this.model.set("showInspectorContent", showInspectorContent);

      if (showInspectorContent) {
        this.$el.show();
        BrowserAutomationStudio_AskForVariablesUpdateOrWait();
      } else {
        this.$el.hide();
      }
    },

    preserveScrollState() {
      if (!this.$('#inspectorDataNotice').is(':visible')) {
        this.model.set('variablesPanelScroll', this.$el.scrollTop());
        // this.model.set('resourcesPanelScroll', this.$el.scrollTop());
        // this.model.set('callStackPanelScroll', this.$el.scrollTop());
      }
    },

    restoreScrollState() {
      if (!this.$('#inspectorDataNotice').is(':visible')) {
        this.$el.scrollTop(this.model.get('variablesPanelScroll'));
        // this.$el.scrollTop(this.model.get('resourcesPanelScroll'));
        // this.$el.scrollTop(this.model.get('callStackPanelScroll'));
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

      if (Array.isArray(state.objects)) {
        state.objects.forEach(({ path, folded }) => {
          const $el = $container.find(`[data-path="${path}"]`);
          if (folded && $el.hasClass('jstFolded')) return;
          $el.children('.jstExpand').click();
        });
      }

      if (Array.isArray(state.arrays)) {
        state.arrays.forEach(({ path, folded }) => {
          const $el = $container.find(`[data-path="${path}"]`);
          if (folded && $el.hasClass('jstFolded')) return;
          $el.children('.jstExpand').click();
        });
      }
    },

    saveState() {
      const $container = this.$('#inspectorDataContainer');

      const objects = _.map($container.find('[data-type="object"]'), (el) => {
        const $el = $(el), path = $el.data('path');
        return { path, folded: $el.hasClass('jstFolded') };
      });

      const arrays = _.map($container.find('[data-type="array"]'), (el) => {
        const $el = $(el), path = $el.data('path');
        return { path, folded: $el.hasClass('jstFolded') };
      });

      return { objects, arrays };
    },

    events: {
      'click #inspectorOpenCallStack': function (e) {

      },

      'click #inspectorOpenResources': function (e) {

      },

      'click #inspectorOpenVariables': function (e) {

      },

      'click #inspectorClose': function (e) {
        e.preventDefault();
        this.model.set('showInspectorContent', false);
        this.$el.hide();
      }
    }
  });

  global.Scenario.Inspector = InspectorView;
})(window);