(({ App, _ }) => {
  const { Inspector, JST } = App;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  Inspector.ResourcesView = ScriptDataView.extend({
    template: JST['inspector/resources'],

    initialize: function () {
      this.model = new ScriptDataModel();
      ScriptDataView.prototype.initialize.call(this, { allowHighlight: false });
    },

    openModal: function (e) {
      e.stopPropagation();
      const { path, type } = e.target.closest('li').dataset;

      const modal = new Inspector.Modal({
        callback({ isChanged, value, cancel, type }) {
          if (cancel || !isChanged) return;
          // updateVariable(value, path, type);
        },
        value: this.viewer.model.getValue(path),
        type,
        path
      });

      modal.render();
    },

    events: {
      ...ScriptDataView.prototype.events,

      'dblclick .jst-root > li > ul > li > .jst-node': 'openModal',

      'dblclick .jst-root > li > ul > li > .jst-list': 'openModal',
    }
  });
})(window);