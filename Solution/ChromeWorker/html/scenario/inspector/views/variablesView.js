(({ App, _ }) => {
  const { Inspector, JST } = App;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  Inspector.VariablesView = ScriptDataView.extend({
    template: JST['inspector/variables'],

    initialize: function () {
      this.model = new ScriptDataModel();
      ScriptDataView.prototype.initialize.call(this, {
        allowHighlight: true,
        allowModify: true
      });
    },

    openModal: function (e) {
      e.stopPropagation();
      const { path, type } = e.target.closest('li').dataset;

      const modal = new Inspector.Modal({
        callback({ value, cancel, type }) {
          if (!cancel) updateVariable(value, path, type);
        },
        value: this.viewer.model.getValue(path),
        type,
        path,
      });

      modal.render();
    },

    events: {
      ...ScriptDataView.prototype.events,

      'dblclick .jst-root > li > ul > li > .jst-node': 'openModal',

      'dblclick .jst-root > li > ul > li > .jst-list': 'openModal',

      'keydown .inspector-filter-input': function (e) {
        if (e.key === ' ') e.preventDefault();
      }
    }
  });

  function updateVariable(variable, pointer, type) {
    const { root, path, isLocal, isGlobal } = pointer.slice(1).split('/').reduce((acc, key, idx) => {
      return idx !== 0 ? { ...acc, path: `${acc.path}['${key}']` } : {
        isGlobal: key.indexOf('GLOBAL:') === 0,
        isLocal: key.indexOf('GLOBAL:') !== 0,
        root: key.replace('GLOBAL:', ''),
        path: '',
      }
    }, {});

    _.attempt(() => {
      if (type === 'date') {
        variable = `_parse_date('${variable}', 'auto')`;
      } else if (type === 'custom') {
        variable = JSON.stringify(eval(`(${variable})`));
      } else if (type === 'string') {
        variable = JSON.stringify(variable);
      }

      VariablesNeedRefresh = true; BrowserAutomationStudio_Execute(`
        (function () {
          try {
            if (${isGlobal}) {
              var obj = JSON.parse(P('basglobal', '${root}') || '{}');
              obj${path} = ${variable};
              PSet('basglobal', '${root}', JSON.stringify(obj));
            } else {
              GLOBAL["VAR_${root}"]${path} = ${variable}
            }
          } catch (e) {}
        })()
        section_start('test', -3)!
      `, false);
    });
  }
})(window);