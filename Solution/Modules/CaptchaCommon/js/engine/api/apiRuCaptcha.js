(function (solver, _) {
  solver.RuCaptchaApi = _.inherit(solver.CaptchaApi, function (method, options) {
    solver.CaptchaApi.call(this, 'RuCaptcha', method, options);
    this.options.isJsonInterface = '0';
  });
})(BASCaptchaSolver, BASCaptchaSolver.utils);