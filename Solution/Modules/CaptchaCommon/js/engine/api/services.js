(function (solver) {
  const services = {
    'AntiCaptcha': new solver.AntiCaptchaApi({
      supportedTasks: ['FunCaptcha', 'HCaptcha'],
      apiUrl: 'https://api.anti-captcha.com',
      name: 'AntiCaptcha',
      aliases: ['antigate'],
      softId: '784',
    }),
    'RuCaptcha': new solver.RuCaptchaApi({
      supportedTasks: ['FunCaptcha', 'HCaptcha'],
      apiUrl: 'https://rucaptcha.com',
      name: 'RuCaptcha',
      aliases: [],
      softId: '1345',
    }),
    '2Captcha': new solver.RuCaptchaApi({
      supportedTasks: ['FunCaptcha', 'HCaptcha'],
      apiUrl: 'https://2captcha.com',
      name: '2Captcha',
      aliases: [],
      softId: '1346',
    }),
  };

  function findService(serviceName) {
    var name = serviceName.toLowerCase().replace('-newapi', '');

    for (var key in services) {
      if (key.toLowerCase() === name || services[key].options.aliases.indexOf(name) >= 0) {
        return services[key];
      }
    }
  };

  solver.getService = function (options) {
    const service = findService(options.serviceName);

    if (!service) {
      if (_K === 'en') {
        fail('Service "' + options.serviceName + '" is unavailable');
      } else {
        fail('Сервис "' + options.serviceName + '" недоступен');
      }
    }

    return service.setApiKey(options.serviceKey).setApiUrl(options.serviceUrl);
  };
})(BASCaptchaSolver);