(({ App, _ }) => {
  const { Inspector, JST, utils } = App;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  Inspector.ResourcesView = ScriptDataView.extend({
    template: JST['inspector/resources'],

    initialize: function () {
      ScriptDataView.prototype.initialize.call(this, {
        model: new ScriptDataModel({ allowHighlight: true })
      });
      _.bindAll(this, 'render');
    },

    events: {
      ...ScriptDataView.prototype.events
    }
  });
})(window);