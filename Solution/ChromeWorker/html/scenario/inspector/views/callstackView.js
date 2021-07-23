(function (global, $, _) {
  const Model = Backbone.Model.extend({
    defaults: {
      callstack: {},
    }
  });

  const View = Backbone.View.extend({

  });

  global.Scenario.Inspector.Callstack = View;
})(window, jQuery, _);