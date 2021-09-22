(({ App, _ }) => {
  const { Inspector, JST } = App;
  const { ScriptDataView } = Inspector;

  Inspector.VariablesView = ScriptDataView.extend({
    template: JST['inspector/variables'],

    allowHighlight: true,

    allowEdit: true,

    initialize() {
      ScriptDataView.prototype.initialize.call(this);
      this.on('modal:accept', ({ value, path, type }) => updateVariable(value, path, type));
    },

    events: {
      ...ScriptDataView.prototype.events,

      'keydown .inspector-filter-input': function (e) {
        if (e.key === ' ') e.preventDefault();
      }
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
})(window);