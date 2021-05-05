const taskWaitInterval = GetInputConstructorValue('taskWaitInterval', loader);
const taskWaitDelay = GetInputConstructorValue('taskWaitDelay', loader);
const sendProxy = GetInputConstructorValue('sendProxy', loader);
const userAgent = GetInputConstructorValue('userAgent', loader);
const service = GetInputConstructorValue('service', loader);
const apiUrl = GetInputConstructorValue('apiUrl', loader);
const apiKey = GetInputConstructorValue('apiKey', loader);

if (service.original.length === 0) {
  return Invalid('Service is empty');
}

try {
  const code = Normalize(loader.GetAdditionalData() + _.template($('#funCaptchaDefault_code').html())({
    taskWaitInterval: taskWaitInterval.updated,
    taskWaitDelay: taskWaitDelay.updated,
    userAgent: userAgent.updated,
    sendProxy: sendProxy.updated,
    service: service.updated,
    apiUrl: apiUrl.updated,
    apiKey: apiKey.updated
  }), 0);
  BrowserAutomationStudio_Append('', BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
} catch (e) { console.log('Error while adding action:', e) }