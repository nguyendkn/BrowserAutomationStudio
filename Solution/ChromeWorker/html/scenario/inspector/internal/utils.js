(function (global, $) {
  global.Scenario.utils = {
    updateVariable: function (pointer, value, type) {
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
        value = `new Date("${value}")`;
      } else {
        value = `"${value}"`;
      }

      BrowserAutomationStudio_Execute(`VAR_${path} = ${value};\nsection_start('test', -2)!`, false);
    }
  };
})(window, jQuery);