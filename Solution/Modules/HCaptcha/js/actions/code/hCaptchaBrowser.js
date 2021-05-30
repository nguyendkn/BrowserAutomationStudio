/*Browser*/
_call_function(BASCaptchaSolver.solveHCaptcha, {
  proxy: String(<%= sendProxy %>).toLowerCase() == 'true' ? _PROXY : {},
  taskWaitInterval: <%= taskWaitInterval %>,
  taskWaitDelay: <%= taskWaitDelay %>,
  serviceName: <%= serviceName %>,
  serviceUrl: <%= serviceUrl %>,
  serviceKey: <%= serviceKey %>,
  userAgent: <%= userAgent %>,
  query: <%= query %>,
  waiter: function () {
    <%= waiter %>
  },
  path: function () {
    return (<%= path %>);
  },
})!