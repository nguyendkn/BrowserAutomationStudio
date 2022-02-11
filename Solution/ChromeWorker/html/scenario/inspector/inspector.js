'use strict';

(({ App, Backbone, _ }) => {
  const { Inspector } = App;

  Inspector.View = Backbone.View.extend({
    initialize() {
      let attached = false;

      window.addEventListener('message', ({ data: { type, payload } }) => {
        // prettier-ignore
        switch (type) {
          case 'focusAction': return BrowserAutomationStudio_FocusAction(payload.id);
          case 'confirm': return this.confirm(payload);
          case 'prompt': return this.prompt(payload);
          case 'edit': return edit(payload);
          case 'hide': return this.hide();
          case 'show': return this.show();
          default: {
            if (type === 'destroyed') {
              attached = false;
            }
            if (type === 'mounted') {
              attached = true;
            }
            this.trigger(type, payload);
          }
        }
      });

      _GobalModel.on('change:isscriptexecuting', (_, value) => {
        this.send({ type: 'action', payload: { executed: !value } });
      });

      _GobalModel.on('change:istaskexecuting', (_, value) => {
        this.send({ type: 'action', payload: { executed: !value } });
      });

      this.confirm = ({ message }) => {
        bootbox.confirm(message, result => {
          this.send({ type: 'confirm', payload: { result } });
        });
      };

      this.prompt = ({ message }) => {
        bootbox.prompt(message, result => {
          this.send({ type: 'prompt', payload: { result } });
        });
      };

      this.send = async message => {
        if (!attached) {
          await new Promise(resolve => this.once('mounted', resolve));
        }
        this.el.children[0].contentWindow.postMessage(message, '*');
      };
    },

    render() {
      if (!this.el.isConnected) {
        const { body } = document;

        this.setElement('#inspector').$el.resizable({
          onDragStart(e, ...args) {
            body.style.cursor = e.type === 'mouseup' ? '' : 'ns-resize';
            BrowserAutomationStudio_PreserveInterfaceState();
          },
          onDragEnd(e, ...args) {
            body.style.cursor = e.type === 'mouseup' ? '' : 'ns-resize';
            BrowserAutomationStudio_PreserveInterfaceState();
          },
          onDrag(e, ...args) {
            const height = Math.min(args[2], window.outerHeight - 300);
            return args[0].css('height', Math.max(110, height)), false;
          },
        });

        BrowserAutomationStudio_AskForVariablesUpdate();
      }
      return this;
    },

    show() {
      this.$el.show();
      BrowserAutomationStudio_PreserveInterfaceState();
      return this;
    },

    hide() {
      this.$el.hide();
      BrowserAutomationStudio_PreserveInterfaceState();
      return this;
    },
  });

  function edit(options) {
    const callback = (accept, { value, type }) => {
      if (accept) {
        let [root, ...path] = options.path;
        path = path.map(k => `[${JSON.stringify(k)}]`).join('');

        _.attempt(() => {
          if (type === 'date') {
            value = `_parse_date("${value}", "auto")`;
          } else if (type === 'script') {
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
    };
    return new Inspector.Modal({ ...options, callback }).render();
  }
})(window);
