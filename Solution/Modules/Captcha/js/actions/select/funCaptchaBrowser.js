const taskWaitInterval = GetInputConstructorValue('taskWaitInterval', loader);
const taskWaitDelay = GetInputConstructorValue('taskWaitDelay', loader);
const sendProxy = GetInputConstructorValue('sendProxy', loader);
const userAgent = GetInputConstructorValue('userAgent', loader);
const pageUrl = GetInputConstructorValue('pageUrl', loader);
const service = GetInputConstructorValue('service', loader);
const apiUrl = GetInputConstructorValue('apiUrl', loader);
const apiKey = GetInputConstructorValue('apiKey', loader);

if (!taskWaitInterval.original.length) {
  return Invalid(tr('The "Task solution check interval" parameter is empty'));
}
if (!taskWaitDelay.original.length) {
  return Invalid(tr('The "Task solution check delay" parameter is empty'));
}
if (!service.original.length) {
  return Invalid(tr('The "Service name" parameter is empty'));
}
if (!apiKey.original.length) {
  return Invalid(tr('The "Service key" parameter is empty'));
}
if (!pageUrl.original.length) {
  return Invalid(tr('The "Page URL" parameter is empty'));
}

try {
  const code = Normalize(loader.GetAdditionalData() + _.template($('#funCaptchaBrowser_code').html())({
    taskWaitInterval: taskWaitInterval.updated,
    taskWaitDelay: taskWaitDelay.updated,
    sendProxy: sendProxy.updated,
    userAgent: userAgent.updated,
    pageUrl: pageUrl.updated,
    service: service.updated,
    apiUrl: apiUrl.updated,
    apiKey: apiKey.updated,
    ...GetPath(loader)
  }), 0);
  BrowserAutomationStudio_Append('', BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
} catch (e) { console.log('Error while adding action:', e) }