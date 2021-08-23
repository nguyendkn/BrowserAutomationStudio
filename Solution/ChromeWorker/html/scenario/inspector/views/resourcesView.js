(({ App }, $, _) => {
  const { Inspector, JST, utils } = App;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  const Model = ScriptDataModel.extend({
    defaults: () => _.extend({}, ScriptDataModel.prototype.defaults, {
      allowHighlight: false,
    })
  });

  Inspector.ResourcesView = ScriptDataView.extend({
    template: JST['inspector/resources'],

    model: new Model(),

    initialize: function () {
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
})(window, jQuery, _);