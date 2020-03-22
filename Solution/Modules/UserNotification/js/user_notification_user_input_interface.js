<div class="container-fluid">
    <%= _.template($('#input_constructor').html())({id:"Label", description:tr("Label which is shown to user"), default_selector: "string", help: 
{
	description: tr("A text, which will be displayed to user together with input field. This text should explain what user needs to input.")
}}) %>
    <%= _.template($('#variable_constructor').html())({id:"Variable", description:tr("Variable to save input"), default_variable: "USER_INPUT", help: 
{
	description: tr("Result, which was entered by user in user input field.")
}}) %>
</div>
<div class="tooltipinternal">
      <div class="tooltip-paragraph-first-fold"><span class="tr">Show user input field to user, wait until user will enter some value, save that value into variable</span>

      ( <a href="#" class="tr" onclick="BrowserAutomationStudio_OpenUrl('https://wiki.bablosoft.com/lib/exe/fetch.php?cache=&media=captchauserinput.png');return false">screen</a> ).</div>
      <div class="tr tooltip-paragraph-fold">This action works like captcha, but instead of image, specified text is shown.</div>
      <div class="tr tooltip-paragraph-fold">This action has no timeout and will last until user won't enter something.</div>
      <div class="tr tooltip-paragraph-fold">User can input either some text, either cancel input. In first case action will return user input into variable, in second case thread will finish with error. You can avoid finishing thread by using 'Ignore Errors' action.</div>
      <div class="tr tooltip-paragraph-last-fold">If you want to get user input before script starts, or craft enhanced user interface, then it is better to user resource system.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
