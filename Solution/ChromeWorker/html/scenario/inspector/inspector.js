(function (global) {
  const InspectorModel = Backbone.Model.extend({
    defaults: {
      resources: {},
      variables: {},
    },

    update([variables, resources]) {
      const resourcesDiff = jsonpatch.compare(this.get('resources'), resources);
      this.set('resources', resources);
      console.log('resources diff:', resourcesDiff);

      const variablesDiff = jsonpatch.compare(this.get('variables'), variables);
      this.set('variables', variables);
      console.log('variables diff:', variablesDiff);
    }
  });

  const InspectorView = Backbone.View.extend({
    template: _.template(/*html*/`
      <div style="position:absolute;top:9px;right:30px">
        <a href="#" id="closeVariableInspector" class="text-danger">
          <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 150%;background-color: #fafafa;padding: 5px;"></i>
        </a>
      </div>
      <div id="pendingNotice" style="<%= (global['show_variable_inspector_pending']) ? '' : 'display:none' %>">
        <span><%= tr("Variables will be loaded on next script pause") %></span>
      </div>
      <div id="variableListPending" style="<%= (global['show_variable_inspector_pending']) ? 'display:none' : '' %>">
        <% const data = JSON.parse(global['variable_inspector_data']) %>
        <div class="variables-label-container">
          <span class="variables-label"><%= tr('Variables:') %></span>
        </div>
        <div id="inspectorVariablesData"><%= JSONTree.create(data[0]) %></div>

        <div class="variables-label-container">
          <span class="variables-label"><%= tr('Resources:') %></span>
        </div>
        <div id="inspectorResourcesData"><%= JSONTree.create(data[1]) %></div>
      </div>
    `),

    initialize() {
      this.model = new InspectorModel();

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

      this.$el.html(this.template({
        global: _MainView.model.toJSON()
      }));
      if (_MainView.model.get('show_variable_inspector')) {
        this.$el.show();
      } else {
        this.$el.hide();
      }
      return this;
    },

    events: {
      'click #closeVariableInspector': function (event) {
        event.preventDefault();
        _MainView.model.set('show_variable_inspector', false);
        $('#variableInspector').hide();
        $('.main').css('padding-bottom', '50px');
      },
    }
  });

  global.Scenario.Inspector = InspectorView;
})(window);