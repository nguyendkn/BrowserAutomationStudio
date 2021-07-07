(function (global, $, _) {
  const InspectorModal = Backbone.View.extend({
    template: _.template(/*html*/`
      <div class="vertical-alignment-helper">
        <div class="modal-dialog vertical-align-center" role="document">
          <div class="inspector-modal-content">
            <div class="inspector-modal-header">
              <h4><%= tr("Change the variable") %></h4>
            </div>
            <div class="inspector-modal-body">
              <div class="inspector-modal-inputs">
                <textarea id="inspectorModalTextarea" style="resize: vertical; display: none;"></textarea>
                <input id="inspectorModalNumberInput" type="number" style="display: none;">
                <input id="inspectorModalTextInput" type="text" style="display: none;">
              </div>
              <select id="inspectorModalSelect">
                <option class="inspector-modal-select-option" value="boolean"><%= tr('Boolean') %></option>
                <option class="inspector-modal-select-option" value="string"><%= tr('String') %></option>
                <option class="inspector-modal-select-option" value="number"><%= tr('Number') %></option>
                <option class="inspector-modal-select-option" value="date"><%= tr('Date') %></option>
                <option class="inspector-modal-select-option" value="raw"><%= tr('Raw') %></option>
              </select>
            </div>
            <div class="inspector-modal-footer">
              <button type="button" id="inspectorModalAccept" class="btn-base btn-accept" data-dismiss="modal"><%= tr('Accept') %></button>
              <button type="button" id="inspectorModalCancel" class="btn-base btn-cancel" data-dismiss="modal"><%= tr('Cancel') %></button>
            </div>
          </div>
        </div>
      </div>
    `),

    id: 'inspectorModal',

    className: 'modal',

    tagName: 'div',

    events: {
      'change #inspectorModalNumberInput': function (e) {
        e.preventDefault();
        this.options.value = e.target.value;
      },

      'change #inspectorModalTextInput': function (e) {
        e.preventDefault();
        this.options.value = e.target.value;
      },

      'change #inspectorModalTextarea': function (e) {
        e.preventDefault();
        this.options.value = e.target.value;
      },

      'change #inspectorModalSelect': function (e) {
        const value = e.target.value || this.options.type;
        let $input = this.$('#inspectorModalTextarea');

        if (value === 'number') {
          $input = this.$('#inspectorModalNumberInput');
        } else if (value === 'boolean' || value === 'date') {
          $input = this.$('#inspectorModalTextInput');
        }

        this.$('.inspector-modal-inputs').children().not($input).hide();
        $input.val(this.options.value).show();
        e.preventDefault();
      },

      'click #inspectorModalAccept': function (e) {
        e.preventDefault();
        this.$el.modal('hide');
        this.remove().options.callback({
          type: this.$('#inspectorModalSelect').val(),
          value: this.options.value
        });
      },

      'click #inspectorModalCancel': function (e) {
        e.preventDefault();
        this.$el.modal('hide');
        this.remove().options.callback({
          type: this.$('#inspectorModalSelect').val(),
          value: null
        });
      },
    },

    render() {
      this.$el.html(this.template(this.options));

      this.$('#inspectorModalSelect').val(this.options.type).trigger('change').selectpicker({
        style: 'inspector-modal-select',
        template: { caret: '' },
      });

      this.$el.modal({ backdrop: 'static' });
      return this;
    },
  }, {
    show(options) {
      const modal = new InspectorModal(options);
      return modal.render();
    }
  });

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
    }
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
      'dblclick span[data-path]': function (e) {
        const path = e.target.dataset.path;
        const type = e.target.dataset.type;
        const initial = jsonpatch.getValueByPointer(this.model.get('variables'), path);

        InspectorModal.show({
          callback: ({ value, type }) => {
            if (value && value !== initial) {
              Scenario.utils.updateVariable(value, path, type);
            }
          },

          value: initial,

          type: type,

          path: path,
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