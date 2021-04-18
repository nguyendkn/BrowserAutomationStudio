(function (global) {
  global.Scenario.filterTasks = function (type) {
    const tasks = _TaskCollection.map((task, index) => {
      let dat = _.attempt(() => task.dat());
      const isDamaged = _.isError(dat);
      const isEmpty = _.isNull(dat);

      return {
        isSelected: task.get('is_selected'),
        dat: isDamaged ? null : dat,
        id: Number(task.get('id')),
        isDatDamaged: isDamaged,
        isDatEmpty: isEmpty,
        index
      };
    });

    return _.filter(tasks, ({ id, dat, isFold, isSelected }) => {
      if (dat && dat.role && dat.role === 'slave') return false;
      if (id === 0 || IsFunctionNode(id)) return false;
      if (type === 'unselected') return !isSelected;
      if (type === 'selected') return isSelected;
      const { name } = GetFunctionData(id);

      return type === 'current' ? name === _GobalModel.get('function_name') : true;
    });
  };

  _.mixin({
    attempt: function (func, ...args) {
      try {
        return func(...args);
      } catch (e) {
        return isError(e) ? e : new Error(e);
      }
    },

    gt: function (value, other) {
      if (!(typeof value === 'string' && typeof other === 'string')) {
        value = +value;
        other = +other;
      }
      return value > other;
    },

    lt: function (value, other) {
      if (!(typeof value === 'string' && typeof other === 'string')) {
        value = +value;
        other = +other;
      }
      return value < other;
    }
  });
})(window);