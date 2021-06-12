(function (global) {
  global.BASCaptchaSolver.solveCoordinatesCaptcha = function () {
    const args = _function_arguments();
    BASCaptchaSolver.api = BASCaptchaSolver.getService(args);

    _if(!args.imageData, function () {
      BASCaptchaSolver.setHelper(new BASCaptchaSolver.helpers.CoordinatesCaptchaHelper(args));
      _call_function(BASCaptchaSolver.helper.initialize, {})!
      args.imageData = _result_function().imageData;
    })!

    _call_function(BASCaptchaSolver.api.solve, {
      task: new BASCaptchaSolver.api.CoordinatesCaptchaTask({
        textInstructions: args.textInstructions,
        imgInstructions: args.imgInstructions,
        imageData: args.imageData,
      }),
      waitTimeout: args.taskWaitTimeout,
      waitDelay: args.taskWaitDelay
    })!
  };
})(this);