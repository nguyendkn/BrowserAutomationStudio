(function (solver, _) {
  function BaseHelper(options) {
    this.waiter = options.waiter;
    this.query = options.query;
    this.path = options.path;
  };

  BaseHelper.prototype.removeFramePrefix = function () {
    const index = this.query.lastIndexOf('>FRAME>');
    if (index >= 0) this.query = this.query.slice(0, index);
  };

  BaseHelper.prototype.removeXpathPrefix = function () {
    const index = this.query.lastIndexOf('>XPATH>');
    if (index >= 0) this.query = this.query.slice(0, index);
  };

  BaseHelper.prototype.ensureSelector = function () {
    _call_function(BASCaptchaSolver.helper.waiter, {})!
    BASCaptchaSolver.helper.path().exist()!
    _function_return(_result() === 1);
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
})(BASCaptchaSolver, BASCaptchaSolver.utils);