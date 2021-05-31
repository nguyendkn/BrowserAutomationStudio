(function (solver, _) {
  const HCaptchaHelper = _.inherit(solver.helpers.BaseHelper, function (options) {
    solver.helpers.BaseHelper.call(this, options, {});
    this.submitCaptcha = _.bind(submitCaptcha, this);
    this.extractData = _.bind(extractData, this);
    this.initialize = _.bind(initialize, this);

    this.hRecaptchaResponse = _.bind(function () {
      return this.$element().xpath('//textarea[@name="h-captcha-response"]');
    }, this);

    this.gRecaptchaResponse = _.bind(function () {
      return this.$element().xpath('//textarea[@name="g-captcha-response"]');
    }, this);
  });

  function submitCaptcha() {
    const self = this;

    _call_function(_.script, {
      script: 'self.value = ' + JSON.stringify(_function_argument('token')),
      element: self.hRecaptchaResponse()
    })!

    _call_function(_.script, {
      script: 'self.value = ' + JSON.stringify(_function_argument('token')),
      element: self.gRecaptchaResponse()
    })!

    page().script('_BAS_HIDE(BrowserAutomationStudio_HCaptchaSolved)()')!
  };

  function extractData() {

  };

  function initialize() {
    const self = this; _call_function(self.ensureSelector, {})!

    _if_else(_result_function(), function () {
      _call_function(_.exist, { element: self.hRecaptchaResponse() })!
      if (_result_function() !== 1) {
        fail("Can't find HCaptcha 'h-captcha-response' textarea element");
      }

      _call_function(_.exist, { element: self.gRecaptchaResponse() })!
      if (_result_function() !== 1) {
        fail("Can't find HCaptcha 'g-captcha-response' textarea element");
      }

      _call_function(self.extractData, {})!
    }, function () { fail("Failed to find an element with the specified selector") })!
  };

  solver.helpers.HCaptchaHelper = HCaptchaHelper;
})(BASCaptchaSolver, BASCaptchaSolver.utils);