(function (solver) {
  const services = {
    'anticaptcha': new solver.AntiCaptchaApi({
      supportedTasks: ['FunCaptcha', 'HCaptcha'],
      apiUrl: 'https://api.anti-captcha.com',
      name: 'AntiCaptcha',
    }),
    'rucaptcha': new solver.RuCaptchaApi({
      supportedTasks: ['FunCaptcha', 'HCaptcha'],
      apiUrl: 'https://rucaptcha.com',
      name: 'RuCaptcha',
    }),
    '2captcha': new solver.RuCaptchaApi({
      supportedTasks: ['FunCaptcha', 'HCaptcha'],
      apiUrl: 'https://2captcha.com',
      name: '2Captcha',
    })
  };

  solver.getServiceApi = function (name, apiKey, apiUrl) {
    if (!services[name]) {
      if (_K === 'en') {
        die('Service "' + service + '" is unavailable', true);
      } else {
        die('Сервис "' + service + '" недоступен', true);
      }
    }

    return services[name].setApiUrl(apiUrl).setApiKey(apiKey);
  };
})(BASCaptchaSolver);