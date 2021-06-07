(function (solver, _) {
  solver.AntiCaptchaApi = _.inherit(solver.CaptchaApi, function (options) {
    solver.CaptchaApi.call(this, 'AntiCaptcha', options);
    this.disableJsonInterface = false;
  });
})(BASCaptchaSolver, BASCaptchaSolver.utils);