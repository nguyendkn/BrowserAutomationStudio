(({ Scenario, Backbone }, $, _) => {
  const { Inspector, JST, utils } = Scenario;

  const Model = Backbone.Model.extend({
    defaults: {
      visibility: {
        functions: true,
        actions: true,
        labels: true
      },
      stack: []
    },

    initialize() {
      _GobalModel.on('change:execute_next_id', (__, id) => {
        const task = _TaskCollection.get(id);
        const current = this.get('stack'), { dat } = utils.getTaskInfo(task);

        if (dat) {
          let type = '', params = {};

          if (['asyncfunction_call', 'executefunctioninseveralthreads', 'executefunction'].includes(dat.s)) {
            type = 'function';
            params = { name: dat.d.find(({ id }) => id === 'FunctionName').data };
          } else if (['for', 'while', 'foreach'].includes(dat.s)) {
            type = 'action';
            params = { name: dat.s };
          } else if (dat.s === 'goto') {
            params = { name: dat.d.find(({ id }) => id === 'LabelName').data };
            type = 'label';
          }

          if (type) current.push({ id, type, params });
        }

        this.set('stack', current);
      });
    }
  });

  Inspector.CallstackView = Backbone.View.extend({
    template: JST['inspector/callstack'],

    initialize() {
      const model = new Model();

      model.on('change:stack', (__, stack) => {

      });

      this.model = model;
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template(this.model.toJSON()));
      }
      return this;
    },

    events: {
      'change .inspector-tools > ul > li > input': function (e) {
        const $el = $(e.target), type = $el.val();

        this.model.set('visibility', {
          ...this.model.get('visibility'),
          [type]: $el.prop('checked')
        });
      },
    }
  });
})(window, jQuery, _);