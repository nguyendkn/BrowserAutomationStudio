'use strict';

(({ App, Backbone, _ }) => {
  const { Inspector } = App;

  Inspector.Main = Backbone.View.extend({
    initialize() {
      let pending = true;

      window.addEventListener('message', ({ data: { json, type } }) => {
        switch (type) {
          case 'focusAction': return BrowserAutomationStudio_FocusAction(json.id);
          case 'edit': return showModal(json);
          case 'hide': return this.hide();
          case 'show': return this.show();
          default: this.trigger(type);
        }
      });

      _GobalModel.on(`change:isscriptexecuting`, (_, value) => {
        if (value || this.$el.is(':hidden')) return;
        this.send({ type: 'highlight' });
      });

      _GobalModel.on(`change:istaskexecuting`, (_, value) => {
        if (value || this.$el.is(':hidden')) return;
        this.send({ type: 'highlight' });
      });

      this.send = msg => {
        if (pending) return this.once('created', () => {
          pending = false;
          this.send(msg);
        });
        this.el.contentWindow.postMessage(msg, '*');
      };
    },

    update(data) {
      const payload = prepareData(JSON.parse(data));
      this.send({ payload, type: 'update' });
    },

    render() {
      if (!this.el.isConnected) {
        const { $el } = this.setElement('#inspector');

        this.resizable = interact($el[0]).resizable({
          listeners: {
            move({ client: { y } }) {
              $el.outerHeight(Math.max(120, window.outerHeight - Math.max(300, y) - 30));
            },
          },
          edges: { top: true },
        });
      }
      return this;
    },

    hide() {
      if (this.$el.is(':visible')) {
        this.$el.hide();
      }
      return this;
    },

    show() {
      if (this.$el.is(':hidden')) {
        this.$el.show();
      }
      return this;
    },
  });

  function showModal(options) {
    const callback = (cancel, { value, type }) => {
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
    };

    return new Inspector.Modal({ ...options, callback }).render();
  }

  function prepareData(data) {
    const iteratee = (acc, val, key) => {
      if (typeof val === 'string') {
        if (val.startsWith('__UNDEFINED__')) {
          val = undefined;
        } else if (val.startsWith('__DATE__')) {
          val = new Date(val.slice(8));
        }
      } else if (_.isObject(val)) {
        val = prepareData(val);
      }
      return (acc[key] = val, acc);
    };
    return _.reduce(data, iteratee, Array.isArray(data) ? [] : {});
  }
})(window);
