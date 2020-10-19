window.BasDialogsLib = {
  getActions: () => {
    return Object.entries(_A).map(([name, action]) => {
      const popup = (!action.group && action.class && action.class === 'browser');

      try {
        const html = $(`#${name}`).html(), list = _([...html.split(/<%=(.*?)%>/gs)
          .filter((src) => !src.includes('#path'))
          .filter((src) => !src.includes('#back'))
          .map((src) => {
            return [...src.matchAll(/html\(\)\)\((.*)\)/gs)]
              .filter((match) => match[1].length)
              .map((match) => {
                const function_params = {}, model = {}, t = {}, c = {}, data = eval(`(${match[1]})`);

                if (!data.default_selector) {
                  if (data.default_variable && data.default_variable.length) {
                    return data.default_variable;
                  }

                  return '';
                }

                return '';
              });
          })])
          .flatten()
          .compact()
          .uniq()
          .run();

        return { description: tr(action.name), ref: name, popup, variables: list };
      } catch (e) {
        return { description: tr(action.name), ref: name, popup, variables: [] };
      }
    });
  },

  templates: {},

  options: {},

  store: {},

  utils: {},
}