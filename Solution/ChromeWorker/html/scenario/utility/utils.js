(({ App, Backbone, $, _ }) => {
  const toString = Object.prototype.toString.call;

  App.utils = {
    getTaskInfo(task) {
      if (!(task instanceof Backbone.Model)) return {};
      const dat = _.attempt(() => task.dat());
      const isDamaged = _.isError(dat);
      const isEmpty = _.isNull(dat);

      return {
        isSelected: task.get('is_selected'),
        dat: isDamaged ? null : dat,
        id: Number(task.get('id')),
        isDatDamaged: isDamaged,
        isDatEmpty: isEmpty,
      };
    },
  };

  _.extend($.fn.selectpicker.Constructor.DEFAULTS, {
    template: { caret: '' },
    container: false,
    header: false,
    width: false,
  });

  _.mixin({
    attempt: (func, ...args) => {
      try {
        return func(...args);
      } catch (e) {
        return _.isError(e) ? e : new Error(e);
      }
    },

    truncate: (str, limit) => {
      return str.length > limit ? (str.slice(0, limit - 3) + '...') : str;
    },

    upperFirst: str => str.charAt(0).toUpperCase() + str.slice(1),

    lowerFirst: str => str.charAt(0).toLowerCase() + str.slice(1),

    isString: obj => toString(obj) === '[object String]',

    isError: obj => toString(obj) === '[object Error]',

    concat: (arr, ...args) => arr.concat(...args),

    slice: (arr, ...args) => arr.slice(...args),

    sleep: time => new Promise(resolve => {
      setTimeout(resolve, time);
    })
  });
})(window);