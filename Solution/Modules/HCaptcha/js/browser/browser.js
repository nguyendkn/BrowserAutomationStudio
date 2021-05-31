(function () {
  Object.defineProperty(window, 'hcaptcha', {
    set: function (value) {
      _BAS_HIDE(BrowserAutomationStudio_HCaptcha) = value;
      const originalRenderFn = value.render;

      _BAS_HIDE(BrowserAutomationStudio_HCaptcha).render = function (container, params) {
        _BAS_HIDE(BrowserAutomationStudio_HCaptchaCallback) = params.callback;
        _BAS_HIDE(BrowserAutomationStudio_HCaptchaSitekey) = params.sitekey;
        return originalRenderFn(container, params);
      };
    },
    get: function () {
      if (typeof (_BAS_HIDE(BrowserAutomationStudio_HCaptcha)) !== 'undefined') {
        return _BAS_HIDE(BrowserAutomationStudio_HCaptcha);
      }
    }
  });

  _BAS_HIDE(BrowserAutomationStudio_HCaptchaSolved) = function () {
    let callback = _BAS_HIDE(BrowserAutomationStudio_HCaptchaCallback);
    if (typeof (callback) !== 'undefined') {
      if (typeof (callback) === 'string') callback = eval(callback);
      try { callback(); } catch (e) { }
    }
  };
})();