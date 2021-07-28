/*Browser*/
_call_function(BASCaptchaSolver.solveCoordinatesCaptcha, {
  textInstructions: <%= textInstructions %>,
  taskWaitTimeout: <%= taskWaitTimeout %>,
  taskWaitDelay: <%= taskWaitDelay %>,
  serviceName: <%= serviceName %>,
  serviceUrl: <%= serviceUrl %>,
  serviceKey: <%= serviceKey %>,
  query: <%= query %>,
  waiter: function () {
    <%= waiter %>
  },
  path: function () {
    return (<%= path %>);
  },
})!