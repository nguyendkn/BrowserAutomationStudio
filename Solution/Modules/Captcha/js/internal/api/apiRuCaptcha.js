(function (solver, _) {
  solver.RuCaptchaApi = _.inherit(solver.CaptchaApi, function (config) {
    solver.CaptchaApi.call(this, 'RuCaptchaApi', config);
    this.makeRequest = _.bind(makeRequest, this);
    this.getBalance = _.bind(getBalance, this);
    this.solveTask = _.bind(solveTask, this);
  });

  function solveTask() {
    const wait = _function_argument('wait');
    const task = _function_argument('task');
    this.validateTask(task.name);

    _call_function(api.request, { method: 'in.php', data: task })!

    _do_with_params({ taskId: api.response.request, task: task, wait: wait }, function () {
      const taskId = _cycle_param('taskId');
      const task = _cycle_param('task');
      const wait = _cycle_param('wait');

      _call_function(this.makeRequest, { method: 'res.php', data: { action: 'get', id: taskId } })!

      if (api.response.status === 1) {
        _set_result(api.response.request);
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
    data.key = this.apiKey;
    data.json = 1;

    _call_function(_.request, {
      content: 'urlencode',
      method: 'POST',
      payload: {
        url: this.apiUrl + '/' + method + '?' + _.urlEncode(data),
        data: [],
      }
    })!

    _function_return(JSON.parse(_result_function()));
  };
})(BASCaptchaSolver, BASCaptchaSolver.utils);