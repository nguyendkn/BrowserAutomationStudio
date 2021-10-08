(({ App, Backbone }) => {
  const { Inspector } = App;

  Inspector.Main = Backbone.View.extend({
    initialize() {
      ['isscriptexecuting', 'istaskexecuting'].forEach(attr => {
        _GobalModel.on(`change:${attr}`, (__, value) => {
          if (value || this.$el.is(':hidden')) return;
          // this.variables.model.set('highlight', true);
          // this.resources.model.set('highlight', true);
        });
      });

      this.on('show', () => BrowserAutomationStudio_AskForVariablesUpdateOrWait());
    },

    update(data) {
      // _.each(JSON.parse(data), (data, type) => {
      //   const view = _Inspector[type];
      //   if (view) view.model.update(data);
      // });
      this.$('iframe')[0].postMessage({
        type: 'update',
        json: JSON.parse(data),
      }, window.location.origin);
    },

    render() {
      if (this.$el.is(':empty')) {
        this.setElement('#inspector');

        this.resizable = interact(this.el).resizable({
          listeners: {
            move: ({ client: { y } }) => {
              this.$el.outerHeight(Math.max(120, Math.min(
                window.outerHeight - 300 - 30,
                window.outerHeight - y - 30,
              )));
            }
          },
          edges: { top: true }
        });

        window.addEventListener('message', ({ data }) => {
          if (data.type === 'hide') this.hide();
          if (data.type === 'show') this.show();
        }, false);

        // this.variables = new Inspector.JsonView({
        //   el: '#variables'
        // }).render();

        // this.resources = new Inspector.JsonView({
        //   el: '#resources'
        // }).render();
      }

      return this;
    },

    show() {
      if (this.$el.is(':visible')) return this;
      this.$el.show();
      return this.trigger('show');
    },

    hide() {
      if (this.$el.is(':hidden')) return this;
      this.$el.hide();
      return this.trigger('hide');
    }
  });

  function updateVariable(value, pointer, type) {
    const { root, path } = pointer.slice(1).split('/').reduce((data, key, at) => {
      return at !== 0 ? { ...data, path: `${data.path}['${key}']` } : {
        root: key.replace('GLOBAL:', ''),
        path: ''
      }
    }, {});

    _.attempt(() => {
      if (type === 'date') {
        value = `_parse_date('${value}', 'auto')`;
      } else if (type === 'custom') {
        value = JSON.stringify(eval(`(${value})`));
      } else if (type === 'string') {
        value = JSON.stringify(value);
      }

      VariablesNeedRefresh = true; BrowserAutomationStudio_Execute(`
        (function () {
          try {
            if (${pointer.startsWith('/GLOBAL:')}) {
              var obj = JSON.parse(P('basglobal', '${root}') || '{}');
              obj${path} = ${value};
              PSet('basglobal', '${root}', JSON.stringify(obj));
            } else {
              GLOBAL['VAR_${root}']${path} = ${value};
            }
          } catch (e) {}
        })();
        section_start('test', -3)!
      `);
    });
  }

  Inspector.CallstackView = Backbone.View.extend({
    events: {
      'show.bs.collapse .callstack-item': function (e) {
        const { id } = e.currentTarget.dataset;
        this.model.set('state', { ...this.model.get('state'), [id]: false });
      },

      'hide.bs.collapse .callstack-item': function (e) {
        const { id } = e.currentTarget.dataset;
        this.model.set('state', { ...this.model.get('state'), [id]: true });
      },

      'click .callstack-item-name': function (e) {
        const { id } = e.target.closest('li').dataset;
        BrowserAutomationStudio_FocusAction(id);
      },

      'click .callstack-item-data': function (e) {
        e.target.classList.toggle('text-truncate');
      }
    }
  });
})(window);