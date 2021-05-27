/*Browser*/
_call_function(BASCaptchaSolver.solveFunCaptcha, {
  proxy: String(<%= sendProxy %>).toLowerCase() == 'true' ? _PROXY : {},
  taskWaitInterval: <%= taskWaitInterval %>,
  taskWaitDelay: <%= taskWaitDelay %>,
  userAgent: <%= userAgent %>,
  service: <%= service %>,
  apiUrl: <%= apiUrl %>,
  apiKey: <%= apiKey %>,
  query: <%= query %>,
  waiter: function () {
    <%= waiter %>
  },
  path: function () {
    return (<%= path %>);
  },
})!