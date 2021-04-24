(function (solver, _) {
  solver.RuCaptchaApi = _.inherit(solver.CaptchaApi, function (config) {
    solver.CaptchaApi.call(this, 'RuCaptchaApi', config);
    this.waitSolution = _.bind(waitSolution, this);
    this.makeRequest = _.bind(makeRequest, this);
    this.getBalance = _.bind(getBalance, this);
    this.solveTask = _.bind(solveTask, this);
  });

  function solveTask() {
    const task = _function_argument('task');
    this.validateTask(task.name);
    const data = task.serialize();

    _call_function(this.makeRequest, { method: 'in.php', data: data })!
    sleep(this.pollingDelay)!

    _do_with_params({ taskId: _result_function().request, task: data }, this.waitSolution)!
  }

  function waitSolution() {
    const taskId = _cycle_param('taskId');
    const task = _cycle_param('task');

    _call_function(this.makeRequest, { method: 'res.php', data: { action: 'get', id: taskId } })!
    const response = _result_function();

    if (response.status === 1) {
      _set_result(response.request);
      _break();
    }

    sleep(this.pollingInterval)!
  }

  function getBalance() {
    _call_function(this.makeRequest, { method: 'getBalance' })!
    _function_return(_result_function());
  }

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
  }
})(BASCaptchaSolver, BASCaptchaSolver.utils);