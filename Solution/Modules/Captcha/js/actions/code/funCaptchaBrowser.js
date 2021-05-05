/*Browser*/
_SELECTOR = <%= query %>;

BASCaptchaSolver.waiter = function () {
  <%= waiter %>
};

BASCaptchaSolver.path = function () {
  return (<%= path %>);
};

url()!

_call_function(BASCaptchaSolver.solveFunCaptcha, {
  taskWaitInterval: <%= taskWaitInterval %>,
  taskWaitDelay: <%= taskWaitDelay %>,
  proxy: <%= sendProxy %> ? _PROXY : {},
  userAgent: <%= userAgent %>,
  service: <%= service %>,
  apiUrl: <%= apiUrl %>,
  apiKey: <%= apiKey %>,
  pageUrl : _result()
})!