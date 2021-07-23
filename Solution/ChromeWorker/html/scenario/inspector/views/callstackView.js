(function (global, $, _) {
  const Model = Backbone.Model.extend({
    defaults: {
      callstack: {},
    }
  });

  const View = Backbone.View.extend({
    template: global.Scenario.JST['inspector/callstack'],

    initialize() {
      const model = new Model();

      this.model = model;
    },

    render() {
      return this;
    },
  });

  global.Scenario.Inspector.Callstack = View;
})(window, jQuery, _);