<div class="container-fluid">
  <%= _.template($('#path').html())({ selector }) %>
  <%= _.template($('#input_constructor').html())({
    variants: [ "anticaptcha", "rucaptcha", "2captcha" ],
    description: tr("Solve Method"),
    value_string: "anticaptcha",
    default_selector: "string",
    disable_int: true,
    id: "Service",
    size: 3,
    help: {
      description: tr(""),
      examples: [
        {
          code: "anticaptcha",
          description: tr("Solve with http://anti-captcha.com/ service")
        },
        {
          code: "rucaptcha",
          description: tr("Solve with http://rucaptcha.com/ service")
        },
        {
          code: "2captcha",
          description: tr("Solve with http://2captcha.com/ service")
        }
      ]
    }
  }) %>
  <%= _.template($('#input_constructor').html())({
    description: tr("Service Api Key"),
    default_selector: "string",
    disable_int: true,
    id: "ApiKey",
    help: {
      description: tr("")
    }
  }) %>
  <div style="margin-left: 20px;">
    <input type="checkbox" id="AdvancedCheck" onchange="$('#Advanced').toggle()" />
    <label for="AdvancedCheck" class="tr">Advanced settings.</label>
  </div>
  <span id="Advanced" style="display: none;">
    <%= _.template($('#input_constructor').html())({
      description: tr("How many times try to solve"),
      default_selector: "int",
      disable_string: true,
      id: "TimesToSolve",
      value_number: 10,
      size: 3,
      help: {
        description: tr("")
      }
    }) %>
    <%= _.template($('#input_constructor').html())({
      description: tr("Server url. Can be blank"),
      default_selector: "string",
      disable_int: true,
      id: "ServerUrl",
      help: {
        description: tr("String which contains server url."), 
        examples: [
          { code: tr("Empty string"), description: tr("Use default server url, http://rucaptcha.com for rucaptcha, etc") },
          { code: "http://127.0.0.3:8083/" },
          { code: "http://127.0.0.1:8888/" },
        ]
      }
    }) %>
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
  </span>
</div>

<div class="tooltipinternal">

</div>

<%= _.template($('#back').html())({ action: "executeandadd", visible: true }) %>