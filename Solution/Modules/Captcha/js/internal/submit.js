function BAS_SubmitFunCaptcha() {
  const script = 'self.value = ' + JSON.stringify(_function_argument('token'));
  get_element_selector(_SELECTOR).css('*[name="verification-token"]').script(script)!
  get_element_selector(_SELECTOR).css('*[name="fc-token"]').script(script)!
  page().script("_BAS_HIDE(BrowserAutomationStudio_FunCaptchaSolved)()")!
}
