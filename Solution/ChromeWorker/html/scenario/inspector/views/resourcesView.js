(({ App, _ }) => {
  const { Inspector, JST } = App;
  const { ScriptDataView } = Inspector;

  Inspector.ResourcesView = ScriptDataView.extend({
    template: JST['inspector/resources'],

    allowHighlight: false,

    allowEdit: false,

    initialize() {
      this.model = new Inspector.ScriptDataModel();
      ScriptDataView.prototype.initialize.call(this);
    },

    events: {
      ...ScriptDataView.prototype.events,
    }
  });
})(window);