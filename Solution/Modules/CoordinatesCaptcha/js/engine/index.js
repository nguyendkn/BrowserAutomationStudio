(function (global) {
  global.BASCaptchaSolver.solveCoordinatesCaptcha = function () {
    const args = _function_arguments();
    BASCaptchaSolver.setHelper(new BASCaptchaSolver.helpers.CoordinatesCaptchaHelper(args));
    BASCaptchaSolver.api = BASCaptchaSolver.getService(args);
    _call_function(BASCaptchaSolver.helper.initialize, {})!
    const data = _result_function();

    _call_function(BASCaptchaSolver.api.solve, {
      task: new BASCaptchaSolver.api.CoordinatesCaptchaTask({
        textInstructions: args.textInstructions,
        imgInstructions: args.imgInstructions,
        coordinatesCaptcha: '1'
      }),
      waitTimeout: args.taskWaitTimeout,
      waitDelay: args.taskWaitDelay
    })!
  };
})(this);