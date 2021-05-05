<div class="container-fluid">
  <%= _.template($('#input_constructor').html())({
    variants: [ 'anticaptcha', 'rucaptcha', '2captcha' ],
    description: tr('Solve Serivce'),
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
    description: tr('Service Api Key'),
    default_selector: 'string',
    disable_int: true,
    id: 'apiKey'
  }) %>
  <div style="margin-left: 20px;">
    <input type="checkbox" id="AdvancedCheck" onchange="$('#Advanced').toggle()" />
    <label for="AdvancedCheck" class="tr">Advanced settings.</label>
  </div>
  <span id="Advanced" style="display: none;">
    <%= _.template($('#input_constructor').html())({id:"proxyText", description:tr("Proxy String"), default_selector: "string", disable_int:true, help: {description: tr("String with information about proxy. It may contain ip, port, proxy type in different formats. This string may also contain login and password, if it doesn't, auth can be set with \"Proxy Login\" and \"Proxy Password\" parameters."), examples:[{code:"210.10.10.10:1085"},{code:"username:password@210.10.10.10:1085"},{code:"socks5://210.10.10.10:1085"},{code:"socks:210.10.10.10:1085:username:password"},{code:"http:username:password:210.10.10.10:1085"},{code:"{{proxy}}", description: tr("Get from resource")},{code:tr("Empty string"),description:tr("Without proxy")}]}}) %>
		<%= _.template($('#input_constructor').html())({id:"proxyType", description:tr("Proxy Type"), default_selector: "string", disable_int:true, value_string: "http", variants: ["http","socks5","auto"], help: {description: tr("socks5 and http proxy types are supported."), examples:[{code:"socks"},{code:"socks5",description:tr("Same as socks")},{code:"http"},{code:"https",description:tr("Same as http")}]}}) %>
		<%= _.template($('#input_constructor').html())({id:"proxyLogin", description:tr("Proxy Login. Can be blank."), default_selector: "string", disable_int:true, help: {description: tr("Proxy login, overrides login set in proxy string. Useful if you have many proxy with same login and password.")}}) %>
		<%= _.template($('#input_constructor').html())({id:"proxyPassword", description:tr("Proxy password. Can be blank."), default_selector: "string", disable_int:true, help: {description: tr("Proxy password, overrides password set in proxy string. Useful if you have many proxy with same login and password.")}}) %>
    <%= _.template($('#input_constructor').html())({
      description: tr('User Agent'),
      default_selector: 'string',
      disable_int: true,
      value_string: '',
      id: 'userAgent',
      help: { description: tr('') }
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
  <div class="tr tooltip-paragraph-fold">This action solves captcha without the browser.</div>
</div>
<%= _.template($('#back').html())({ action: 'executeandadd', visible: true }) %>