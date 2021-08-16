(({ Scenario }, $, _) => {
  _.extend(Scenario.utils, {
    updateVariable(variable, pointer, type) {
      const { root, path, isLocal, isGlobal } = pointer.slice(1).split('/').reduce((data, key, idx) => {
        if (idx === 0) {
          data.isGlobal = key.indexOf('GLOBAL:') === 0;
          data.isLocal = key.indexOf('GLOBAL:') !== 0;
          data.root = key.replace('GLOBAL:', '');
        } else {
          data.path += `['${key}']`;
        }
        return data;
      }, { path: '', root: '', isLocal: true, isGlobal: false });

      _.attempt(() => {
        if (type === 'date') {
          variable = `_parse_date('${variable}', 'auto')`;
        } else if (type === 'custom') {
          variable = JSON.stringify(eval(`(${variable})`));
        } else if (type === 'string') {
          variable = JSON.stringify(variable);
        }

        VariablesNeedRefresh = true;
        BrowserAutomationStudio_Execute(`try {
          if (${isGlobal}) {
            var obj = JSON.parse(P('basglobal', '${root}') || '{}');
            obj${path} = ${variable};
            PSet('basglobal', '${root}', JSON.stringify(obj));
            delete obj;
          } else {
            VAR_${root}${path} = ${variable};
          }
          section_start('test', -3)!
        } catch (e) {}`, false);
      });
    },

    sortByGlobals(src, compareFn) {
      const isGlobal = v => v.toUpperCase().startsWith('GLOBAL:');
      return _.keys(src).sort((a, b) => (isGlobal(b) - isGlobal(a)) || compareFn(a, b));
    },

    sortByLocals(src, compareFn) {
      const isGlobal = v => v.toUpperCase().startsWith('GLOBAL:');
      return _.keys(src).sort((a, b) => (isGlobal(a) - isGlobal(b)) || compareFn(a, b));
    },

    scaleColors(colors, count) {
      const scale = _.compose(color2K.toHex, color2K.getScale(...colors));
      return [...Array(count).keys()].map(n => scale(n / (count - 1)));
    },
  });

  _.extend($.fn.selectpicker.Constructor.DEFAULTS, {
    template: { caret: '' },
    container: false,
    header: false,
    width: false,
  });
})(window, jQuery, _);