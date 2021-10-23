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
          case 'focusAction': return BrowserAutomationStudio_FocusAction(data.json.id);
          case 'showModal': return showModal(data.json);
          case 'hide': return this.hide();
          case 'show': return this.show();
        }
      });
    },

    update(data) {
      const json = JSON.parse(data);

      this.el.querySelector('iframe').contentWindow.postMessage({
        json: {
          variables: prepareData(json.variables),
          resources: prepareData(json.resources),
          callstack: json.callstack
        }
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

  function showModal({ path, type, allowUpdate }) {
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

  function prepareData(data) {
    return _.reduce(data, (res, val, key) => {
      if (typeof (val) === 'string') {
        if (val.startsWith('_UNDEFINED_')) {
          val = undefined;
        } else if (val.startsWith('_DATE_')) {
          val = dayjs(val.slice(8), 'YYYY-MM-DD HH:mm:ss [UTC]Z').toDate();
        }
      } else if (_.isObject(val)) {
        val = prepareData(val);
      }
      return (res[key] = val, res);
    }, Array.isArray(data) ? [] : {});
  }

  // _.each(this.tree.sortable.nodes, nodes => {
  //   nodes.sort(nodes.toArray().sort((a, b) => {
  //     return (a.startsWith('/GLOBAL:') - b.startsWith('/GLOBAL:')) || (() => {
  //       switch (sorting) {
  //         case 'dateModified':
  //           return metadata[b].modifiedAt - metadata[a].modifiedAt;
  //         case 'dateCreated':
  //           return metadata[b].createdAt - metadata[a].createdAt;
  //         case 'frequency':
  //           const f2 = cache.filter(v => v === b).length + updates;
  //           const f1 = cache.filter(v => v === a).length + updates;
  //           return metadata[b].usages / f2 - metadata[a].usages / f1;
  //       }

  //       return a.localeCompare(b);
  //     })();
  //   }));
  // });

  const Model = Backbone.Model.extend({
    defaults: () => ({
      highlight: false,
      metadata: {},
      history: [],
      source: {},
    }),

    update: function (source) {
      const diff = jsonpatch.compare(this.get('source'), source);
      const highlight = this.get('highlight');
      const metadata = this.get('metadata');

      if (diff.length) {
        let history = [...this.get('history'), _.pluck(diff, 'path')].slice(-100);

        _.each(diff, ({ path, op }) => {
          const now = performance.now();

          if (_.has(metadata, path)) {
            if (op === 'remove') return (delete metadata[path]);
            metadata[path].modifiedAt = now;
            metadata[path].usages += 1;
            metadata[path].count += 0;
          } else {
            metadata[path] = { modifiedAt: now, createdAt: now, usages: 1, count: 5 };
          }
        });

        this.set('history', history);
        this.set('source', source);
      }

      _.each(metadata, (item, path) => {
        if (highlight) {
          item.count = diff.some(v => v.path === path) ? 0 : Math.min(item.count + 1, 5);
        }
        this.trigger('highlight', { count: item.count, path });
      });

      this.set('highlight', false);
    }
  })
})(window);