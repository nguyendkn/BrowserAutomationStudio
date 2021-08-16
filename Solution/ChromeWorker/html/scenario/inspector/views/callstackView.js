(({ Scenario, Backbone }, $, _) => {
  const { Inspector, JST, utils } = Scenario;

  const Model = Backbone.Model.extend({
    initialize() {
      _GobalModel.on('change:execute_next_id', (__, id) => {
        _.attempt(() => {
          const task = _TaskCollection.get(id);
          const current = this.get('stack'), { dat } = utils.getTaskInfo(task);

          if (dat) {
            let type = '', data = {};

            if (['asyncfunction_call', 'executefunctioninseveralthreads', 'executefunction'].includes(dat.s)) {
              type = 'function';
              let params = {};
              const code = task.get('code');

              if (dat.s !== 'executefunctioninseveralthreads') {
                params = [...code.matchAll(/(_thread_start.+|_call_function.+)({.+})/g)][0];
                params = eval(`(${params[2]})`);
              }

              data = { name: dat.d.find(({ id }) => id === 'FunctionName').data, params };
            } else if (['if', 'for', 'while', 'foreach'].includes(dat.s)) {
              type = 'action';
              data = { name: dat.s };
            } else if (dat.s === 'goto') {
              data = { name: dat.d.find(({ id }) => id === 'LabelName').data };
              type = 'label';
            }

            if (type) current.push({ id, type, data });
          }

          this.set('stack', current);
        });
      });
    },

    defaults: {
      visibility: {
        functions: true,
        actions: true,
        labels: true
      },
      stack: []
    }
  });

  Inspector.CallstackView = Backbone.View.extend({
    template: JST['inspector/callstack'],

    initialize() {
      const model = new Model();

      model.on('change:visibility', (__, visibility) => {
        // TODO
      });

      model.on('change:stack', (__, stack) => {
        // TODO
      });

      this.model = model;
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template(this.model.toJSON()));
      }
      return this;
    },

    renderStack() {
      const content = JST['inspector/stack'](this.model.get('stack'));

      morphdom(this.el.querySelector('.inspector-panel-data'), `<div class="inspector-panel-data">${content}</div>`, {
        onBeforeElUpdated: (el, target) => !el.isEqualNode(target),
        onNodeDiscarded: el => { },
        onNodeAdded: el => { },
        childrenOnly: true
      });
    },

    showFunctionParams(id) {
      // TODO
    },

    hideFunctionParams(id) {
      // TODO
    },

    events: {
      'change .inspector-tools > ul > li > input': function (e) {
        const $el = $(e.target), type = $el.val();

        this.model.set('visibility', {
          ...this.model.get('visibility'),
          [type]: $el.prop('checked')
        });
      },

      'click .callstack-show-params': function (e) {
        e.preventDefault();
        this.showFunctionParams(null);
      },

      'click .callstack-hide-params': function (e) {
        e.preventDefault();
        this.hideFunctionParams(null);
      },

      'click .inspector-tools > button': function (e) {
        e.preventDefault();
        this.model.set('stack', []);
      }
    }
  });
})(window, jQuery, _);