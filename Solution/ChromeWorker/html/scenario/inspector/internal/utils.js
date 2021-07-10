(function (global, $, _) {
  global.Scenario.utils = {
    updateVariable(variable, pointer, type) {
      const { root, path, isLocal, isGlobal } = pointer.slice(1).split('/').reduce((data, key, idx) => {
        if (idx === 0) {
          data.isGlobal = key.indexOf('GLOBAL:') === 0;
          data.isLocal = key.indexOf('GLOBAL:') !== 0;
          data.root = key.replace('GLOBAL:', '');
        } else {
          data.path += /^\d+$/.test(key) ? `[${key}]` : `['${key}']`;
        }
        return data;
      }, { path: '', root: '', isLocal: true, isGlobal: false });

      if (type === 'number') {
        const number = parseFloat(variable);
        variable = isNaN(number) ? `"${variable}"` : number;
      } else if (type === 'boolean') {
        if (!['false', 'true'].includes(variable)) {
          variable = `"${variable}"`;
        }
      } else if (type === 'date') {
        variable = `_parse_date('${variable}', 'auto')`;
      } else if (type === 'raw') {
        variable = JSON.stringify(eval(`(${variable})`));
      } else {
        variable = `"${variable}"`;
      }

      BrowserAutomationStudio_Execute(`try {
        if (${isGlobal}) {
          var obj = JSON.parse(P('basglobal', '${root}') || '{}');
          obj${path} = ${variable};
          PSet('basglobal', '${root}', JSON.stringify(obj));
          delete obj;
        } else {
          VAR_${root}${path} = ${variable};
        }
        section_start('test', -2)!
      } catch (e) {}`, false);
    },

    sortByGlobals(target) {
      return target.slice().sort((first, second) => {
        let a = first.toUpperCase();
        let b = second.toUpperCase();

        if (a.startsWith('GLOBAL:') && b.startsWith('GLOBAL:') || !a.includes('GLOBAL:') && !b.includes('GLOBAL:')) {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        } else if (a.startsWith('GLOBAL:') && !b.includes('GLOBAL:')) {
          return -1;
        } else if (!a.includes('GLOBAL:') && b.startsWith('GLOBAL:')) {
          return 1;
        }
      });
    },

    sortByLocals(target) {
      return target.slice().sort((first, second) => {
        let a = first.toUpperCase();
        let b = second.toUpperCase();

        if (a.startsWith('GLOBAL:') && b.startsWith('GLOBAL:') || !a.includes('GLOBAL:') && !b.includes('GLOBAL:')) {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        } else if (!a.includes('GLOBAL:') && b.startsWith('GLOBAL:')) {
          return -1;
        } else if (a.startsWith('GLOBAL:') && !b.includes('GLOBAL:')) {
          return 1;
        }
      });
    },
  };

  _.extend($.fn.selectpicker.Constructor.DEFAULTS, {
    template: { caret: '' },
    container: false,
    header: false,
    width: false,
  });
})(window, jQuery, _);