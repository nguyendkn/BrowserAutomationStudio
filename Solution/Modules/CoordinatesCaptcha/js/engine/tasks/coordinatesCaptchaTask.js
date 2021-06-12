(function (tasks, api, _) {
  const CoordinatesCaptchaTask = _.inherit(tasks.RuCaptchaTask, function (params) {
    tasks.RuCaptchaTask.call(this, 'CoordinatesCaptcha', {
      name: 'post',
      rules: {
        coordinatesCaptcha: { name: 'coordinatescaptcha', optional: false },
        textInstructions: { name: 'textinstructions', optional: false },
        imgInstructions: { name: 'imginstructions', optional: true },
        imageData: { name: 'body' },
      },
      params: params
    });
  });

  CoordinatesCaptchaTask.prototype.getSolution = function (response) {
    return response.split(':').pop().split(';').map(function (data) {
      const point = data.split(',');

      return [
        parseInt(point[0].split('=').pop()),
        parseInt(point[1].split('=').pop()),
      ]
    });
  };

  api.prototype.CoordinatesCaptchaTask = CoordinatesCaptchaTask;
})(BASCaptchaSolver.tasks, BASCaptchaSolver.RuCaptchaApi, BASCaptchaSolver.utils);