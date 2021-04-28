const sendProxy = GetInputConstructorValue('SendProxy', loader);
const service = GetInputConstructorValue('Service', loader);
const apiUrl = GetInputConstructorValue('ApiUrl', loader);
const apiKey = GetInputConstructorValue('ApiKey', loader);

if (service.original.length === 0) {
  return Invalid('Service is empty');
}

try {
  const code = Normalize(loader.GetAdditionalData() + _.template($('#funCaptcha_code').html())({
    sendProxy: sendProxy.updated,
    service: service.updated,
    apiUrl: apiUrl.updated,
    apiKey: apiKey.updated
  }), 0);
  BrowserAutomationStudio_Append('', BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
} catch (e) { }