(function (solver) {
  solver.CaptchaApi.checkForError = function (response) {
    if (response && (response['errorCode'] || (response['status'] === 0 && response['request'] !== 'CAPCHA_NOT_READY'))) {
      return fail('Captcha solving error: ' + (response['errorCode'] || response['request']));
    }
    return response;
  };
})(BASCaptchaSolver);