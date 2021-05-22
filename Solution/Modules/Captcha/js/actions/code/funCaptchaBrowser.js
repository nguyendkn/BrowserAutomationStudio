/*Browser*/
_SELECTOR = <%= query %>;

BASCaptchaSolver.waiter = function () {
  <%= waiter %>
};

BASCaptchaSolver.path = function () { return (<%= path %>) };

_call_function(BASCaptchaSolver.solveFunCaptcha, {
  proxy: String(<%= sendProxy %>).toLowerCase() == 'true' ? _PROXY : {},
  taskWaitInterval: <%= taskWaitInterval %>,
  taskWaitDelay: <%= taskWaitDelay %>,
  userAgent: <%= userAgent %>,
  pageUrl : <%= pageUrl %>,
  service: <%= service %>,
  apiUrl: <%= apiUrl %>,
  apiKey: <%= apiKey %>,
})!