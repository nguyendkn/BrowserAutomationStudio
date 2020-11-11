/*Browser*/
_SELECTOR = <%= query %>; 

BASCaptchaSolver.waiter = function () {
  <%= waiter %>
};

BASCaptchaSolver.path = function () {
  return (<%= path %>);
};

url()!

_call(BAS_SolveFunCaptcha, {
  sendProxy: (<%= sendProxy %>) === 'true',
  serverUrl: <%= serverUrl %>,
  apiKey: <%= apiKey %>,
  method: <%= method %>,
  query: <%= query %>,
  pageUrl : _result()
})!