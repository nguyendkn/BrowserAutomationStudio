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
        if (idx !== 0) data.path += /^\d+$/.test(key) ? `[${key}]` : `['${key}']`;
        data.root = key.replace('GLOBAL:', '');
        data.isGlobal = key.includes('GLOBAL');
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
        const code = [
          `var obj = JSON.parse(P('basglobal', '${root}') || '{}');`,
          `obj${path} = ${variable}`,
          `PSet('basglobal', '${root}', JSON.stringify(obj));`,
          `delete obj;`,
          `section_start('test', -2)!`,
        ].join('\n');
        console.log(code);
        BrowserAutomationStudio_Execute(code, false);
      } else {
        BrowserAutomationStudio_Execute(`VAR_${root}${path} = ${variable};\nsection_start('test', -2)!`, false);
      }
    }
  };
})(window, jQuery);