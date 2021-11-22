(({ App, $, _ }) => {
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
    isSymbol: val => toString.call(val) === '[object Symbol]',

    isError: val => toString.call(val) === '[object Error]',

    sleep: time => new Promise(fn => setTimeout(fn, time)),

    attempt: (func, ...args) => {
      try {
        return func.apply(null, args);
      } catch (e) {
        return _.isError(e) ? e : new Error(e);
      }
    }
  });
})(window);