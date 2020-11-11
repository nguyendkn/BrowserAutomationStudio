const timesToSolve = GetInputConstructorValue('TimesToSolve', loader);
const serverUrl = GetInputConstructorValue('ServerUrl', loader);
const sendProxy = GetInputConstructorValue('SendProxy', loader);
const apiKey = GetInputConstructorValue('ApiKey', loader);
const method = GetInputConstructorValue('Method', loader);

if (timesToSolve['original'].length === 0) {
  Invalid('Times to solve is empty');
  return;
}

if (method['original'].length === 0) {
  Invalid('Method is empty');
  return;
}

try {
  const code = Normalize(loader.GetAdditionalData() + _.template($('#FunCaptcha_code').html())({
    timesToSolve: timesToSolve.updated,
    serverUrl: serverUrl.updated,
    sendProxy: sendProxy.updated,
    apiKey: apiKey.updated,
    method: method.updated,
    ...GetPath(loader)
  }), 0);

  BrowserAutomationStudio_Append('', BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
} catch (e) { }