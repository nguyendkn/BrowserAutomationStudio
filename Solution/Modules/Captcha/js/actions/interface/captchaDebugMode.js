<div class="container-fluid">
  <%= _.template($('#input_constructor').html())({
    description: tr('Captcha debug mode'),
    variants: ['disable', 'enable'],
    default_selector: 'string',
    value_string: 'disable',
    disable_int: true,
    id: 'enable', 
    help: {
      examples: [
        {code: 'disable', description: tr('Disable debug mode') },
        {code: 'enable', description: tr('Enable debug mode') },
      ],
      description: tr('Enable or disable debug mode')
    }
  }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Enable or disable Captcha module debug mode.</div>
</div>
<%= _.template($('#back').html())({ action: 'executeandadd', visible: true }) %>