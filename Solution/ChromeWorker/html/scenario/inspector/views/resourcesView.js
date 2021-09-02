(({ App, _ }) => {
  const { Inspector, JST, utils } = App;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  Inspector.ResourcesView = ScriptDataView.extend({
    template: JST['inspector/resources'],

    initialize: function () {
      const model = new ScriptDataModel({ allowHighlight: false });
      ScriptDataView.prototype.initialize.call(this, { model });
    },

    events: {
      ...ScriptDataView.prototype.events
    }
  });
})(window);