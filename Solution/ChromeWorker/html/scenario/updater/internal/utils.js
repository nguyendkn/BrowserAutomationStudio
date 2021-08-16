(function ({ Scenario }, $) {
  Scenario.filterTasks = function (type) {
    const tasks = _TaskCollection.map((task, index) => ({ ...Scenario.utils.getTaskInfo(task), index }));

    return _.filter(tasks, ({ id, dat, isFold, isSelected }) => {
      if (dat && dat.role && dat.role === 'slave') return false;
      if (id === 0 || IsFunctionNode(id)) return false;
      if (type === 'unselected') return !isSelected;
      if (type === 'selected') return isSelected;
      const { name } = GetFunctionData(id);

      return type === 'current' ? name === _GobalModel.get('function_name') : true;
    });
  };

  $.fn.slideDownEx = function () {
    const args = Array.prototype.slice.call(arguments, 0);
    return this.each(function () {
      if (!$(this).is(':visible')) {
        $.fn.slideDown.apply($(this), args);
      }
    });
  };

  $.fn.slideUpEx = function () {
    const args = Array.prototype.slice.call(arguments, 0);
    return this.each(function () {
      if (!$(this).is(':hidden')) {
        $.fn.slideDown.apply($(this), args);
      }
    });
  };

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

    isString: function (obj) {
      return Object.prototype.toString.call(obj) === '[object String]';
    },

    isError: function (obj) {
      return Object.prototype.toString.call(obj) === '[object Error]';
    },

    sleep: function (time) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), time);
      });
    }
  });
})(window, jQuery);