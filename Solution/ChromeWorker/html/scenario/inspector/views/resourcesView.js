(({ App, _ }) => {
  const { Inspector } = App;
  const { JsonView } = Inspector;

  Inspector.ResourcesView = JsonView.extend({
    template: _.template(/*html*/`
      <div class="inspector-panel">
        <div class="inspector-panel-data"></div>
      </div>
    `),

    allowHighlight: false,

    initialize() {
      JsonView.prototype.initialize.call(this);
    }
  });
})(window);