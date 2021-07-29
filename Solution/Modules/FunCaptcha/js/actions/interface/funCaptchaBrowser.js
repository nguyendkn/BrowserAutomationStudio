<div class="container-fluid">
  <%= _.template($('#path').html())({ selector }) %>
  <%= _.template($('#input_constructor').html())({
    variants: [ 'antigate-newapi', 'rucaptcha-newapi', '2captcha-newapi' ],
    description: tr('Service name'),
    value_string: 'rucaptcha-newapi',
    default_selector: 'string',
    disable_int: true,
    id: 'serviceName',
    help: {
      description: tr('Captcha solving service name'),
      examples: [
        { code: 'antigate-newapi', description: tr('Solve captcha using https://anti-captcha.com/ service') },
        { code: 'rucaptcha-newapi', description: tr('Solve captcha using https://rucaptcha.com/ service') },
        { code: '2captcha-newapi', description: tr('Solve captcha using https://2captcha.com/ service') },
      ]
    }
  }) %>
  <%= _.template($('#input_constructor').html())({
    help: { description: tr('Captcha solving service key. You can get it in your personal account of selected captcha solving service') },
    description: tr('Service key'),
    default_selector: 'string',
    disable_int: true,
    id: 'serviceKey'
  }) %>
  <div style="margin-left: 15px">
    <a href="#" onclick="BrowserAutomationStudio_OpenUrl(tr('https://i.imgur.com/D7xAa2b.gif')); return false;"><%= tr('How FunCaptcha looks like?') %></a>
  </div>
  <div style="margin-left: 15px">
    <input type="checkbox" id="AdvancedCheck" onchange="$('#Advanced').toggle()" />
    <label for="AdvancedCheck" class="tr">Advanced settings.</label>
  </div>
  <span id="Advanced" style="display: none;">
    <%= _.template($('#input_constructor').html())({
      description: tr('Send current proxy to solver service'),
      variants: [ 'true', 'false' ],
      default_selector: 'string',
      value_string: 'false',
      disable_int: true,
      id: 'sendProxy',
      help: {
        description: tr('Forces person who solves recaptcha use proxy that you setted up with \"Proxy\" action.'),
        examples: [
          { code: 'true', description: tr('Send current proxy to solver service') },
          { code: 'false', description: tr(`Don't send proxy. Default value.`) },
        ]
      }
    }) %>
    <%= _.template($('#input_constructor').html())({
      description: tr('Task solution check interval'),
      default_selector: 'int',
      value_number: 5 * 1000,
      disable_string: true,
      id: 'taskWaitTimeout',
      help: {
        description: tr('Task solution check interval in milliseconds. With this parameter you can control the length of the pause between each new check of the captcha solution.'),
        examples: [
          { code: '600', description: tr('Wait for 600 milliseconds') },
          { code: '10000', description: tr('Wait for 10 seconds') },
          { code: '5000', description: tr('Wait for 5 seconds') }
        ]
      }
    }) %>
    <%= _.template($('#input_constructor').html())({
      description: tr('Task solution check delay'),
      default_selector: 'int',
      value_number: 5 * 1000,
      disable_string: true,
      id: 'taskWaitDelay',
      help: {
        description: tr('Task solution check delay in milliseconds. With this parameter you can control the length of the pause between sending the task to the service and the start of waiting for a solution. Most often, captcha-solving services specify the required waiting time, in other cases you can specify any value convenient for you.'),
        examples: [
          { code: '600', description: tr('Wait for 600 milliseconds') },
          { code: '10000', description: tr('Wait for 10 seconds') },
          { code: '5000', description: tr('Wait for 5 seconds') }
        ]
      }
    }) %>
    <%= _.template($('#input_constructor').html())({
      description: tr('Custom service URL'),
      default_selector: 'string',
      disable_int: true,
      value_string: '',
      id: 'serviceUrl',
      help: {
        description: tr('Custom service URL. Can be blank'),
        examples: [
          { code: 'Empty string', description: tr('Use default service URL, http://rucaptcha.com for RuCaptcha, etc') },
          { code: 'http://127.0.0.1:8083', description: tr('Use custom service URL with port 8083') },
          { code: 'http://127.0.0.3:8080', description: tr('Use custom service URL with port 8080') },
        ]
      }
    }) %>
    <%= _.template($('#input_constructor').html())({
      value_string: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
      description: tr('User-Agent'),
      default_selector: 'string',
      disable_int: true,
      id: 'userAgent',
      help: { description: tr('User-Agent that will be used by the service for solving captcha.') }
    }) %>
  </span>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">This actions solves the <code>FunCaptcha</code>.</div>
  <div class="tr tooltip-paragraph-fold">The <code>FunCaptcha</code> is a captcha from ArkoseLabs. The most popular type of this captcha is the rotation of images with the arrows. To pass such a captcha, you need to put all the pictures in the correct position.</div>
  <div class="tr tooltip-paragraph-fold">All services requires a service key which which must be obtained on the service website and entered in the <code>Service key</code> field.</div>
  <div class="tr tooltip-paragraph-fold">All necessary data for the <code>FunCaptcha</code> solution is obtained automatically from the page source.</div>
  <div class="tr tooltip-paragraph-fold">The <code>Task solution check interval</code> parameter is responsible for the frequency of sending requests to the service to check the captcha solution. The more you set the value, the longer BAS will wait before sending the next request. It is recommended to use a delay of at least 5 seconds.</div>
  <div class="tr tooltip-paragraph-fold">The <code>Task solution check delay</code> parameter is responsible for the delay before starting to poll the service about receiving the captcha solution. Thus, the task is created first, after that the BAS will wait for the specified time and only then will it start receiving the captcha solution. Most services recommend waiting at least 5 seconds.</div>
  <div class="tr tooltip-paragraph-fold">You can use the current browser proxy by filling in the appropriate field. This is an optional parameter, but some sites may require matching IP addresses. When using a proxy always fill in the <code>User-Agent</code> field, otherwise the service may return an error.</div>
  <div class="tr tooltip-paragraph-fold">If the required service is not in the list of available ones, but it works through an API similar to the selected service, then you can specify required server URL in the <code>Custom service URL</code> field located in the additional settings.</div>
  <div class="tr tooltip-paragraph-fold">Also if you use programs such as <code>CapMonster</code>, <code>XEvil</code> or similar programs, you must fill in the <code>Custom service URL</code> field in accordance with the documentation for this software.</div>
  <div class="tr tooltip-paragraph-last-fold">Detailed documentation for solving <code>FunCaptcha</code> can be found <a href="#" class="tr" onclick="BrowserAutomationStudio_OpenUrl('https://2captcha.com/2captcha-api#solving_funcaptcha_new');return false">here</a>.</div>
</div>
<%= _.template($('#back').html())({ action: 'executeandadd', visible: true, name: tr('Solve FunCaptcha') }) %>