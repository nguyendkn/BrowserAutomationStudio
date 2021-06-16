(function (global) {
  const colorMap = {
    1: '#ED2938',
    2: '#B25F4A',
    3: '#77945C',
    4: '#3BCA6D',
    5: '#2DB669',
  };

  const InspectorModel = Backbone.Model.extend({
    defaults: {
      resources: {},
      variables: {},
    },

    resourcesHash: {},

    variablesHash: {},

    update([variables, resources]) {
      if (resources != null) {
        const diff = jsonpatch.compare(resources, this.get('resources'));
        this.set('resources', resources);

        if (diff.length) {
          diff.forEach(({ path, value, op }) => {
            if (!_.has(this.resourcesHash, path)) {
              this.resourcesHash[path] = { usage: 0, value, operation: op };
            }
          });
          Object.entries(this.resourcesHash).forEach(([path, entry]) => {
            entry.usage = diff.some((v) => v.path === path) ? 1 : (entry.usage + 1);
            this.trigger('diff:resources', { ...entry, path });
          });
        }
      }

      if (variables != null) {
        const diff = jsonpatch.compare(variables, this.get('variables'));
        this.set('variables', variables);

        if (diff.length) {
          diff.forEach(({ path, value, op }) => {
            if (!_.has(this.variablesHash, path)) {
              this.variablesHash[path] = { usage: 0, value, operation: op };
            }
          });
          Object.entries(this.variablesHash).forEach(([path, entry]) => {
            entry.usage = diff.some((v) => v.path === path) ? 1 : (entry.usage + 1);
            this.trigger('diff:variables', { ...entry, path });
          });
        }
      }
    }
  });

  const InspectorView = Backbone.View.extend({
    template: _.template(/*html*/`
      <div style="position:absolute; top:9px; right:30px">
        <a href="#" id="variableInspectorClose" class="text-danger">
          <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 150%;background-color: #fafafa;padding: 5px;"></i>
        </a>
      </div>
      <div id="inspectorDataPending" style="<%= global['show_variable_inspector_pending'] ? '' : 'display: none' %>">
        <span><%= tr("Variables will be loaded on next script pause") %></span>
      </div>
      <div id="inspectorDataConainer" style="<%= global['show_variable_inspector_pending'] ? 'display: none' : '' %>">
        <div class="inspector-label-container">
          <span class="inspector-label"><%= tr('Variables:') %></span>
        </div>
        <div id="inspectorVariablesData"></div>

        <div class="inspector-label-container">
          <span class="inspector-label"><%= tr('Resources:') %></span>
        </div>
        <div id="inspectorResourcesData"></div>
      </div>
    `),

    initialize() {
      this.model = new InspectorModel();

      this.model.on('diff:variables', ({ usage, path }) => {
        const color = colorMap[Math.min(usage, 5)];
        this.$(`[data-path="${path}"]`).css('color', color);
      });

      this.model.on('change:resources', (__, resources) => {
        const tree = JSONTree.create(resources);
        this.$('#inspectorResourcesData').html(tree);
      });

      this.model.on('change:variables', (__, variables) => {
        const tree = JSONTree.create(variables);
        this.$('#inspectorVariablesData').html(tree);
      });
    },

    render() {
      this.setElement('#variableInspector');

      this.$el.html(this.template({ global: _MainView.model.toJSON() }));
      this.model.update(_MainView.model.get('variable_inspector_data'));
      if (_MainView.model.get('show_variable_inspector')) {
        this.$el.show();
      } else {
        this.$el.hide();
      }
      return this;
    },

    events: {
      'click #variableInspectorClose': function (event) {
        event.preventDefault();
        _MainView.model.set('show_variable_inspector', false);
        $('#variableInspector').hide();
        $('.main').css('padding-bottom', '50px');
      },
    }
  });

  global.Scenario.Inspector = InspectorView;
})(window);