(function (global) {
  function CaptchaSolver() {
    this.helpers = {};
    this.tasks = {};
    this.utils = {};
  };

  CaptchaSolver.prototype.setHelper = function (value) {
    this.helper = value;
  };

  CaptchaSolver.prototype.setDebug = function (value) {
    this.debug = value;
  };

  CaptchaSolver.prototype.solveFunCaptcha = function () {
    BASCaptchaSolver.setHelper(new BASCaptchaSolver.helpers.FunCaptchaHelper());
    _call_function(BASCaptchaSolver.helper.initialize, _function_arguments())!
    BASCaptchaSolver.api = BASCaptchaSolver.getServiceApi(_function_arguments());
    const data = _result_function(); _function_arguments()['pageUrl'] = data.pageUrl;

    _call_function(BASCaptchaSolver.api.solveTask, {
      taskWaitInterval: _function_argument('taskWaitInterval'),
      taskWaitDelay: _function_argument('taskWaitDelay'),
      task: new BASCaptchaSolver.api.FunCaptchaTask({
        userAgent: _function_argument('userAgent'),
        pageUrl: _function_argument('pageUrl'),
        proxy: _function_argument('proxy'),
        subdomainUrl: data['surl'],
        publicKey: data['pk'],
      })
    })!

    _call_function(BASCaptchaSolver.helper.submitCaptcha, { token: _result_function() })!
  };

  global.BASCaptchaSolver = new CaptchaSolver();
})(this);