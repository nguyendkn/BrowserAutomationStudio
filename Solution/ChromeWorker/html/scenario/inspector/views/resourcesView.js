(({ App, _ }) => {
  const { Inspector, JST, utils } = App;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  Inspector.ResourcesView = ScriptDataView.extend({
    template: JST['inspector/resources'],

    initialize: function () {
      this.model = new ScriptDataModel({ allowHighlight: false });
      ScriptDataView.prototype.initialize.call(this);
    },

    events: {
      ...ScriptDataView.prototype.events
    }
  });
})(window);