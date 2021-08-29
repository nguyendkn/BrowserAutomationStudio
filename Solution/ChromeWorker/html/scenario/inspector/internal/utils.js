(({ App, $, _ }) => {
  _.extend(App.utils, {
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

      _.attempt(() => {
        if (type === 'date') {
          variable = `_parse_date('${variable}', 'auto')`;
        } else if (type === 'custom') {
          variable = JSON.stringify(eval(`(${variable})`));
        } else if (type === 'string') {
          variable = JSON.stringify(variable);
        }

        VariablesNeedRefresh = true; BrowserAutomationStudio_Execute(`try {
          if (${isGlobal}) {
            var obj = JSON.parse(P('basglobal', '${root}') || '{}');
            obj${path} = ${variable};
            PSet('basglobal', '${root}', JSON.stringify(obj));
            delete obj;
          } else {
            VAR_${root}${path} = ${variable};
          }
          section_start('test', -3)!
        } catch (e) {}`, false);
      });
    },

    morph(from, to, options) {
      return morphdom(from, to, {
        onBeforeElUpdated: (from, to) => {
          return !from.isEqualNode(to);
        },
        childrenOnly: true,
        ...options
      });
    }
  });
})(window);