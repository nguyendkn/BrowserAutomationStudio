<div class="container-fluid">
  <%= _.template($('#path').html())({ selector }) %>
  <%= _.template($('#input_constructor').html())({
    variants: [ 'anticaptcha', 'rucaptcha', '2captcha' ],
    description: tr('Service name'),
    value_string: 'anticaptcha',
    default_selector: 'string',
    disable_int: true,
    id: 'service',
    help: {
      description: tr('Captcha solving service'),
      examples: [
        { code: 'anticaptcha', description: tr('Solve with http://anti-captcha.com/ service') },
        { code: 'rucaptcha', description: tr('Solve with http://rucaptcha.com/ service') },
        { code: '2captcha', description: tr('Solve with http://2captcha.com/ service') }
      ]
    }
  }) %>
  <%= _.template($('#input_constructor').html())({
    help: { description: tr('Captcha solving service API key') },
    description: tr('Service API key'),
    default_selector: 'string',
    disable_int: true,
    id: 'apiKey'
  }) %>
  <%= _.template($('#input_constructor').html())({
    help: { description: tr('Address of the page where the captcha is being solved') },
    description: tr('Page url'),
    default_selector: 'string',
    disable_int: true,
    id: 'pageUrl'
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
          { code: 'false', description: tr('Don\'t send proxy to service. Default value.') },
          { code: 'true', description: tr('Send proxy to service') },
        ]
      }
    }) %>
    <%= _.template($('#input_constructor').html())({
      value_string: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
      description: tr('User Agent'),
      default_selector: 'string',
      disable_int: true,
      id: 'userAgent',
      help: { description: tr('User-Agent that will be used by the service for solving captchas.') }
    }) %>
    <%= _.template($('#input_constructor').html())({
      description: tr('Custom service api url'),
      default_selector: 'string',
      disable_int: true,
      value_string: '',
      id: 'apiUrl',
      help: { description: tr('') }
    }) %>
    <%= _.template($('#input_constructor').html())({
      description: tr('Task solution check interval'),
      default_selector: 'int',
      disable_string: true,
      value_number: 2000,
      id: 'taskWaitInterval',
      help: {
        description: tr('Task solution check interval in milliseconds'),
        examples: [
          { code: '5000', description: tr('Wait for 5 seconds.') },
          { code: '0', description: tr('Disable interval') },
        ]
      }
    }) %>
    <%= _.template($('#input_constructor').html())({
      description: tr('Task solution check delay'),
      default_selector: 'int',
      disable_string: true,
      value_number: 5000,
      id: 'taskWaitDelay',
      help: {
        description: tr('Task solution check delay in milliseconds'),
        examples: [
          { code: '5000', description: tr('Wait for 5 seconds.') },
          { code: '0', description: tr('Disable delay') },
        ]
      }
    }) %>
  </span>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Solve FunCaptcha using any available service.</div>
  <div class="tr tooltip-paragraph-fold">This action solves captcha using the browser.</div>
</div>
<%= _.template($('#back').html())({ action: 'executeandadd', visible: true }) %>