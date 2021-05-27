(function (solver, _) {
  const FunCaptchaHelper = _.inherit(solver.helpers.BaseHelper, function (options) {
    solver.helpers.BaseHelper.call(this, options, {});
    this.submitCaptcha = _.bind(submitCaptcha, this);
    this.extractData = _.bind(extractData, this);
    this.initialize = _.bind(initialize, this);

    this.verificationToken = _.bind(function () {
      return this.$element().xpath('//input[@name="verification-token"]');
    }, this);

    this.fcToken = _.bind(function () {
      return this.$element().xpath('//input[@name="fc-token"]');
    }, this);
  });

  function submitCaptcha() {
    const self = this;

    _call_function(_.script, {
      script: 'self.value = ' + JSON.stringify(_function_argument('token')),
      element: self.verificationToken()
    })!

    _call_function(_.script, {
      script: 'self.value = ' + JSON.stringify(_function_argument('token')),
      element: self.fcToken()
    })!

    page().script('_BAS_HIDE(BrowserAutomationStudio_FunCaptchaSolved)()')!
  };

  function extractData() {
    this.fcToken().attr('value', function () {
      const data = _result().split('|').map(function (v) { return v.split('=') });
      const surl = data.filter(function (v) { return v[0] === 'surl' })[0][1];
      const pk = data.filter(function (v) { return v[0] === 'pk' })[0][1];

      url(function () { _function_return({ pageUrl: _result(), surl: surl, pk: pk }) });
    });
  };

  function initialize() {
    const self = this; _call_function(self.ensureSelector, {})!

    _if_else(_result_function(), function (params) {
      var target = self.query.toString();

      _do(function () {
        const index = target.lastIndexOf('>FRAME>');
        target = index < 0 ? target : target.slice(0, index);

        const $element = get_element_selector(target, false);
        $element.css('#fc-iframe-wrap').exist()!
        if (_iterator() === 2) _break();
        if (_result() === 1) _break();
      })!

      self.query = target;

      _call_function(_.exist, { element: self.verificationToken() })!
      if (_result_function() !== 1) {
        fail("Can't find FunCaptcha 'verification-token' input element");
      }

      _call_function(_.exist, { element: self.fcToken() })!
      if (_result_function() !== 1) {
        fail("Can't find FunCaptcha 'fc-token' input element");
      }

      _call_function(self.extractData, {})!
    }, function () { fail("Failed to find an element with the specified selector") })!
  };

  solver.helpers.FunCaptchaHelper = FunCaptchaHelper;
})(BASCaptchaSolver, BASCaptchaSolver.utils);