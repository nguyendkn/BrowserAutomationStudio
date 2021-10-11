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

      window.addEventListener('message', ({ data }) => {
        switch (data.type) {
          case 'focusAction':
            return BrowserAutomationStudio_FocusAction(data.json.id);
          case 'showModal':
            // TODO
            break;
          case 'hide':
            return this.hide();
          case 'show':
            return this.show();
        }
      }, false);
    },

    update(data) {
      this.$('iframe')[0].contentWindow.postMessage({
        type: 'update',
        json: JSON.parse(data),
      }, '*');
    },

    render() {
      if (this.$el.is(':empty')) {
        const { $el } = this.setElement('#inspector');

        this.resizable = interact($el[0]).resizable({
          listeners: {
            move({ client: { y } }) {
              $el.outerHeight(Math.max(120, Math.min(
                window.outerHeight - 300 - 30,
                window.outerHeight - y - 30,
              )));
            }
          },
          edges: { top: true }
        });
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

  function showModal({ path, type }) {
    // const modal = new Inspector.Modal({
    //   callback: result => this.trigger(`modal:${result.cancel ? 'cancel' : 'accept'}`, result),
    //   value: this.tree.model.getValue(path),
    //   type,
    //   path,
    // });

    // return modal.render();
  }

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
})(window);