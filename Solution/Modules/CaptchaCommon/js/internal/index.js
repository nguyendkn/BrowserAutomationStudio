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
      BASCaptchaSolver.setHelper(new BASCaptchaSolver.helpers.FunCaptchaHelper({
        waiter: _function_argument('waiter'),
        query: _function_argument('query'),
        path: _function_argument('path')
      }));
      _call_function(BASCaptchaSolver.helper.initialize, {})!
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
    },

    solveHCaptcha: function () {
      BASCaptchaSolver.setHelper(new BASCaptchaSolver.helpers.HCaptchaHelper({
        waiter: _function_argument('waiter'),
        query: _function_argument('query'),
        path: _function_argument('path')
      }));
      _call_function(BASCaptchaSolver.helper.initialize, {})!
      BASCaptchaSolver.api = BASCaptchaSolver.getServiceApi(_function_arguments());
      const data = _result_function(); _function_arguments()['pageUrl'] = data.pageUrl;

      _call_function(BASCaptchaSolver.api.solveTask, {
        taskWaitInterval: _function_argument('taskWaitInterval'),
        taskWaitDelay: _function_argument('taskWaitDelay'),
        task: new BASCaptchaSolver.api.HCaptchaTask({
          userAgent: _function_argument('userAgent'),
          pageUrl: _function_argument('pageUrl'),
          proxy: _function_argument('proxy'),
          siteKey: data['siteKey'],
        })
      })!

      _call_function(BASCaptchaSolver.helper.submitCaptcha, { token: _result_function() })!
    },
  };
})(this);