'use strict';

(({ App, Backbone, _ }) => {
  const { Inspector } = App;

  Inspector.View = Backbone.View.extend({
    initialize() {
      let mounted = false;

      window.addEventListener('message', ({ data: { payload, type } }) => {
        switch (type) {
          case 'focusAction': return BrowserAutomationStudio_FocusAction(payload.id);
          case 'edit': return edit(payload);
          case 'hide': return this.hide();
          case 'show': return this.show();
          default: this.trigger(type);
        }
      });

      _GobalModel.on('change:isscriptexecuting', (_, value) => {
        if (value || this.$el.is(':hidden')) return;
        this.send({ type: 'highlight' });
      });

      _GobalModel.on('change:istaskexecuting', (_, value) => {
        if (value || this.$el.is(':hidden')) return;
        this.send({ type: 'highlight' });
      });

      this.send = async message => {
        if (!mounted) await new Promise(resolve => {
          this.once('mounted', () => resolve(mounted = true));
        });
        this.el.contentWindow.postMessage(message, '*');
      };
    },

    render() {
      if (!this.el.isConnected) {
        const { $el } = this.setElement('#inspector');

        this.resizable = interact($el[0]).resizable({
          onmove({ client: { y } }) {
            $el.outerHeight(Math.max(110, window.outerHeight - Math.max(y, 300) - 32));
          },
          edges: { top: true },
        });
      }
      return this;
    },

    show() {
      this.$el.show();
      return this;
    },

    hide() {
      this.$el.hide();
      return this;
    },
  });

  function edit(options) {
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
})(window);
