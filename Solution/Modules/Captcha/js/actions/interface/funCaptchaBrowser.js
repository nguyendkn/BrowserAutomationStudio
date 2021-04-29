<div class="container-fluid">
  <%= _.template($('#path').html())({ selector }) %>
  <%= _.template($('#input_constructor').html())({
    variants: [ "anticaptcha", "rucaptcha", "2captcha" ],
    description: tr("Solve Serivce"),
    value_string: "anticaptcha",
    default_selector: "string",
    disable_int: true,
    id: "Service",
    help: {
      description: tr("Captcha solving service"),
      examples: [
        { code: "anticaptcha", description: tr("Solve with http://anti-captcha.com/ service") },
        { code: "rucaptcha", description: tr("Solve with http://rucaptcha.com/ service") },
        { code: "2captcha", description: tr("Solve with http://2captcha.com/ service") }
      ]
    }
  }) %>
  <%= _.template($('#input_constructor').html())({
    help: { description: tr("Captcha solving service API key") },
    description: tr("Service Api Key"),
    default_selector: "string",
    disable_int: true,
    id: "ApiKey"
  }) %>
  <div style="margin-left: 20px;">
    <input type="checkbox" id="AdvancedCheck" onchange="$('#Advanced').toggle()" />
    <label for="AdvancedCheck" class="tr">Advanced settings.</label>
  </div>
  <span id="Advanced" style="display: none;">
    <%= _.template($('#input_constructor').html())({
      description: tr("Send current proxy to solver service"),
      variants: [ "true", "false" ],
      default_selector: "string",
      value_string: "false",
      disable_int: true,
      id: "SendProxy",
      help: {
        description: tr("Forces person who solves recaptcha use proxy that you setted up with \"Proxy\" action."),
        examples: [
          { code: "false", description: tr("Don't send proxy to service. Default value.") },
          { code: "true", description: tr("Send proxy to service") },
        ]
      }
    }) %>
    <%= _.template($('#input_constructor').html())({
      description: tr('Task solution check interval'),
      default_selector: 'int',
      disable_string: true,
      value_number: 2000,
      id: 'TaskWaitInterval',
      help: { description: tr('') }
    }) %>
    <%= _.template($('#input_constructor').html())({
      description: tr('Task solution check delay'),
      default_selector: 'int',
      disable_string: true,
      value_number: 5000,
      id: 'TaskWaitDelay',
      help: { description: tr('') }
    }) %>
  </span>
</div>
<%= _.template($('#back').html())({ action: "executeandadd", visible: true }) %>