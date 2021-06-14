(function (global) {
  const InspectorModel = Backbone.Model.extend({

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
        <% var PData = JSON.parse(global["variable_inspector_data"]) %>
        <div class='variableslabelcontainer'>
          <span class='variableslabel'><%= tr("Variables:") %></span>
        </div>
        <%= JSONTree.create(PData[0]) %>
        <div class='variableslabelcontainer'>
          <span class='variableslabel'><%= tr("Resources:") %></span>
        </div>
        <%= JSONTree.create(PData[1]) %>
      </div>
    `),

    initialize() {
      this.model = new InspectorModel();
    },

    render() {
      $('#variableInspector').html(this.template({
        global: _MainView.model.toJSON()
      }));
      console.log($('#variableInspector').length);
      if (_MainView.model.get('show_variable_inspector')) {
        $('#variableInspector').show();
      } else {
        $('#variableInspector').hide();
      }
      return this;
    }
  });

  global.Scenario.Inspector = InspectorView;
})(window);