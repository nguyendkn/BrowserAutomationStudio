(function (solver, _) {
  solver.RuCaptchaApi = _.inherit(solver.CaptchaApi, function (config) {
    solver.CaptchaApi.call(this, 'RuCaptchaApi', config);
    this.makeRequest = _.bind(makeRequest, this);
    this.solveTask = _.bind(solveTask, this);
  });

  function solveTask() {
    const task = _function_argument('task');
    const data = this.validateTask(task).serialize();

    _call_function(this.makeRequest, { method: 'in.php', data: data })!
    sleep(this.taskWaitDelay)!

    _do_with_params({ taskId: _result_function().request, task: data, self: this }, function () {
      const taskId = _cycle_param('taskId');
      const task = _cycle_param('task');
      const self = _cycle_param('self');

      _call_function(self.makeRequest, { method: 'res.php', data: { action: 'get', id: taskId } })!
      const response = _result_function();

      if (response.status === 1) {
        _set_result(task.getSolution(response));
        _break();
      }
      sleep(self.taskWaitInterval)!
    })!
  }

  function makeRequest() {
    const method = _function_argument('method') || '';
    const data = _function_argument('data') || {};
    data.key = this.apiKey;
    data.json = 1;

    _call_function(this.request, {
      content: 'urlencode',
      method: 'POST',
      payload: {
        url: this.apiUrl + '/' + method + '?' + _.urlEncode(data),
        data: [],
      }
    })!

    const response = _.json(_result_function());
    _function_return(response);
  }
})(BASCaptchaSolver, BASCaptchaSolver.utils);