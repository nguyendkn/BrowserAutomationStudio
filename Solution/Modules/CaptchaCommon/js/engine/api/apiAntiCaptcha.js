(function (solver, _) {
  solver.AntiCaptchaApi = _.inherit(solver.CaptchaApi, function (method, options) {
    solver.CaptchaApi.call(this, 'AntiCaptcha', method, options);
  });
})(BASCaptchaSolver, BASCaptchaSolver.utils);