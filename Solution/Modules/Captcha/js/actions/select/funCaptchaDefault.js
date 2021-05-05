const taskWaitInterval = GetInputConstructorValue('taskWaitInterval', loader);
const taskWaitDelay = GetInputConstructorValue('taskWaitDelay', loader);
const proxyPassword = GetInputConstructorValue('proxyPassword', loader);
const proxyLogin = GetInputConstructorValue('proxyLogin', loader);
const proxyType = GetInputConstructorValue('proxyType', loader);
const proxyText = GetInputConstructorValue('proxyText', loader);
const userAgent = GetInputConstructorValue('userAgent', loader);
const service = GetInputConstructorValue('service', loader);
const apiUrl = GetInputConstructorValue('apiUrl', loader);
const apiKey = GetInputConstructorValue('apiKey', loader);

if (!taskWaitInterval.original.length) {
  return Invalid('The "Task wait interval" param is empty');
} else if (!taskWaitDelay.original.length) {
  return Invalid('The "Task wait delay" param is empty');
} else if (!service.original.length) {
  return Invalid('The "Service" param is empty');
} else if (!apiKey.original.length) {
  return Invalid('The "Api Key" param is empty');
}

try {
  const code = Normalize(loader.GetAdditionalData() + _.template($('#funCaptchaDefault_code').html())({
    taskWaitInterval: taskWaitInterval.updated,
    taskWaitDelay: taskWaitDelay.updated,
    proxyPassword: proxyPassword.updated,
    proxyLogin: proxyLogin.updated,
    proxyText: proxyText.updated,
    proxyType: proxyType.updated,
    userAgent: userAgent.updated,
    service: service.updated,
    apiUrl: apiUrl.updated,
    apiKey: apiKey.updated
  }), 0);
  BrowserAutomationStudio_Append('', BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
} catch (e) { console.log('Error while adding action:', e) }