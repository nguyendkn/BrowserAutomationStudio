(function ({ App, $, _ }) {
  App.utils.filterTasks = function (type) {
    const tasks = _TaskCollection.map((task, index) => ({ ...App.utils.getTaskInfo(task), index }));

    return _.filter(tasks, ({ id, dat, isFold, isSelected }) => {
      if (dat && dat.role && dat.role === 'slave') return false;
      if (id === 0 || IsFunctionNode(id)) return false;
      if (type === 'unselected') return !isSelected;
      if (type === 'selected') return isSelected;
      const { name } = GetFunctionData(id);

      return type === 'current' ? name === _GobalModel.get('function_name') : true;
    });
  };
})(window);