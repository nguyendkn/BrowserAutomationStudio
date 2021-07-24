(function (global, $, _) {
  const Model = Backbone.Model.extend({
    defaults: {
      callstack: [0],
    },

    update(callstack) {
      let current = this.get('callstack');

      if (callstack.length) {
        callstack.forEach((id) => {
          const index = current.lastIndexOf(id);
  
          if (index >= 0) {
            current.splice(index + 1);
          } else {
            current.push(id);
          }
        });
      } else {
        current.splice(1);
      }

      this.set('callstack', current);
    }
  });

  const View = Backbone.View.extend({
    template: global.Scenario.JST['inspector/callstack'],

    initialize() {
      const model = new Model();

      model.on('change:callstack', (__, callstack) => {

      });

      this.model = model;
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template());
      }
      return this;
    },
  });

  global.Scenario.Inspector.Callstack = View;
})(window, jQuery, _);