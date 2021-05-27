(function (solver) {
  function BaseHelper() { }

  BaseHelper.prototype.ensureSelector = function () {
    wait_element(BASCaptchaSolver.helper.query)!
    BASCaptchaSolver.helper.$element().exist()!
    if (_result() !== 1) _break();
  };

  BaseHelper.prototype.submitCaptcha = function () {
    fail('Method "BaseHelper#submitCaptcha" is not implemented');
  };

  BaseHelper.prototype.extractData = function () {
    fail('Method "BaseHelper#extractData" is not implemented');
  };

  BaseHelper.prototype.$element = function () {
    return get_element_selector(BASCaptchaSolver.helper.query, false);
  };

  solver.helpers.BaseHelper = BaseHelper;
})(BASCaptchaSolver);