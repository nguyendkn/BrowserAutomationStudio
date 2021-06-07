(function (solver, _) {
  solver.RuCaptchaApi = _.inherit(solver.CaptchaApi, function (options) {
    solver.CaptchaApi.call(this, 'RuCaptcha', options);
    this.disableJsonInterface = true;
  });
})(BASCaptchaSolver, BASCaptchaSolver.utils);