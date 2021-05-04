(function (global) {
  function CaptchaSolver() {
    this.tasks = {};
    this.utils = {};
  };

  CaptchaSolver.prototype.setDebug = function (debug) {
    this.debug = debug;
  };

  CaptchaSolver.prototype.disableDebug = function () {
    this.debug = false;
  };

  CaptchaSolver.prototype.enableDebug = function () {
    this.debug = true;
  };

  CaptchaSolver.prototype.solveFunCaptcha = function () {
    BASCaptchaSolver.api = BASCaptchaSolver.getServiceApi(_function_arguments());
    _call_function(BASCaptchaSolver.ensureSelector, {})!
    BASCaptchaSolver.path().css('*[name="fc-token"]').attr('value')!

    const data = _result().split('|').map(function (el) { return el.split('=') });
    const surl = data.filter(function (el) { return el[0] === 'surl' })[0][1];
    const pk = data.filter(function (el) { return el[0] === 'pk' })[0][1];

    _call_function(BASCaptchaSolver.api.solveTask, {
      taskWaitInterval: _function_argument('taskWaitInterval'),
      taskWaitDelay: _function_argument('taskWaitDelay'),
      task: new BASCaptchaSolver.api.FunCaptchaTask({
        pageUrl: _function_argument('pageUrl'),
        proxy: _function_argument('proxy'),
        subdomainUrl: surl,
        publicKey: pk,
      })
    })!

    _call_function(BASCaptchaSolver.submitFunCaptcha, { token: _result_function() })!
  };

  CaptchaSolver.prototype.ensureSelector = function () {
    _call(BASCaptchaSolver.waiter, null)!
    BASCaptchaSolver.path().exist()!
    if (_result() !== 1) _break();
  };

  CaptchaSolver.prototype.submitFunCaptcha = function () {
    _VERIFICATION_TOKEN = BASCaptchaSolver.path().css('*[name="verification-token"]');
    _VERIFICATION_TOKEN.exist()!
    _if_else(_result() !== 1, function () {
      delete _VERIFICATION_TOKEN;
      fail("Can't find FunCaptcha 'verification-token' input element");
    }, function () {
      _VERIFICATION_TOKEN.script('self.value = ' + JSON.stringify(_function_argument('token')))!
      delete _VERIFICATION_TOKEN;
    })!

    _FC_TOKEN = BASCaptchaSolver.path().css('*[name="fc-token"]');
    _FC_TOKEN.exist()!
    _if_else(_result() !== 1, function () {
      delete _FC_TOKEN;
      fail("Can't find FunCaptcha 'fc-token' input element");
    }, function () {
      _FC_TOKEN.script('self.value = ' + JSON.stringify(_function_argument('token')))!
      delete _FC_TOKEN;
    })!

    page().script("_BAS_HIDE(BrowserAutomationStudio_FunCaptchaSolved)()")!
  };

  global.BASCaptchaSolver = new CaptchaSolver();
})(this);