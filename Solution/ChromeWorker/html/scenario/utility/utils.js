(({ App, Backbone, $, _ }) => {
  const toString = Object.prototype.toString;

  _.extend($.fn.selectpicker.Constructor.DEFAULTS, {
    template: { caret: '' }
  });

  $.fn.slideDownEx = function (...args) {
    return this.each(function () {
      const $el = $(this);
      if (!$el.is(':visible')) $.fn.slideDown.apply($el, args);
    });
  };

  $.fn.slideUpEx = function (...args) {
    return this.each(function () {
      const $el = $(this);
      if (!$el.is(':hidden')) $.fn.slideUp.apply($el, args);
    });
  };

  _.mixin({
    attempt: (func, ...args) => {
      try {
        return func.apply(null, args);
      } catch (e) {
        return _.isError(e) ? e : new Error(e);
      }
    },

    truncate: (str, limit) => {
      return str.length > limit ? (str.slice(0, limit - 3) + '...') : str;
    },

    upperFirst: str => str.charAt(0).toUpperCase() + str.slice(1),

    lowerFirst: str => str.charAt(0).toLowerCase() + str.slice(1),

    isSymbol: obj => toString.call(obj) === '[object Symbol]',

    isError: obj => toString.call(obj) === '[object Error]',

    concat: (arr, ...args) => arr.concat(...args),

    slice: (arr, ...args) => arr.slice(...args),

    sleep: time => new Promise(resolve => {
      setTimeout(resolve, time);
    })
  });
})(window);