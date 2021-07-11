(function (global, $, _) {
  global.Scenario.utils = {
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

      if (type === 'date') {
        variable = `_parse_date('${variable}', 'auto')`;
      } else if (type === 'raw') {
        variable = JSON.stringify(eval(`(${variable})`));
      } else if (type === 'string') {
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
      return target.slice().sort((a, b) => {
        a = a.toUpperCase();
        b = b.toUpperCase();

        if (a.startsWith('GLOBAL:') && !b.includes('GLOBAL:')) {
          return -1;
        }
        if (!a.includes('GLOBAL:') && b.startsWith('GLOBAL:')) {
          return 1;
        }
        return a.localeCompare(b);
      });
    },

    sortByLocals(target) {
      return target.slice().sort((a, b) => {
        a = a.toUpperCase();
        b = b.toUpperCase();

        if (!a.includes('GLOBAL:') && b.startsWith('GLOBAL:')) {
          return -1;
        }
        if (a.startsWith('GLOBAL:') && !b.includes('GLOBAL:')) {
          return 1;
        }
        return a.localeCompare(b);
      });
    },

    convert(value, type, old) {
      const str = value.toString();

      if (type === 'number') {
        if (str === 'false') return 0;
        if (str === 'true') return 1;
        const number = parseFloat(str);
        return isNaN(number) ? 0 : number;
      } else if (type === 'boolean') {
        if (str === 'false') return str;
        if (str === 'true') return str;
        return 'false';
      } else if (type === 'raw') {
        if (old === 'string') {
          return JSON.stringify(str);
        }
      }

      return value;
    }
  };

  _.extend($.fn.selectpicker.Constructor.DEFAULTS, {
    template: { caret: '' },
    container: false,
    header: false,
    width: false,
  });
})(window, jQuery, _);