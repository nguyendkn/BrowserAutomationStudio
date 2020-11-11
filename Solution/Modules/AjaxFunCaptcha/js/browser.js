(function () {
  function extendFunCaptcha(fn) {
    const extended = function () {
      if (arguments[0] && arguments[0].callback) {
        if (typeof (_BAS_HIDE(BrowserAutomationStudio_FunCaptchaCallback)) === 'undefined') {
          _BAS_HIDE(BrowserAutomationStudio_FunCaptchaCallback) = [];
        }

        _BAS_HIDE(BrowserAutomationStudio_FunCaptchaCallback).push(arguments[0].callback);
      }

      fn.apply(this, arguments);
    };

    extended.prototype = Object.create(fn.prototype);
    return extended;
  };

  Object.defineProperty(window, 'FunCaptcha', {
    set: function () {
      _BAS_HIDE(BrowserAutomationStudio_FunCaptcha) = extendFunCaptcha(
        ArkoseEnforcement = extendFunCaptcha(ArkoseEnforcement)
      );
    },

    get: function () {
      if (typeof (_BAS_HIDE(BrowserAutomationStudio_FunCaptcha)) !== 'undefined') {
        return _BAS_HIDE(BrowserAutomationStudio_FunCaptcha);
      }
    }
  });

  _BAS_HIDE(BrowserAutomationStudio_FunCaptchaSolved) = function () {
    try {
      if (typeof (_BAS_HIDE(BrowserAutomationStudio_FunCaptchaCallback)) === 'object') {
        _BAS_HIDE(BrowserAutomationStudio_FunCaptchaCallback).forEach(function (callback) {
          try {
            callback();
          } catch (e) { }
        });
      }
    } catch (e) { }
  };
})();