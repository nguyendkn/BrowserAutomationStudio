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
  service: <%= service %>,
  apiUrl: <%= apiUrl %>,
  apiKey: <%= apiKey %>,
  query: <%= query %>,
  pageUrl : _result()
})!