(function (solver, _) {
  solver.AntiCaptchaApi = _.inherit(solver.CaptchaApi, function (method, options) {
    solver.CaptchaApi.call(this, method, options);
    this.options.isJsonInterface = '1';
  });
})(BASCaptchaSolver, BASCaptchaSolver.utils);