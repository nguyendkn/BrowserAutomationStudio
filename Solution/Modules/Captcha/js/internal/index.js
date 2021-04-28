(function (global) {
  function CaptchaSolver() {
    this.tasks = {};
    this.utils = {};
  }

  CaptchaSolver.prototype.solveFunCaptcha = function () {
    BASCaptchaSolver.utils.enableDebug();
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

    _call_function(BASCaptchaSolver.submitFunCaptcha, { token: _result_function() })!
  };

  CaptchaSolver.prototype.ensureSelector = function () {
    _call(BASCaptchaSolver.waiter, null)!
    BASCaptchaSolver.path().exist()!
    if (_result() !== 1) {
      _break();
    }
  };

  CaptchaSolver.prototype.submitFunCaptcha = function () {
    CAPTCHA_TOKEN_SCRIPT = 'self.value = ' + JSON.stringify(_function_argument('token'));
    BASCaptchaSolver.path().css('*[name="verification-token"]').script(CAPTCHA_TOKEN_SCRIPT)!
    BASCaptchaSolver.path().css('*[name="fc-token"]').script(CAPTCHA_TOKEN_SCRIPT)!
    page().script("_BAS_HIDE(BrowserAutomationStudio_FunCaptchaSolved)()")!
    delete CAPTCHA_TOKEN_SCRIPT;
  };

  global.BASCaptchaSolver = new CaptchaSolver();
})(this);