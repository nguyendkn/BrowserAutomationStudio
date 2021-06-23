(function (global, $) {
  global.Scenario.utils = {
    updateVariable: function (path, type, value) {
      const obj = path.slice(1).split('/').reduce((acc, val, idx) => {
        if (idx === 0) return acc + val;
        return acc + (/^\d+$/.test(val) ? `[${val}]` : `["${val}"]`);
      }, 'VAR_');

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
      console.log(`${obj} = ${value};`);
      BrowserAutomationStudio_Execute(`${obj} = ${value};\nsection_start('test', -2)!`, false);
    }
  };
})(window, jQuery);