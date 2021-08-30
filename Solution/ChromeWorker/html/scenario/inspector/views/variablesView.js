(({ App, $, _ }) => {
  const { Inspector, JST, utils } = App;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  const Model = ScriptDataModel.extend({
    defaults: () => ({ ...ScriptDataModel.prototype.defaults, allowHighlight: true })
  });

  Inspector.VariablesView = ScriptDataView.extend({
    template: JST['inspector/variables'],

    initialize: function () {
      this.model = new Model();
      ScriptDataView.prototype.initialize.apply(this);
    },

    render: function () {
      return ScriptDataView.prototype.render.apply(this);
    },

    events: function () {
      return _.extend({}, ScriptDataView.prototype.events, {
        'dblclick .inspector-panel-data [data-path]': function (e) {
          const { path } = e.target.dataset;
          const { type } = e.target.dataset;
          e.stopPropagation();
          if (!path) return;

          const modal = new Inspector.Modal({
            callback({ isChanged, value, cancel, type }) {
              if (!cancel && isChanged) {
                utils.updateVariable(value, path, type);
              }
            },
            value: jsonpatch.getValueByPointer(this.viewer.model.get('source'), path),
            type,
            path,
          });
          modal.render();
        },

        'keydown .inspector-filter-input': function (e) {
          if (e.key === ' ') e.preventDefault();
        }
      });
    }
  });
})(window);