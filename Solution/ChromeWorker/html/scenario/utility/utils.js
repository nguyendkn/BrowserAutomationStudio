(({ App, Backbone, $, _ }) => {
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
    attempt: function (func, ...args) {
      try {
        return func(...args);
      } catch (e) {
        return _.isError(e) ? e : new Error(e);
      }
    },

    truncate: function (str, limit) {
      return str.length > limit ? (str.slice(0, limit - 3) + '...') : str;
    },

    concat: function (arr, ...args) {
      return arr.concat(...args);
    },

    slice: function (arr, ...args) {
      return arr.slice(...args);
    },

    upperFirst: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    },

    lowerFirst: function (str) {
      return str.charAt(0).toLowerCase() + str.slice(1);
    },

    isString: function (obj) {
      return Object.prototype.toString.call(obj) === '[object String]';
    },

    isError: function (obj) {
      return Object.prototype.toString.call(obj) === '[object Error]';
    },

    sleep: function (time) {
      return new Promise(resolve => {
        setTimeout(() => resolve(), time);
      });
    }
  });
})(window);