(({ App, Backbone }, $, _) => {
  const { Inspector, JST, utils } = App;

  const Model = Backbone.Model.extend({
    update: function (source) {
      const stack = _.compact(source.map(item => {
        const task = _TaskCollection.get(item.action);

        if (task) {
          const { dat } = utils.getTaskInfo(task);

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
        }

        return null;
      }));

      this.set('stack', stack);
    },

    defaults: {
      filters: {
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
      const model = new Model()
        .on('change:filters', () => {
          this.filterStack();
        })
        .on('change:stack', () => {
          this.renderStack();
        });

      this.model = model;
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template(this.model.toJSON()));
      }

      return this.renderStack();
    },

    renderStack() {
      const $data = this.$('.inspector-panel-data');
      const $info = this.$('.inspector-panel-info');
      const size = _.size(this.model.get('stack'));

      morphdom($data[0], `<div class="inspector-panel-data">${JST['inspector/stack'](this.model.toJSON())}</div>`, {
        onBeforeElUpdated: (from, to) => !from.isEqualNode(to),
        onNodeDiscarded: node => { },
        onNodeAdded: node => { },
        childrenOnly: true
      });

      $data.toggle(size !== 0);
      $info.toggle(size === 0);
      return this;
    },

    filterStack() {
      _.each(this.model.get('filters'), (visible, type) => {
        this.$(`[data-type="${type.slice(0, -1)}"]`).toggle(visible);
      });

      return this;
    },

    events: {
      'change .inspector-tools > ul > li > input': function (e) {
        this.model.set('filters', {
          ...this.model.get('filters'),
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