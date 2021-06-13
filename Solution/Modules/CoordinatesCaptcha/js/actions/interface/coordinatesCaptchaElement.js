<div class="container-fluid">
  <%= _.template($('#path').html())({ selector }) %>
  <%= _.template($('#input_constructor').html())({ id: 'serviceName', description: tr('Service name'), variants: [ 'rucaptcha', '2captcha' ], value_string: 'rucaptcha', default_selector: 'string', disable_int: true, help: {
    description: tr('Captcha solving service name'),
    examples: [
      { code: 'rucaptcha', description: tr('Solve captcha using https://rucaptcha.com/ service') },
      { code: '2captcha', description: tr('Solve captcha using https://2captcha.com/ service') },
    ]
  }}) %>
  <%= _.template($('#input_constructor').html())({ description: tr('Text with instructions'), value_string: '', default_selector: 'string', disable_int: true, id: 'textInstructions', help: {
    description: tr('Text with instructions for solving captcha. Optional if the image already has instructions.'),
    examples: [
      { code: tr('Select all images where there is a plane') },
      { code: tr('Select all images where there is a boat') }
    ]
  }}) %>
  <%= _.template($('#input_constructor').html())({ id: 'serviceKey', description: tr('Service key'), disable_int: true, default_selector: 'string', help: { description: tr('Captcha solving service key. You can get it in your personal account of your service') } }) %>
  <div style="margin-left: 15px">
    <input type="checkbox" id="AdvancedCheck" onchange="$('#Advanced').toggle()" />
    <label for="AdvancedCheck" class="tr">Advanced settings.</label>
  </div>
  <div id="Advanced" style="display: none;">
    <%= _.template($('#input_constructor').html())({ description: tr('Task solution check interval'), default_selector: 'int', value_number: 5000, disable_string: true, id: 'taskWaitTimeout', help: {
      description: tr('Task solution check interval in milliseconds'),
      examples: [
        { code: '600', description: tr('Wait for 600 milliseconds') },
        { code: '10000', description: tr('Wait for 10 seconds') },
        { code: '5000', description: tr('Wait for 5 seconds') }
      ]
    }}) %>
    <%= _.template($('#input_constructor').html())({ description: tr('Task solution check delay'), default_selector: 'int', value_number: 5000, disable_string: true, id: 'taskWaitDelay', help: {
      description: tr('Task solution check delay in milliseconds'),
      examples: [
        { code: '600', description: tr('Wait for 600 milliseconds') },
        { code: '10000', description: tr('Wait for 10 seconds') },
        { code: '5000', description: tr('Wait for 5 seconds') }
      ]
    }}) %>
    <%= _.template($('#input_constructor').html())({ description: tr('Custom service URL'), default_selector: 'string', disable_int: true, value_string: '', id: 'serviceUrl', help: {
      description: tr('Custom service URL. Can be blank'),
      examples: [
        { code: 'Empty string', description: tr('Use default service URL, http://rucaptcha.com for RuCaptcha, etc') },
        { code: 'http://127.0.0.1:8083', description: tr('Use custom service URL with port 8083') },
        { code: 'http://127.0.0.3:8080', description: tr('Use custom service URL with port 8080') },
      ]
    }}) %>
  </div>
</div>
<div class="tooltipinternal">
  <div class="tr tooltip-paragraph-first-fold">Solve <code>CoordinatesCaptcha</code>.</div>
  <div class="tr tooltip-paragraph-fold">All services requires a service key which which must be obtained on the service website and entered in the <code>Service key</code> field.</div>
  <div class="tr tooltip-paragraph-fold">This action allows you to solve any captcha that requires you to click on the images according to certain instructions. This can be ReCaptcha, HCaptcha, and other types. To solve such captcha, you must alternately click on the coordinates obtained after the solution.</div>
  <div class="tr tooltip-paragraph-fold">This action, unlike the similar one from the <code>Browser</code> module, performs clicks automatically, and you do not need to manually calculate the coordinates for clicks relative to the position of the element on the page. It is recommended to use this action.</div>
  <div class="tr tooltip-paragraph-fold">You can set the delay and interval for checking the task solution by filling in the appropriate fields. We recommend using the values that are described in the service documentation.</div>
  <div class="tr tooltip-paragraph-fold">The <code>Task solution check interval</code> parameter is responsible for the frequency of sending requests to the service to check the captcha solution. The more you set the value, the longer BAS will wait before sending the next request. It is recommended to use a delay of at least 5 seconds.</div>
  <div class="tr tooltip-paragraph-fold">The <code>Task solution check delay</code> parameter is responsible for the delay before starting to poll the service about receiving the captcha solution. Thus, the task is created first, after that the BAS will wait for the specified time and only then will it start receiving the captcha solution. Most services recommend waiting at least 5 seconds.</div>
  <div class="tr tooltip-paragraph-fold">If the required service is not in the list of available ones, but it works through an API similar to the selected service, then you can specify required server URL in the <code>Custom service URL</code> field located in the additional settings.</div>
  <div class="tr tooltip-paragraph-fold">Also if you use programs such as <code>CapMonster</code>, <code>XEvil</code> or similar programs, you must fill in the <code>Custom service URL</code> field in accordance with the documentation for this software.</div>
  <div class="tr tooltip-paragraph-last-fold">Detailed documentation for solving <code>CoordinatesCaptcha</code> can be found <a href="#" class="tr" onclick="BrowserAutomationStudio_OpenUrl('https://2captcha.com/2captcha-api#coordinates');return false">here</a>.</div>
</div>
<%= _.template($('#back').html())({ action: 'executeandadd', visible: true, name: tr('Solve CoordinatesCaptcha') }) %>