(function (global) {
  global.BASCaptchaSolver = {
    helpers: {},

    tasks: {},

    utils: {},

    setHelper: function (value) {
      BASCaptchaSolver.helper = value;
    },

    setDebug: function (value) {
      BASCaptchaSolver.debug = value;
    },

    solveFunCaptcha: function () {
      const args = _function_arguments();
      BASCaptchaSolver.setHelper(new BASCaptchaSolver.helpers.FunCaptchaHelper(args));
      BASCaptchaSolver.api = BASCaptchaSolver.getService(args);
      _call_function(BASCaptchaSolver.helper.initialize, {})!
      const data = _result_function();

      _call_function(BASCaptchaSolver.api.solveTask, {
        task: new BASCaptchaSolver.api.FunCaptchaTask({
          subdomainUrl: data.subdomainUrl,
          publicKey: data.publicKey,
          userAgent: args.userAgent,
          pageUrl: data.pageUrl,
          proxy: args.proxy
        }),
        taskWaitInterval: args.taskWaitInterval,
        taskWaitDelay: args.taskWaitDelay
      })!

      _call_function(BASCaptchaSolver.helper.submitCaptcha, { token: _result_function() })!
    },

    solveHCaptcha: function () {
      const args = _function_arguments();
      BASCaptchaSolver.setHelper(new BASCaptchaSolver.helpers.HCaptchaHelper(args));
      BASCaptchaSolver.api = BASCaptchaSolver.getService(args);
      _call_function(BASCaptchaSolver.helper.initialize, {})!
      const data = _result_function();

      _call_function(BASCaptchaSolver.api.solveTask, {
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
    },
  };
})(this);