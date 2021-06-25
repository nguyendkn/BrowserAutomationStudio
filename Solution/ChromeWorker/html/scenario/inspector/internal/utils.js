(function (global, $) {
  const trimQuoteRight = (str) => str.replace(/('|")$/g, '');

  const trimQuoteLeft = (str) => str.replace(/^('|")/g, '');

  const clean = (str) => trimQuoteRight(trimQuoteLeft(str));

  global.Scenario.utils = {
    updateVariable: function (newValue, oldValue, pointer, type) {
      let variable = clean(newValue);
      let previous = clean(oldValue);
      if (variable === previous) return;

      const path = pointer.slice(1).split('/').reduce((path, key, idx) => {
        return path + (idx !== 0 ? (/^\d+$/.test(key) ? `[${key}]` : `['${key}']`) : key);
      }, '');

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

      BrowserAutomationStudio_Execute(`VAR_${path} = ${variable};\nsection_start('test', -2)!`, false);
    }
  };
})(window, jQuery);