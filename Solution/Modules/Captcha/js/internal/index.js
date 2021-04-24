(function (global) {
  function CaptchaSolver() {
    this.utils = {};
    this.tasks = {};
  };

  CaptchaSolver.prototype.solveReCaptchaV2 = function () {

  };

  CaptchaSolver.prototype.solveReCaptchaV3 = function () {

  };

  CaptchaSolver.prototype.solveFunCaptcha = function () {
    this.api = this.getServiceApi(_function_arguments());
    _call_function(this.ensureSelector, {})!

    get_element_selector(_SELECTOR).css('*[name="fc-token"]').attr('value')!

    const data = _result().split('|').map(function (e) {
      return e.split('=');
    });

    _call_function(this.api.solve, {
      task: new this.api.FunCaptchaTask({
        surl: data.filter(function (el) { return el[0] === 'surl'; })[0][1],
        pk: data.filter(function (el) { return el[0] === 'pk'; })[0][1],
        pageUrl: _function_argument('pageUrl')
      }),
      wait: 5000
    })!

    _call_function(BAS_SubmitFunCaptcha, { token: _result_function() })!
  };

  CaptchaSolver.prototype.ensureSelector = function () {
    _call(this.waiter, null)!
    this.path().exist()!
    if (_result() !== 1) _break();
  };

  global.BASCaptchaSolver = new CaptchaSolver();
})(this);