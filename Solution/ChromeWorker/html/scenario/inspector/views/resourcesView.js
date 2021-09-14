(({ App, _ }) => {
  const { Inspector, JST } = App;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  Inspector.ResourcesView = ScriptDataView.extend({
    template: JST['inspector/resources'],

    allowHighlight: false,

    allowEdit: false,

    initialize: function () {
      this.model = new ScriptDataModel();
      ScriptDataView.prototype.initialize.call(this);
    },

    events: {
      ...ScriptDataView.prototype.events,
    }
  });
})(window);