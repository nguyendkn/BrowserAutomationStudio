(function (solver, _) {
  solver.AntiCaptchaApi = _.inherit(solver.CaptchaApi, function (config) {
    solver.CaptchaApi.call(this, 'AntiCaptchaApi', config);
    this.makeRequest = _.bind(makeRequest, this);
    this.getBalance = _.bind(getBalance, this);
    this.solveTask = _.bind(solveTask, this);
  });

  function solveTask() {
    const wait = _function_argument('wait');
    const task = _function_argument('task');
    this.validateTask(task.name);
    const data = task.serialize();

    _call_function(this.makeRequest, { method: 'createTask', data: data })!

    _do_with_params({ taskId: _result_function().taskId, task: data, wait: wait }, function () {
      const taskId = _cycle_param('taskId');
      const task = _cycle_param('task');
      const wait = _cycle_param('wait');

      _call_function(this.makeRequest, { method: 'getTaskResult', data: { taskId: taskId } })!
      const response = _result_function();

      if (response.status === 'ready') {
        _set_result(response.solution[task.response]);
        _break();
      }

      sleep(wait)!
    })!
  };

  function getBalance() {
    _call_function(this.makeRequest, { method: 'getBalance' })!
    _function_return(_result_function());
  };

  function makeRequest() {
    const method = _function_argument('method') || '';
    const data = _function_argument('data') || {};
    data.clientKey = this.apiKey;

    _call_function(_.request, {
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
  };
})(BASCaptchaSolver, BASCaptchaSolver.utils);