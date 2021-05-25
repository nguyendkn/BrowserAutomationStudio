<div class="container-fluid">
  <%= _.template($('#path').html())({ selector }) %>
  <%= _.template($('#input_constructor').html())({
    variants: [ 'AntiCaptcha', 'RuCaptcha', '2Captcha' ],
    description: tr('Service name'),
    value_string: 'AntiCaptcha',
    default_selector: 'string',
    disable_int: true,
    id: 'service',
    help: {
      description: tr('Captcha solving service name'),
      examples: [
        { code: 'AntiCaptcha', description: tr('Solve captcha using http://anti-captcha.com/ service') },
        { code: 'RuCaptcha', description: tr('Solve captcha using http://rucaptcha.com/ service') },
        { code: '2Captcha', description: tr('Solve captcha using http://2captcha.com/ service') }
      ]
    }
  }) %>
  <%= _.template($('#input_constructor').html())({
    help: { description: tr('Captcha solving service key. You can get it in your personal account of your service') },
    description: tr('Service key'),
    default_selector: 'string',
    disable_int: true,
    id: 'apiKey'
  }) %>
  <div style="margin-left: 20px;">
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
      value_number: 2 * 1000,
      disable_string: true,
      id: 'taskWaitInterval',
      help: {
        description: tr('Task solution check interval in milliseconds'),
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
        description: tr('Task solution check delay in milliseconds'),
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
      id: 'apiUrl',
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
	<div class="tr tooltip-paragraph-first-fold">Solve <code>FunCaptcha</code> using any available service.</div>
  <div class="tr tooltip-paragraph-fold">All services requires a service key which which must be obtained on the service website and entered in the <code>Service key</code> field.</div>
  <div class="tr tooltip-paragraph-fold">All necessary data for the <code>FunCaptcha</code> solution is obtained automatically from the page source.</div>
  <div class="tr tooltip-paragraph-fold">You can set the delay and interval for checking the task solution by filling in the appropriate fields. We recommend using the values that are described in the service documentation.</div>
  <div class="tr tooltip-paragraph-fold">You can use the current browser proxy by filling in the appropriate field. This is an optional parameter, but some sites may require matching IP addresses. When using a proxy always fill in the <code>User-Agent</code> field, otherwise the service may return an error.</div>
  <div class="tr tooltip-paragraph-last-fold">If you use programs such as <code>CapMonster</code>, <code>XEvil</code> or similar programs, you must fill in the <code>Custom service URL</code> field in accordance with the documentation for this software.</div>
</div>
<%= _.template($('#back').html())({ action: 'executeandadd', visible: true }) %>