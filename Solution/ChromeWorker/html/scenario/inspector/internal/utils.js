(({ App, _ }) => {
  _.extend(App.utils, {
    updateVariable(variable, pointer, type) {
      const { root, path, isLocal, isGlobal } = pointer.slice(1).split('/').reduce((acc, key, idx) => {
        return idx !== 0 ? { ...acc, path: `${acc.path}['${key}']` } : {
          isGlobal: key.indexOf('GLOBAL:') === 0,
          isLocal: key.indexOf('GLOBAL:') !== 0,
          root: key.replace('GLOBAL:', ''),
          path: '',
        }
      }, {});

      _.attempt(() => {
        if (type === 'date') {
          variable = `_parse_date('${variable}', 'auto')`;
        } else if (type === 'custom') {
          variable = JSON.stringify(eval(`(${variable})`));
        } else if (type === 'string') {
          variable = JSON.stringify(variable);
        }

        VariablesNeedRefresh = true; BrowserAutomationStudio_Execute(`
          try {
            if (${isGlobal}) {
              var obj = JSON.parse(P('basglobal', '${root}') || '{}');
              obj${path} = ${variable};
              PSet('basglobal', '${root}', JSON.stringify(obj));
              delete obj;
            } else {
              VAR_${root}${path} = ${variable};
            }
          } catch (e) {}
          section_start('test', -3)!
        `, false);
      });
    }
  });
})(window);