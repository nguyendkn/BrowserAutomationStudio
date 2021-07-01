(function (global, $) {
  const trimQuoteRight = (str) => str.replace(/('|")$/g, '');

  const trimQuoteLeft = (str) => str.replace(/^('|")/g, '');

  const clean = (str) => trimQuoteRight(trimQuoteLeft(str));

  global.Scenario.utils = {
    updateVariable(newValue, oldValue, pointer, type) {
      let variable = clean(newValue);
      let previous = clean(oldValue);
      if (variable === previous) return;

      const { root, path, isGlobal } = pointer.slice(1).split('/').reduce((data, key, idx) => {
        if (idx === 0) {
          data.root = key.replace('GLOBAL:', '');
          data.isGlobal = key.includes('GLOBAL');
        } else {
          data.path += /^\d+$/.test(key) ? `[${key}]` : `['${key}']`;
        }
        return data;
      }, { path: '', root: '', isGlobal: false });

      if (type === 'number') {
        variable = parseFloat(variable) || `"${variable}"`;
      } else if (type === 'boolean') {
        if (!['false', 'true'].includes(variable)) {
          variable = `"${variable}"`;
        }
      } else if (type === 'date') {
        variable = `_parse_date('${variable}', 'auto')`;
      } else {
        variable = `"${variable}"`;
      }

      if (isGlobal) {
        const code = `try {
          var obj = JSON.parse(P('basglobal', '${root}') || '{}');
          obj${path} = ${variable}
          PSet('basglobal', '${root}', JSON.stringify(obj));
          delete obj;
          section_start('test', -2)!
        } catch (e) {}`
        BrowserAutomationStudio_Execute(code, false);
      } else {
        const code = `try {
          VAR_${root}${path} = ${variable};
          section_start('test', -2)!
        } catch (e) {}`
        BrowserAutomationStudio_Execute(code, false);
      }
    },

    sortBy: {
      globalsFirst: (a, b) => {
        a = a.toUpperCase();
        b = b.toUpperCase();

        if (a.startsWith('GLOBAL:') && b.startsWith('GLOBAL:') || !a.includes('GLOBAL:') && !b.includes('GLOBAL:')) {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        } else if (a.startsWith('GLOBAL:') && !b.includes('GLOBAL:')) {
          return -1;
        } else if (!a.includes('GLOBAL:') && b.startsWith('GLOBAL:')) {
          return 1;
        }
      },

      globalsLast: (a, b) => {
        a = a.toUpperCase();
        b = b.toUpperCase();

        if (a.startsWith('GLOBAL:') && b.startsWith('GLOBAL:') || !a.includes('GLOBAL:') && !b.includes('GLOBAL:')) {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        } else if (!a.includes('GLOBAL:') && b.startsWith('GLOBAL:')) {
          return -1;
        } else if (a.startsWith('GLOBAL:') && !b.includes('GLOBAL:')) {
          return 1;
        }
      },
    }
  };
})(window, jQuery);