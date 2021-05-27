(function (global) {
  function CaptchaSolver() {
    this.tasks = {};
    this.utils = {};
  };

  CaptchaSolver.prototype.setQuery = function (value) {
    this.query = value;
  };

  CaptchaSolver.prototype.setDebug = function (value) {
    this.debug = value;
  };

  CaptchaSolver.prototype.$element = function () {
    return get_element_selector(this.query, false);
  };

  CaptchaSolver.prototype.solveFunCaptcha = function () {
    _call_function(BASCaptchaSolver.findFunCaptchaContainer, {})!
    BASCaptchaSolver.api = BASCaptchaSolver.getServiceApi(_function_arguments());
    BASCaptchaSolver.$element().xpath('//input[@name="fc-token"]').attr('value')!

    const data = _result().split('|').map(function (el) { return el.split('=') });
    const surl = data.filter(function (el) { return el[0] === 'surl' })[0][1];
    const pk = data.filter(function (el) { return el[0] === 'pk' })[0][1];
    BASCaptchaSolver.$element().script('location.href')!
    _function_arguments()['pageUrl'] = _result();

    _call_function(BASCaptchaSolver.api.solveTask, {
      taskWaitInterval: _function_argument('taskWaitInterval'),
      taskWaitDelay: _function_argument('taskWaitDelay'),
      task: new BASCaptchaSolver.api.FunCaptchaTask({
        userAgent: _function_argument('userAgent'),
        pageUrl: _function_argument('pageUrl'),
        proxy: _function_argument('proxy'),
        subdomainUrl: surl,
        publicKey: pk,
      })
    })!

    _call_function(BASCaptchaSolver.submitFunCaptcha, { token: _result_function() })!
  };

  CaptchaSolver.prototype.ensureSelector = function () {
    wait_element(BASCaptchaSolver.query)!
    BASCaptchaSolver.$element().exist()!
    if (_result() !== 1) _break();
  };

  CaptchaSolver.prototype.submitFunCaptcha = function () {
    _VERIFICATION_TOKEN = BASCaptchaSolver.$element().xpath('//input[@name="verification-token"]');
    _VERIFICATION_TOKEN.exist()!
    _if_else(_result() === 1, function () {
      _VERIFICATION_TOKEN.script('self.value = ' + JSON.stringify(_function_argument('token')))!
      delete _VERIFICATION_TOKEN;
    }, function () {
      delete _VERIFICATION_TOKEN;
      fail("Can't find FunCaptcha 'verification-token' input element");
    })!

    _FC_TOKEN = BASCaptchaSolver.$element().xpath('//input[@name="fc-token"]');
    _FC_TOKEN.exist()!
    _if_else(_result() === 1, function () {
      _FC_TOKEN.script('self.value = ' + JSON.stringify(_function_argument('token')))!
      delete _FC_TOKEN;
    }, function () {
      delete _FC_TOKEN;
      fail("Can't find FunCaptcha 'fc-token' input element");
    })!

    page().script('_BAS_HIDE(BrowserAutomationStudio_FunCaptchaSolved)()')!
  };

  CaptchaSolver.prototype.findFunCaptchaContainer = function () {
    _call_function(BASCaptchaSolver.ensureSelector, {})!
    var target = BASCaptchaSolver.query.toString();

    _do(function () {
      const index = target.lastIndexOf('>FRAME>');
      target = index < 0 ? target : target.slice(0, index);

      get_element_selector(target, false).css('#fc-iframe-wrap').exist(function () {
        if (_iterator() === 2) _break();
        if (_result() === 1) _break();
      });
    })!

    BASCaptchaSolver.query = target;
  };

  global.BASCaptchaSolver = new CaptchaSolver();
})(this);