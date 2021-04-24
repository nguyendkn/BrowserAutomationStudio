const timesToSolve = GetInputConstructorValue('TimesToSolve', loader);
const sendProxy = GetInputConstructorValue('SendProxy', loader);
const apiUrl = GetInputConstructorValue('ApiUrl', loader);
const apiKey = GetInputConstructorValue('ApiKey', loader);
const method = GetInputConstructorValue('Method', loader);

if (timesToSolve['original'].length === 0) {
  return Invalid('Times to solve is empty');
}

if (method['original'].length === 0) {
  return Invalid('Method is empty');
}

try {
  const code = Normalize(loader.GetAdditionalData() + _.template($('#FunCaptcha_code').html())({
    timesToSolve: timesToSolve.updated,
    sendProxy: sendProxy.updated,
    apiUrl: apiUrl.updated,
    apiKey: apiKey.updated,
    method: method.updated,
    ...GetPath(loader)
  }), 0);

  BrowserAutomationStudio_Append('', BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
} catch (e) { }