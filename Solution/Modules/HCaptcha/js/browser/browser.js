(function () {
  Object.defineProperty(window, 'hcaptcha', {
    set: function (value) {
      _BAS_HIDE(BrowserAutomationStudio_HCaptcha) = value;
      const originalRenderFn = value.render;

      _BAS_HIDE(BrowserAutomationStudio_HCaptcha).render = function (container, params) {
        if (params) {
          if (params.callback) {
            _BAS_HIDE(BrowserAutomationStudio_HCaptchaCallback) = params.callback;
          }

          if (params.sitekey) {
            _BAS_HIDE(BrowserAutomationStudio_HCaptchaSitekey) = params.sitekey;
          }

          if (params.size) {
            _BAS_HIDE(BrowserAutomationStudio_HCaptchaSize) = params.size;
          }
        }

        return originalRenderFn(container, params);
      };
    },
    get: function () {
      return _BAS_HIDE(BrowserAutomationStudio_HCaptcha);
    }
  });

  _BAS_HIDE(BrowserAutomationStudio_HCaptchaSolved) = function (token) {
    let callback = _BAS_HIDE(BrowserAutomationStudio_HCaptchaCallback);
    if (typeof (callback) !== 'undefined') {
      if (typeof (callback) === 'string') callback = eval(callback);
      try { callback(token); } catch (e) { }
    }
  };
})();