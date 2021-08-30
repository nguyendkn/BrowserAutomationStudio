(({ App, _ }) => {
  const { Inspector, JST, utils } = App;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  const Model = ScriptDataModel.extend({
    defaults: () => ({ ...ScriptDataModel.prototype.defaults, allowHighlight: false })
  });

  Inspector.ResourcesView = ScriptDataView.extend({
    template: JST['inspector/resources'],

    initialize: function () {
      this.model = new Model();
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