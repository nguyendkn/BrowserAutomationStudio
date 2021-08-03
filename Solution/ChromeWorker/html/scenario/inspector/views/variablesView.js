(({ Scenario }, $, _) => {
  const { Inspector, JST } = Scenario;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  const Model = ScriptDataModel.extend({
    defaults: () => _.extend({}, ScriptDataModel.prototype.defaults, {
      allowHighlight: true,
      allowGroups: true,
    })
  });

  const View = ScriptDataView.extend({
    template: JST['inspector/variables'],

    model: new Model(),

    initialize() {
      ScriptDataView.prototype.initialize.apply(this);
    },

    render() {
      return ScriptDataView.prototype.render.apply(this);
    },

    events() {
      return _.extend({}, ScriptDataView.prototype.events, {
        'dblclick #inspectorVariablesData [data-path]': function (e) {
          const { path } = e.target.dataset;
          const { type } = e.target.dataset;
          e.stopPropagation();
          if (!path) return;

          const modal = new Inspector.Modal({
            callback: ({ isChanged, value, cancel, type }) => {
              if (!cancel && isChanged) {
                Scenario.utils.updateVariable(value, path, type);
              }
            },
            value: this.model.getValue(path),
            type,
            path,
          });
          modal.render();
        },
      });
    }
  });

  Inspector.Variables = View;
})(window, jQuery, _);