BasDialogsLib.utils = {
  /**
   * Get a collection of recent items for the selected type.
   */
  getRecentCollection: (type, $element) => {
    if (type === 'resource') return BasDialogsLib.store.resources;
    if (type === 'function') return BasDialogsLib.store.functions;

    const useGlobals = $element.attr('disable_globals') !== 'true';
    const useLocals = $element.attr('disable_locals') !== 'true';
    if (useGlobals && useLocals) return BasDialogsLib.store.variables;
    if (useGlobals) return BasDialogsLib.store.globalVariables;
    return BasDialogsLib.store.localVariables;
  },

  /**
   * Get the display name for the selected object using its type.
   * @param {Object} target - selected object.
   * @param {String} type - selected type.
   */
  getDisplayName: (target, type) => {
    if (type === 'resource') return target.name;
    if (type === 'function') return target.name;

    return target.global ? `GLOBAL:${target.name}` : target.name;
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
