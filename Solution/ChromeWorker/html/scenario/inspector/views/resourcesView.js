(({ App, _ }) => {
  const { Inspector } = App;
  const { JsonView } = Inspector;

  Inspector.ResourcesView = JsonView.extend({
    template: _.template(/*html*/`
      <div class="inspector-panel" data-empty="true">
        <div class="inspector-panel-data"></div>
        <div class="inspector-panel-info">
          <span><%= tr('No resources') %></span>
        </div>
      </div>
    `),

    allowHighlight: false,

    allowEdit: false,

    initialize() {
      JsonView.prototype.initialize.call(this);
    }
  });
})(window);