(function (global) {
  global.BASCaptchaSolver.solveCoordinatesCaptcha = function () {
    const args = _function_arguments();
    BASCaptchaSolver.api = BASCaptchaSolver.getService(args);

    _if(args.query, function () {
      BASCaptchaSolver.setHelper(new BASCaptchaSolver.helpers.CoordinatesCaptchaHelper(args));
      _call_function(BASCaptchaSolver.helper.initialize, {})!
      args.imageData = _result_function().imageData;
    })!

    _call_function(BASCaptchaSolver.api.solve, {
      task: new BASCaptchaSolver.api.CoordinatesCaptchaTask(args.imageData, {
        textInstructions: args.textInstructions,
        imgInstructions: args.imgInstructions,
      }),
      waitTimeout: args.taskWaitTimeout,
      waitDelay: args.taskWaitDelay
    })!

    _if(args.query, function () {
      _call_function(BASCaptchaSolver.helper.submitCaptcha, { points: _result_function() })!
    })!
  };
})(this);