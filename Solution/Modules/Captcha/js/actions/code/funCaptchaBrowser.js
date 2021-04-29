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
  proxy: <%= sendProxy %> ? _PROXY : {},
  service: <%= service %>,
  apiUrl: <%= apiUrl %>,
  apiKey: <%= apiKey %>,
  pageUrl : _result()
})!