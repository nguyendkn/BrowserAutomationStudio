(function (global) {
  function CaptchaSolver() {
    const self = this;
    self.utils = {};
    self.tasks = {};

    self.solveReCaptchaV2 = function () {

    };

    self.solveReCaptchaV3 = function () {

    };

    self.solveFunCaptcha = function () {
      self.api = self.getServiceApi(_function_arguments());
      _call_function(self.ensureSelector, {})!
      self.path().css('*[name="fc-token"]').attr('value')!

      const data = _result().split('|').map(function (e) {
        return e.split('=');
      });

      _call_function(self.api.solve, {
        task: new self.api.FunCaptchaTask({
          surl: data.filter(function (el) { return el[0] === 'surl'; })[0][1],
          pk: data.filter(function (el) { return el[0] === 'pk'; })[0][1],
          pageUrl: _function_argument('pageUrl')
        })
      })!

      _call_function(submitFunCaptcha, { token: _result_function() })!
    };

    self.ensureSelector = function () {
      _call(self.waiter, null)!
      self.path().exist()!
      if (_result() !== 1) _break();
    };
  };

  function submitRecaptchaV2() {

  }

  function submitRecaptchaV3() {

  }

  function submitFunCaptcha() {
    const script = 'self.value = ' + JSON.stringify(_function_argument('token'));
    get_element_selector(_SELECTOR).css('*[name="verification-token"]').script(script)!
    get_element_selector(_SELECTOR).css('*[name="fc-token"]').script(script)!
    page().script("_BAS_HIDE(BrowserAutomationStudio_FunCaptchaSolved)()")!
  }

  global.BASCaptchaSolver = new CaptchaSolver();
})(this);