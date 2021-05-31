(function () {
  Object.defineProperty(window, 'hcaptcha', {
    set: function (value) {
      _BAS_HIDE(BrowserAutomationStudio_HCaptcha) = value;
      const originalRenderFn = value.render;

      _BAS_HIDE(BrowserAutomationStudio_HCaptcha).render = function (container, opts) {
        _BAS_HIDE(BrowserAutomationStudio_HCaptchaCallback) = opts.callback;
        _BAS_HIDE(BrowserAutomationStudio_HCaptchaSitekey) = opts.sitekey;
        return originalRenderFn(container, opts);
      };
    },
    get: function () {
      if (typeof (_BAS_HIDE(BrowserAutomationStudio_HCaptcha)) !== 'undefined') {
        return _BAS_HIDE(BrowserAutomationStudio_HCaptcha);
      }
    }
  });

  _BAS_HIDE(BrowserAutomationStudio_HCaptchaSolved) = function () {
    if (typeof (_BAS_HIDE(BrowserAutomationStudio_HCaptchaCallback)) !== 'undefined') {
      try { _BAS_HIDE(BrowserAutomationStudio_HCaptchaCallback)(); } catch (e) { }
    }
  };
})();