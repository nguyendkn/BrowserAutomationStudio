(({ Scenario, Backbone }, $, _) => {
  const { Inspector, JST } = Scenario;

  const Model = Backbone.Model.extend({
    defaults: {
      callstack: [0],
      visibility: {
        functions: true,
        actions: true,
        labels: true
      }
    },

    update(callstack) {
      const current = this.get('callstack');

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

  Inspector.CallstackView = Backbone.View.extend({
    template: JST['inspector/callstack'],

    initialize() {
      const model = new Model();

      model.on('change:callstack', (__, callstack) => {

      });

      this.model = model;
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template(this.model.toJSON()));
      }
      return this;
    },
  });
})(window, jQuery, _);