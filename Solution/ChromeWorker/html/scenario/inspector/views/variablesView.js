(({ App, _ }) => {
  const { Inspector, JST, utils } = App;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  Inspector.VariablesView = ScriptDataView.extend({
    template: JST['inspector/variables'],

    initialize: function () {
      this.model = new ScriptDataModel();
      ScriptDataView.prototype.initialize.call(this, { allowHighlight: true });
    },

    events: {
      ...ScriptDataView.prototype.events,

      'dblclick .jst-root > li > ul [data-path]': function (e) {
        e.stopPropagation();
        const { path, type } = e.target.dataset;

        const modal = new Inspector.Modal({
          callback({ isChanged, value, cancel, type }) {
            if (cancel || !isChanged) return;
            utils.updateVariable(value, path, type);
          },
          value: jsonpatch.getValueByPointer(this.viewer.model.get('source'), path),
          type,
        });
        modal.render();
      },

      'keydown .inspector-filter-input': function (e) {
        if (e.key === ' ') e.preventDefault();
      }
    }
  });
})(window);