(function (solver, _) {
  solver.AntiCaptchaApi = _.inherit(solver.CaptchaApi, function (options) {
    solver.CaptchaApi.call(this, 'AntiCaptchaApi', options);
    this.makeRequest = _.bind(makeRequest, this);
  });

  solver.AntiCaptchaApi.prototype.getCreateTaskPayload = function (data) {
    return { method: 'createTask', data: { task: data } };
  };

  solver.AntiCaptchaApi.prototype.getTaskSolutionPayload = function (task) {
    return { method: 'getTaskResult', data: { taskId: task.id } };
  };

  function makeRequest() {
    const method = _function_argument('method') || '';
    const data = _function_argument('data') || {};
    data.clientKey = this.options.apiKey;

    _call_function(this.request, {
      content: 'application/json',
      method: 'POST',
      payload: {
        data: ['data', JSON.stringify(data)],
        url: this.options.apiUrl + '/' + method,
      }
    })!

    const response = _result_function();
    if (response && response.errorId) {
      const description = response.errorDescription;
      const code = response.errorCode;
      fail(code + ':' + description);
    }
    _function_return(response);
  }
})(BASCaptchaSolver, BASCaptchaSolver.utils);