BasDialogsLib.utils = {
  /**
   * Get the display name for the selected object using its type.
   * @param {Object} target - selected object.
   * @param {String} type - selected type.
   */
  getDisplayName: (target, type) => {
    if (type === 'variable') {
      return target.global ? `GLOBAL:${target.name}` : target.name;
    }

    if (type === 'resource') {
      return target.name;
    }

    if (type === 'function') {
      return target.name;
    }

    return null;
  },

  /**
   * Check that selected html element is clickable.
   * @param {HTMLElement} element - html element.
   */
  isClickable: (element) => {
    return _.any([
      element.parentNode.dataset.clickable === 'true',
      element.dataset.clickable === 'true',
    ]);
  },

  /**
   * Show the list item header by toggling CSS classes.
   */
  showHeader: ($header) => {
    $header.addClass('modal-header-visible')
      .removeClass('modal-header-hidden');
  },

  /**
   * Hide the list item header by toggling CSS classes.
   */
  hideHeader: ($header) => {
    $header.addClass('modal-header-hidden')
      .removeClass('modal-header-visible');
  },

  /** 
   * Trim the selected string and convert to lowercase.
   */
  format: (string) => {
    return string.toLowerCase().trim();
  },

  /**
   * Get an array of all possible action objects.
   */
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
};
