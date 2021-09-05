(({ App, _ }) => {
  const { Inspector, JST, utils } = App;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  Inspector.ResourcesView = ScriptDataView.extend({
    template: JST['inspector/resources'],

    initialize: function () {
      ScriptDataView.prototype.initialize.call(this, {
        allowHighlight: false,
        model: new ScriptDataModel()
      });
    },

    events: {
      ...ScriptDataView.prototype.events
    }
  });
})(window);