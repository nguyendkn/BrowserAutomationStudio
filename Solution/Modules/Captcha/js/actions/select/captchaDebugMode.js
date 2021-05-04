const enable = GetInputConstructorValue('enable', loader);

if (enable.original.length === 0) {
  return Invalid(`${tr('The parameter')} "${tr('Captcha debug mode')}" ${tr('is not specified')}`);
}

try {
  const code = Normalize(loader.GetAdditionalData() + _.template($("#captchaDebugMode_code").html())({
    enable: enable.updated
  }), 0);
  BrowserAutomationStudio_Append('', BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
} catch (e) { }