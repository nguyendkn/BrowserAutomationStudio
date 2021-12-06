<div class="container-fluid">
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check">
		<input type="checkbox" id="Check" style="margin-left:25px"/> <label for="Check" class="tr">Add number of letters</label>
	</span>
	<%= _.template($('#variable_constructor').html())({
		id: "Save",
		description: tr("Variable to save the result"),
		default_variable: "MAIL_FOLDERS_INFO",
		help: {
			description: tr("Variable in which, after successful execution of the action, the information about the folders will be written.")
		}
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get information about folders in a specified mailbox.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
