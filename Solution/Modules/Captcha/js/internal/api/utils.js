(function (solver) {
  solver.CaptchaApi.getError = function (response) {
    if (response && (response['errorCode'] || response['error_text'])) {
      return {
        errorId: response['errorId'] || null,
        errorCode: response['errorCode'] || response['request'],
        errorDescription: response['errorDescription'] || response['error_text']
      }
    }
    return null;
  };
})(BASCaptchaSolver);