const taskWaitInterval = GetInputConstructorValue('TaskWaitInterval', loader);
const taskWaitDelay = GetInputConstructorValue('TaskWaitDelay', loader);
const sendProxy = GetInputConstructorValue('SendProxy', loader);
const service = GetInputConstructorValue('Service', loader);
const apiUrl = GetInputConstructorValue('ApiUrl', loader);
const apiKey = GetInputConstructorValue('ApiKey', loader);

if (service.original.length === 0) {
  return Invalid('Service is empty');
}

try {
  const code = Normalize(loader.GetAdditionalData() + _.template($('#funCaptcha_browser_code').html())({
    taskWaitInterval: taskWaitInterval.updated,
    taskWaitDelay: taskWaitDelay.updated,
    sendProxy: sendProxy.updated,
    service: service.updated,
    apiUrl: apiUrl.updated,
    apiKey: apiKey.updated,
    ...GetPath(loader)
  }), 0);
  BrowserAutomationStudio_Append('', BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
} catch (e) { }