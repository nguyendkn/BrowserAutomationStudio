(function (global) {
  global.BASCaptchaSolver.solveHCaptcha = function () {
    const args = _function_arguments();
    BASCaptchaSolver.setHelper(new BASCaptchaSolver.helpers.HCaptchaHelper(args));
    BASCaptchaSolver.api = BASCaptchaSolver.getService(args);
    _call_function(BASCaptchaSolver.helper.initialize, {})!
    const data = _result_function();

    _call_function(BASCaptchaSolver.api.solve, {
      task: new BASCaptchaSolver.api.HCaptchaTask({
        userAgent: args.userAgent,
        pageUrl: data.pageUrl,
        siteKey: data.siteKey,
        proxy: args.proxy
      }),
      taskWaitInterval: args.taskWaitInterval,
      taskWaitDelay: args.taskWaitDelay
    })!

    _call_function(BASCaptchaSolver.helper.submitCaptcha, { token: _result_function() })!
  };
})(this);