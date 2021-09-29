(({ App, _ }) => {
  const { Inspector, JST } = App;
  const { JsonView } = Inspector;

  Inspector.ResourcesView = JsonView.extend({
    template: JST['inspector/resources'],

    allowHighlight: false,

    allowEdit: false,

    initialize() {
      JsonView.prototype.initialize.call(this);
    }
  });
})(window);