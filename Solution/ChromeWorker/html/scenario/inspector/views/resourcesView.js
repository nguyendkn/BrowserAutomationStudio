(({ App, _ }) => {
  const { Inspector, JST } = App;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  Inspector.ResourcesView = ScriptDataView.extend({
    template: JST['inspector/resources'],

    initialize: function () {
      this.model = new ScriptDataModel();
      ScriptDataView.prototype.initialize.call(this, { allowHighlight: false });
    },

    events: {
      ...ScriptDataView.prototype.events
    }
  });
})(window);