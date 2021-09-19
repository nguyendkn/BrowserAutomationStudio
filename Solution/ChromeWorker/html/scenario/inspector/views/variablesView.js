(({ App, _ }) => {
  const { Inspector, JST } = App;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  Inspector.VariablesView = ScriptDataView.extend({
    template: JST['inspector/variables'],

    allowHighlight: true,

    allowEdit: true,

    initialize() {
      this.model = new ScriptDataModel();
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
    const { root, path, isLocal, isGlobal } = pointer.split('/').slice(1).reduce((data, key, at) => {
      return at !== 0 ? { ...data, path: `${data.path}['${key}']` } : {
        isGlobal: key.indexOf('GLOBAL:') === 0,
        isLocal: key.indexOf('GLOBAL:') !== 0,
        root: key.replace('GLOBAL:', '')
      }
    }, { path: '' });

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
            if (${isGlobal}) {
              var obj = JSON.parse(P('basglobal', '${root}') || '{}');
              obj${path} = ${value};
              PSet('basglobal', '${root}', JSON.stringify(obj));
            } else {
              GLOBAL['VAR_${root}']${path} = ${value};
            }
          } catch (e) {}
        })()
        section_start('test', -3)!
      `, false);
    });
  }
})(window);