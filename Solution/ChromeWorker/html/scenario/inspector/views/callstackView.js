(function (global, $, _) {
  const Model = Backbone.Model.extend({
    defaults: {
      callstack: {},
    }
  });

  const View = Backbone.View.extend({
    template: global.Scenario.JST['inspector/callstack'],

    initialize() {

    },

    render() {

    },
  });

  global.Scenario.Inspector.Callstack = View;
})(window, jQuery, _);