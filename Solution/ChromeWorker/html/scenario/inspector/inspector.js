'use strict';

(({ App, Backbone }) => {
  const { Inspector } = App;

  Inspector.Main = Backbone.View.extend({
    initialize() {
      // ['isscriptexecuting', 'istaskexecuting'].forEach(attr => {
      //   _GobalModel.on(`change:${attr}`, (__, value) => {
      //     if (value || this.$el.is(':hidden')) return;
      //     this.variables.model.set('highlight', true);
      //     this.resources.model.set('highlight', true);
      //   });
      // });

      window.addEventListener('message', e => {
        const { json, type } = e.data;

        switch (type) {
          case 'focusAction': return BrowserAutomationStudio_FocusAction(json.id);
          case 'edit': return showModal(json);
          case 'hide': return this.hide();
        }
      });

      this.on('show', () => BrowserAutomationStudio_AskForVariablesUpdateOrWait());
    },

    update(data) {
      const json = JSON.parse(data);

      this.el.querySelector('iframe').contentWindow.postMessage({
        payload: {
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
                window.outerHeight - 30 - 300,
                window.outerHeight - 30 - y,
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

  function showModal(options) {
    return new Inspector.Modal({
      ...options,
      callback(cancel, { value, type }) {
        if (cancel) return;
        let [root, ...path] = options.path;
        path = path.map(k => `[${JSON.stringify(k)}]`).join('');

        _.attempt(() => {
          if (type === 'date') {
            value = `new Date('${value}')`;
          } else if (type === 'custom') {
            value = JSON.stringify(eval(`(${value})`));
          } else if (type === 'string') {
            value = JSON.stringify(value);
          }

          VariablesNeedRefresh = true;
          BrowserAutomationStudio_Execute(`
            (function (root, value) {
              try {
                if (root.indexOf("GLOBAL:") === 0) {
                  root = root.slice(7);
                  var obj = JSON.parse(P("basglobal", root) || "{}");
                  obj${path} = value;
                  PSet("basglobal", root, JSON.stringify(obj));
                } else {
                  GLOBAL["VAR_" + root]${path} = value;
                }
              } catch (e) {}
            })(${JSON.stringify(root)}, ${value});
            section_start("test", -3)!
          `);
        });
      }
    }).render();
  }

  function prepareData(data) {
    return _.reduce(data, (acc, val, key) => {
      if (typeof val === 'string') {
        if (val.startsWith('_UNDEFINED_')) {
          val = undefined;
        } else if (val.startsWith('_DATE_')) {
          val = dayjs(val.slice(8), 'YYYY-MM-DD HH:mm:ss [UTC]Z').toDate();
        }
      } else if (_.isObject(val)) {
        val = prepareData(val);
      }
      return (acc[key] = val, acc);
    }, Array.isArray(data) ? [] : {});
  }

  const Model = Backbone.Model.extend({
    defaults: () => ({
      highlight: false,
      metadata: {},
      history: [],
      source: {}
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
            if (op === 'remove') return delete metadata[path];
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
  });
})(window);
