(function (global) {
  function CaptchaSolver() {
    this.tasks = {};

    this.solveFunCaptcha = function () {
      BASCaptchaSolver.api = BASCaptchaSolver.getServiceApi(_function_arguments());
      _call_function(BASCaptchaSolver.ensureSelector, {})!
      BASCaptchaSolver.path().css('*[name="fc-token"]').attr('value')!

      const data = _result().split('|').map(function (e) {
        return e.split('=');
      });

      const surl = data.filter(function (el) {
        return el[0] === 'surl'
      })[0][1];

      const pk = data.filter(function (el) {
        return el[0] === 'pk'
      })[0][1];

      _call_function(BASCaptchaSolver.api.solveTask, {
        task: new BASCaptchaSolver.api.FunCaptchaTask({
          pageurl: _function_argument('pageUrl'),
          surl: surl,
          pk: pk,
        })
      })!

      _call_function(submitFunCaptcha, { token: _result_function() })!
    };

    this.ensureSelector = function () {
      _call(BASCaptchaSolver.waiter, null)!
      BASCaptchaSolver.path().exist()!
      if (_result() !== 1) {
        _break();
      }
    };
  };

  function submitFunCaptcha() {
    const script = 'self.value = ' + JSON.stringify(_function_argument('token'));
    get_element_selector(_SELECTOR).css('*[name="verification-token"]').script(script)!
    get_element_selector(_SELECTOR).css('*[name="fc-token"]').script(script)!
    page().script("_BAS_HIDE(BrowserAutomationStudio_FunCaptchaSolved)()")!
  }

  global.BASCaptchaSolver = new CaptchaSolver();
})(this);