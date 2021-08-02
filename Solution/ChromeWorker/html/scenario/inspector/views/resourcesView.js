(function ({ Scenario }, $, _) {
  const { Inspector, JST } = Scenario;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  const Model = ScriptDataModel.extend({
    defaults: () => _.extend({}, ScriptDataModel.prototype.defaults, {
      allowHighlight: false,
      allowGroups: false,
    })
  });

  const View = ScriptDataView.extend({
    template: JST['inspector/resources'],

    model: new Model(),

    initialize() {
      ScriptDataView.prototype.initialize.apply(this);
    },

    render() {
      return ScriptDataView.prototype.render.apply(this);
    },

    events() {
      return _.extend({}, ScriptDataView.prototype.events, {

      });
    }
  });

  Inspector.Resources = View;
})(window, jQuery, _);