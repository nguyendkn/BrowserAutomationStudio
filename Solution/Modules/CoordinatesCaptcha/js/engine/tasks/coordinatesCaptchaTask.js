(function (tasks, api, _) {
  const CoordinatesCaptchaTask = _.inherit(tasks.RuCaptchaTask, function (params) {
    tasks.RuCaptchaTask.call(this, 'CoordinatesCaptcha', {
      name: 'post',
      rules: {
        coordinatesCaptcha: { name: 'coordinatescaptcha', optional: false },
        textInstructions: { name: 'textinstructions', optional: false },
        imgInstructions: { name: 'imginstructions', optional: true },
        pictureBase64: { name: 'body' },
      },
      params: params
    });
  });
  api.prototype.CoordinatesCaptchaTask = CoordinatesCaptchaTask;
})(BASCaptchaSolver.tasks, BASCaptchaSolver.RuCaptchaApi, BASCaptchaSolver.utils);