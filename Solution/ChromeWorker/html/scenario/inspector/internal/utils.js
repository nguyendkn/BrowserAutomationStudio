(function (global, $) {
  global.Scenario.utils = {
    updateVariable: function (pointer, value, type) {
      const path = pointer.slice(1).split('/').reduce((acc, val, idx) => {
        if (idx === 0) return acc + val;
        return acc + (/^\d+$/.test(val) ? `[${val}]` : `["${val}"]`);
      }, '');

      if (type === 'number') {
        const number = parseFloat(value);
        value = isNaN(number) ? `"${value}"` : number;
      } else if (type === 'dateObject') {
        value = `new Date("${value}")`;
      } else if (type === 'boolean') {
        if (!['false', 'true'].includes(value)) {
          value = `"${value}"`;
        }
      } else {
        value = `"${value}"`;
      }

      BrowserAutomationStudio_Execute(`VAR_${path} = ${value};\nsection_start('test', -2)!`, false);
    }
  };
})(window, jQuery);