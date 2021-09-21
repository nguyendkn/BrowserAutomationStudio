(({ App, _ }) => {
  const { Inspector, JST } = App;
  const { ScriptDataView } = Inspector;

  Inspector.ResourcesView = ScriptDataView.extend({
    template: JST['inspector/resources'],

    allowHighlight: false,

    allowEdit: false,

    initialize() {
      ScriptDataView.prototype.initialize.call(this);
    },

    events: {
      ...ScriptDataView.prototype.events,
    }
  });
})(window);