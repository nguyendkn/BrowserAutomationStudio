(function (solver) {
  solver.CaptchaApi.getError = function (response) {
    if (response) {
      return {
        errorId: response['errorId'] || null,
        errorCode: response['errorCode'] || response['request'],
        errorDescription: response['errorDescription'] || response['error_text']
      }
    }
    return null;
  };
})(BASCaptchaSolver);