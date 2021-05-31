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

    _if_else(_result_function(), function () {
      _do_with_params({ self: self }, function () {
        self.$element().script('((self.children.length && self.children[0].id === "fc-iframe-wrap") || self.id === "fc-iframe-wrap") ? 1 : 0')!
        const self = _cycle_param('self');
        if (_iterator() == 3) _break();
        if (_result() == 1) _break();
        self.removeFrameFromRight();
      })!

      _call_function(_.exist, { element: self.verificationToken() })!
      if (_result_function() !== 1) {
        fail(tr("Can't find FunCaptcha 'verification-token' input element"));
      }

      _call_function(_.exist, { element: self.fcToken() })!
      if (_result_function() !== 1) {
        fail(tr("Can't find FunCaptcha 'fc-token' input element"));
      }

      _call_function(self.extractData, {})!
    }, function () { fail(tr("Failed to find an element with the specified selector for FunCaptcha solving")) })!
  };

  solver.helpers.FunCaptchaHelper = FunCaptchaHelper;
})(BASCaptchaSolver, BASCaptchaSolver.utils);