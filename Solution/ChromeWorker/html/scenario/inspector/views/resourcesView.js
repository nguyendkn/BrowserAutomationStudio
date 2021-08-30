(({ App, _ }) => {
  const { Inspector, JST, utils } = App;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  Inspector.ResourcesView = ScriptDataView.extend({
    template: JST['inspector/resources'],

    initialize: function () {
      this.model = new ScriptDataModel({ allowHighlight: false });
      ScriptDataView.prototype.initialize.apply(this);
    },

    render: function () {
      return ScriptDataView.prototype.render.apply(this);
    },

    events: function () {
      return _.extend({}, ScriptDataView.prototype.events, {

      });
    }
  });
})(window);