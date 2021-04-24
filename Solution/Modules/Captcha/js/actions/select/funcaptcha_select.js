const timesToSolve = GetInputConstructorValue('TimesToSolve', loader);
const sendProxy = GetInputConstructorValue('SendProxy', loader);
const service = GetInputConstructorValue('Service', loader);
const apiUrl = GetInputConstructorValue('ApiUrl', loader);
const apiKey = GetInputConstructorValue('ApiKey', loader);

if (timesToSolve['original'].length === 0) {
  return Invalid('Times to solve is empty');
}

if (service['original'].length === 0) {
  return Invalid('Method is empty');
}

try {
  const code = Normalize(loader.GetAdditionalData() + _.template($('#FunCaptcha_code').html())({
    timesToSolve: timesToSolve.updated,
    sendProxy: sendProxy.updated,
    service: service.updated,
    apiUrl: apiUrl.updated,
    apiKey: apiKey.updated,
    ...GetPath(loader)
  }), 0);

  BrowserAutomationStudio_Append('', BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
} catch (e) { }