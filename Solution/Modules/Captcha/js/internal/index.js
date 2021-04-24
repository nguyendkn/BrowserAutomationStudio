BASCaptchaSolver = {
  utils: {},

  tasks: {},

  solve: function () {
    _call_function(api.solve, {
      task: _function_argument('task'),
      wait: _function_argument('wait')
    })!
  },

  solveReCaptchaV2: function () {

  },

  solveReCaptchaV3: function () {

  },

  solveFunCaptcha: function () {
    this.api = this.getServiceApi(
      _function_argument('service'),
      _function_argument('apiUrl'),
      _function_argument('apiKey'),
    );
    _call_function(this.ensureSelector, {})!

    get_element_selector(_SELECTOR).css('*[name="fc-token"]').attr('value')!

    const data = _result().split('|').map(function (e) {
      return e.split('=');
    });

    _call_function(this.solve, {
      task: new this.api.FunCaptcha({
        surl: data.filter(function (el) { return el[0] === 'surl'; })[0][1],
        pk: data.filter(function (el) { return el[0] === 'pk'; })[0][1],
        pageUrl: _function_argument('pageUrl')
      }),
      wait: 5000
    })!

    _call_function(BAS_SubmitFunCaptcha, { token: _result_function() })!
  },

  ensureSelector: function () {
    _call(this.waiter, null)!
    this.path().exist()!
    if (_result() !== 1) _break();
  }
}