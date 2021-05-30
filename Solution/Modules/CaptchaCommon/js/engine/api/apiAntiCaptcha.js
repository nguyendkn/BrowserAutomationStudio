(function (solver, _) {
  solver.AntiCaptchaApi = _.inherit(solver.CaptchaApi, function (options) {
    solver.CaptchaApi.call(this, 'AntiCaptcha', options);
  });

  solver.AntiCaptchaApi.prototype.getCreateTaskPayload = function (data) {
    return { method: 'createTask', data: { task: data } };
  };

  solver.AntiCaptchaApi.prototype.getTaskSolutionPayload = function (task) {
    return { method: 'getTaskResult', data: { taskId: task.id } };
  };

  solver.AntiCaptchaApi.prototype.setDefaultRequestParams = function (data) {
    data.clientKey = this.options.apiKey;
    data.json = 1;
  };

  solver.AntiCaptchaApi.prototype.getDefaultRequestOptions = function (data, method) {
    return {
      payload: { data: ['data', JSON.stringify(data)], query: method },
      content: 'application/json',
      method: 'POST',
    };
  };
})(BASCaptchaSolver, BASCaptchaSolver.utils);