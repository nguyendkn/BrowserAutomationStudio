(({ App, Backbone }, $, _) => {
  const { Inspector, JST, utils } = App;

  const Model = Backbone.Model.extend({
    update(stack) {
      this.set('stack', _.compact(stack.map(item => {
        const task = _TaskCollection.get(item.action), { dat } = utils.getTaskInfo(task);

        if (dat) {
          const data = {};

          if (!(['if', 'for', 'while', 'foreach'].includes(dat.s))) {
            data.name = dat.d.find(({ id }) => id === 'FunctionName').data;
            data.type = 'function';
          } else {
            if (dat.s === 'if') {
              data.expression = dat.d.find(({ id }) => id === 'IfExpression').data;
            }
            data.name = _.upperFirst(dat.s);
            data.type = 'action';
          }

          return { ...item, ...data };
        }

        return null;
      })));
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

      model.on('change:visibility', () => {
        this.filterStack();
      });

      model.on('change:stack', () => {
        this.renderStack();
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
      const content = JST['inspector/stack'](this.model.toJSON());

      morphdom(this.el.querySelector('.inspector-panel-data'), `<div class="inspector-panel-data">${content}</div>`, {
        onBeforeElUpdated: (from, to) => !from.isEqualNode(to),
        onNodeDiscarded: node => { },
        onNodeAdded: node => { },
        childrenOnly: true
      });

      return this;
    },

    filterStack() {
      _.each(this.model.get('visibility'), (visible, type) => {
        this.$(`[data-type="${type.slice(0, -1)}"]`).toggle(visible);
      });

      return this;
    },

    events: {
      'change .inspector-tools > ul > li > input': function (e) {
        this.model.set('visibility', {
          ...this.model.get('visibility'),
          [e.target.value]: e.target.checked
        });
      },

      'click .callstack-item-name': function (e) {
        e.preventDefault();
        BrowserAutomationStudio_FocusAction(e.target.closest('li').dataset.id, false);
      }
    }
  });
})(window, jQuery, _);