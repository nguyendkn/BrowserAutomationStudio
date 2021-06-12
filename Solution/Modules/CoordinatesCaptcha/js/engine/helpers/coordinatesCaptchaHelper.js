(function (solver, _) {
  const CoordinatesCaptchaHelper = _.inherit(solver.helpers.BaseHelper, function (options) {
    solver.helpers.BaseHelper.call(this, options, {});
    this.extractData = _.bind(extractData, this);
    this.initialize = _.bind(initialize, this);
  });

  function extractData() {
    this.$element.render_base64(function () {
      _function_return({ imageData: _result() });
    });
  };

  function initialize() {
    const self = this; _call_function(self.ensureSelector, {})!

    _if_else(_result_function(), function () {
      _call_function(self.extractData, {})!
    }, function () {
      if (_K === 'en') {
        fail("Failed to find an element with the specified selector for CoordinatesCaptcha solving");
      } else {
        fail("Не удалось найти элемент с указанным селектором для решения CoordinatesCaptcha");
      }
    })!
  };

  solver.helpers.CoordinatesCaptchaHelper = CoordinatesCaptchaHelper;
})(BASCaptchaSolver, BASCaptchaSolver.utils);