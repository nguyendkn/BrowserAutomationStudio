(function (solver, _) {
  solver.AntiCaptchaApi = _.inherit(solver.CaptchaApi, function (config) {
    solver.CaptchaApi.call(this, 'AntiCaptchaApi', config);
    this.makeRequest = _.bind(makeRequest, this);
    this.solveTask = _.bind(solveTask, this);
  });

  function solveTask() {
    const task = _function_argument('task');
    const data = this.validateTask(task).serialize();

    _call_function(this.makeRequest, { method: 'createTask', data: { task: data } })!
    sleep(this.taskWaitDelay)!

    _do_with_params({ taskId: _result_function().taskId, task: data, self: this }, function () {
      const taskId = _cycle_param('taskId');
      const task = _cycle_param('task');
      const self = _cycle_param('self');

      _call_function(self.makeRequest, { method: 'getTaskResult', data: { taskId: taskId } })!
      const response = _result_function();

      if (response.status === 'ready') {
        _set_result(task.getSolution(response));
        _break();
      }
      sleep(self.taskWaitInterval)!
    })!
  }

  function makeRequest() {
    const method = _function_argument('method') || '';
    const data = _function_argument('data') || {};
    data.clientKey = this.apiKey;

    _call_function(this.request, {
      content: 'application/json',
      method: 'POST',
      payload: {
        data: ['data', JSON.stringify(data)],
        url: this.apiUrl + '/' + method,
      }
    })!

    const response = _.json(_result_function());
    if (response && response.errorId) {
      const description = response.errorDescription;
      const code = response.errorCode;
      fail(code + ':' + description);
    }
    _function_return(response);
  }
})(BASCaptchaSolver, BASCaptchaSolver.utils);