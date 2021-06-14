(function (global) {
  const InspectorModel = Backbone.Model.extend({
    defaults: {
      resources: {},
      variables: {},
    },

    update(data) {
      this.set('resources', data[1]);
      this.set('variables', data[0]);
    }
  });

  const InspectorView = Backbone.View.extend({
    template: _.template(/*html*/`
      <div style="position:absolute;top:9px;right:30px">
        <a href="#" id="closevariableinspector" class="text-danger"><i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 150%;background-color: #fafafa;padding: 5px;"></i></a>
      </div>
      <div id="pendingnotice" style="<%= (global['show_variable_inspector_pending']) ? '' : 'display:none' %>">
        <span><%= tr("Variables will be loaded on next script pause") %></span>
      </div>
      <div id="variablelistpending" style="<%= (global['show_variable_inspector_pending']) ? 'display:none' : '' %>">
        <% const data = JSON.parse(global['variable_inspector_data']) %>
        <div class='variableslabelcontainer'>
          <span class='variableslabel'><%= tr('Variables:') %></span>
        </div>
        <div id="inspectorVariablesData"><%= JSONTree.create(data[0]) %></div>

        <div class='variableslabelcontainer'>
          <span class='variableslabel'><%= tr('Resources:') %></span>
        </div>
        <div id="inspectorResourcesData"><%= JSONTree.create(data[1]) %></div>
      </div>
    `),

    initialize() {
      this.model = new InspectorModel();

      this.model.on('change:resources', (__, resources) => {
        this.$('#inspectorResourcesData').html(
          JSONTree.create(resources)
        );
      });

      this.model.on('change:variables', (__, variables) => {
        this.$('#inspectorVariablesData').html(
          JSONTree.create(variables)
        );
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
  });

  global.Scenario.Inspector = InspectorView;
})(window);