(function (global, $) {
  const trimQuoteRight = (str) => str.replace(/('|")$/g, '');

  const trimQuoteLeft = (str) => str.replace(/^('|")/g, '');

  const clean = (str) => trimQuoteRight(trimQuoteLeft(str));

  global.Scenario.utils = {
    updateVariable: function (pointer, newValue, oldValue, type) {
      let value = clean(newValue);
      let prev = clean(oldValue);
      if (value === prev) return;

      const path = pointer.slice(1).split('/').reduce((path, key, idx) => {
        return path + (idx !== 0 ? (/^\d+$/.test(key) ? `[${key}]` : `['${key}']`) : key);
      }, '');

      if (type === 'number') {
        value = parseFloat(value) || `"${value}"`;
      } else if (type === 'boolean') {
        if (!['false', 'true'].includes(value)) {
          value = `"${value}"`;
        }
      } else if (type === 'date') {
        value = `_parse_date('${value}', 'auto')`;
      } else {
        value = `"${value}"`;
      }

      BrowserAutomationStudio_Execute(`VAR_${path} = ${value};\nsection_start('test', -2)!`, false);
    }
  };
})(window, jQuery);