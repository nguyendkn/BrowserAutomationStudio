(({ App, _ }) => {
  const { Inspector, JST } = App;
  const { ScriptDataView } = Inspector;
  const parentProto = ScriptDataView.prototype;

  Inspector.ResourcesView = ScriptDataView.extend({
    template: JST['inspector/resources'],

    allowHighlight: false,

    allowEdit: false,

    initialize() {
      parentProto.initialize.call(this);
    },

    events: {
      ...parentProto.events,
    }
  });
})(window);