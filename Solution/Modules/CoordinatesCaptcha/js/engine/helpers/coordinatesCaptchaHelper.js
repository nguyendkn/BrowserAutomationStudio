(function (solver, _) {
  const CoordinatesCaptchaHelper = _.inherit(solver.helpers.BaseHelper, function (options) {
    solver.helpers.BaseHelper.call(this, options, {});
    this.extractData = _.bind(extractData, this);
    this.initialize = _.bind(initialize, this);
  });

  function extractData() {

  };

  function initialize() {
    const self = this; _call_function(self.ensureSelector, {})!

    _if_else(_result_function(), function () {

    }, function () { fail(tr("Failed to find an element with the specified selector for CoordinatesCaptcha solving")) })!
  };

  solver.helpers.CoordinatesCaptchaHelper = CoordinatesCaptchaHelper;
})(BASCaptchaSolver, BASCaptchaSolver.utils);