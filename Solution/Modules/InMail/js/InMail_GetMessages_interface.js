<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({
		id: "uids",
		description: tr("Message Id"),
		default_selector: "string",
		value_string: "",
		help: {
			description: tr("Message Id")
		}
	}) %>
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="from">
		<input type="checkbox" id="from" style="margin-left:25px"/> <label for="from" class="tr">Sender of letter</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Sender of letter"), description: tr("Sender of letter")})) %>"></i>
	</span>
	<span id="advancedFrom">
		<%= _.template($('#variable_constructor').html())({
			id: "saveFrom",
			description: tr("Sender of letter"),
			default_variable: "MAIL_SENDER",
			help: {
				description: tr("Sender of letter")
			}
		}) %>
	</span>
	<div class="container-fluid">
		<div class="col-xs-12">
			<form class="form-horizontal">
				<div class="form-group">
					<div class="col-xs-12">
						<hr style="margin-top:0px;margin-bottom:0px"/>
					</div>
				</div>
			</form>
		</div>
	</div>
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="to">
		<input type="checkbox" id="to" style="margin-left:25px"/> <label for="to" class="tr">Recipient of letter</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Recipient of letter"), description: tr("Recipient of letter")})) %>"></i>
	</span>
	<span id="advancedTo">
		<%= _.template($('#variable_constructor').html())({
			id: "saveTo",
			description: tr("Recipient of letter"),
			default_variable: "MAIL_RECIPIENT",
			help: {
				description: tr("Recipient of letter")
			}
		}) %>
	</span>
	<div class="container-fluid">
		<div class="col-xs-12">
			<form class="form-horizontal">
				<div class="form-group">
					<div class="col-xs-12">
						<hr style="margin-top:0px;margin-bottom:0px"/>
					</div>
				</div>
			</form>
		</div>
	</div>
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="subject">
		<input type="checkbox" id="subject" style="margin-left:25px"/> <label for="subject" class="tr">Letter subject</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Letter subject"), description: tr("Letter subject")})) %>"></i>
	</span>
	<span id="advancedSubject">
		<%= _.template($('#variable_constructor').html())({
			id: "saveSubject",
			description: tr("Letter subject"),
			default_variable: "MAIL_SUBJECT",
			help: {
				description: tr("Letter subject")
			}
		}) %>
	</span>
	<div class="container-fluid">
		<div class="col-xs-12">
			<form class="form-horizontal">
				<div class="form-group">
					<div class="col-xs-12">
						<hr style="margin-top:0px;margin-bottom:0px"/>
					</div>
				</div>
			</form>
		</div>
	</div>
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="textHtml">
		<input type="checkbox" checked="checked" id="textHtml" style="margin-left:25px"/> <label for="textHtml"><span class="tr">Text of letter</span> (text/html)</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("text/html"), description: tr("text/html")})) %>"></i>
	</span>
	<span id="advancedTextHtml">
		<%= _.template($('#variable_constructor').html())({
			id: "saveTextHtml",
			description: tr("Text of letter") + " (text/html)",
			default_variable: "MAIL_TEXT_HTML",
			help: {
				description: tr("Text of letter") + " (text/html)"
			}
		}) %>
	</span>
	<div class="container-fluid">
		<div class="col-xs-12">
			<form class="form-horizontal">
				<div class="form-group">
					<div class="col-xs-12">
						<hr style="margin-top:0px;margin-bottom:0px"/>
					</div>
				</div>
			</form>
		</div>
	</div>
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="textPlain">
		<input type="checkbox" checked="checked" id="textPlain" style="margin-left:25px"/> <label for="textPlain"><span class="tr">Text of letter</span> (text/plain)</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("text/plain"), description: tr("text/plain")})) %>"></i>
	</span>
	<span id="advancedTextPlain">
		<%= _.template($('#variable_constructor').html())({
			id: "saveTextPlain",
			description: tr("Text of letter") + " (text/plain)",
			default_variable: "MAIL_TEXT_PLAIN",
			help: {
				description: tr("Text of letter") + " (text/plain)"
			}
		}) %>
	</span>
	<div class="container-fluid">
		<div class="col-xs-12">
			<form class="form-horizontal">
				<div class="form-group">
					<div class="col-xs-12">
						<hr style="margin-top:0px;margin-bottom:0px"/>
					</div>
				</div>
			</form>
		</div>
	</div>
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="textRaw">
		<input type="checkbox" id="textRaw" style="margin-left:25px"/> <label for="textRaw"><span class="tr">Text of letter</span> (raw)</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("raw"), description: tr("raw")})) %>"></i>
	</span>
	<span id="advancedText">
		<%= _.template($('#variable_constructor').html())({
			id: "saveTextRaw",
			description: tr("Text of letter") + " (raw)",
			default_variable: "MAIL_TEXT_RAW",
			help: {
				description: tr("Text of letter") + " (raw)"
			}
		}) %>
	</span>
	<div class="container-fluid">
		<div class="col-xs-12">
			<form class="form-horizontal">
				<div class="form-group">
					<div class="col-xs-12">
						<hr style="margin-top:0px;margin-bottom:0px"/>
					</div>
				</div>
			</form>
		</div>
	</div>
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="size">
		<input type="checkbox" id="size" style="margin-left:25px"/> <label for="size" class="tr">Letter size</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Letter size"), description: tr("Letter size")})) %>"></i>
	</span>
	<span id="advancedSize">
		<%= _.template($('#variable_constructor').html())({
			id: "saveSize",
			description: tr("Letter size"),
			default_variable: "MAIL_SIZE",
			help: {
				description: tr("Letter size")
			}
		}) %>
	</span>
	<div class="container-fluid">
		<div class="col-xs-12">
			<form class="form-horizontal">
				<div class="form-group">
					<div class="col-xs-12">
						<hr style="margin-top:0px;margin-bottom:0px"/>
					</div>
				</div>
			</form>
		</div>
	</div>
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="flags">
		<input type="checkbox" id="flags" style="margin-left:25px"/> <label for="flags" class="tr">Letter flags</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Letter flags"), description: tr("Letter flags")})) %>"></i>
	</span>
	<span id="advancedFlags">
		<%= _.template($('#variable_constructor').html())({
			id: "saveFlags",
			description: tr("Letter flags"),
			default_variable: "MAIL_FLAGS",
			help: {
				description: tr("Letter flags")
			}
		}) %>
	</span>
	<div class="container-fluid">
		<div class="col-xs-12">
			<form class="form-horizontal">
				<div class="form-group">
					<div class="col-xs-12">
						<hr style="margin-top:0px;margin-bottom:0px"/>
					</div>
				</div>
			</form>
		</div>
	</div>
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="date">
		<input type="checkbox" id="date" style="margin-left:25px"/> <label for="date" class="tr">Receiving date</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Receiving date"), description: tr("Receiving date")})) %>"></i>
	</span>
	<span id="advancedDate">
		<%= _.template($('#variable_constructor').html())({
			id: "saveDate",
			description: tr("Receiving date"),
			default_variable: "MAIL_DATE",
			help: {
				description: tr("Receiving date")
			}
		}) %>
	</span>
	<div class="container-fluid">
		<div class="col-xs-12">
			<form class="form-horizontal">
				<div class="form-group">
					<div class="col-xs-12">
						<hr style="margin-top:0px;margin-bottom:0px"/>
					</div>
				</div>
			</form>
		</div>
	</div>
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="attachnames">
		<input type="checkbox" id="attachnames" style="margin-left:25px"/> <label for="attachnames" class="tr">Get list of attached file names</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Get list of attached file names"), description: tr("Get list of attached file names")})) %>"></i>
	</span>
	<span id="advancedAttachnames">
		<%= _.template($('#variable_constructor').html())({
			id: "saveAttachnames",
			description: tr("Attachments names"),
			default_variable: "MAIL_ATTACHMENTS_NAMES_LIST",
			help: {
				description: tr("Attachments names")
			}
		}) %>
	</span>
	<div class="container-fluid">
		<div class="col-xs-12">
			<form class="form-horizontal">
				<div class="form-group">
					<div class="col-xs-12">
						<hr style="margin-top:0px;margin-bottom:0px"/>
					</div>
				</div>
			</form>
		</div>
	</div>
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="attachments">
		<input type="checkbox" id="attachments" style="margin-left:25px"/> <label for="attachments" class="tr">Save attached files</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Save attached files"), description: tr("Save attached files")})) %>"></i>
	</span>
	<span id="advancedAttachments">
		<%= _.template($('#input_constructor').html())({
			id: "attachmentsMask",
			description: tr("File name mask"),
			default_selector: "string",
			disable_int: true,
			value_string: "*",
			help: {
				description: tr("File name mask")
			}
		}) %>
		<%= _.template($('#variable_constructor').html())({
			id: "saveAttachments",
			description: tr("Attachments"),
			default_variable: "MAIL_ATTACHMENTS",
			help: {
				description: tr("Attachments")
			}
		}) %>
	</span>
	<div class="container-fluid">
		<div class="col-xs-12">
			<form class="form-horizontal">
				<div class="form-group">
					<div class="col-xs-12">
						<hr style="margin-top:0px;margin-bottom:0px"/>
					</div>
				</div>
			</form>
		</div>
	</div>
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="rawHeader">
		<input type="checkbox" id="rawHeader" style="margin-left:25px"/> <label for="rawHeader" class="tr">Technical mail headers</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Technical mail headers"), description: tr("Technical mail headers")})) %>"></i>
	</span>
	<span id="advancedRawHeader">
		<%= _.template($('#variable_constructor').html())({
			id: "saveRawHeader",
			description: tr("Technical mail headers"),
			default_variable: "MAIL_RAW_HEADERS",
			help: {
				description: tr("Technical mail headers")
			}
		}) %>
	</span>
	<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
		<span data-preserve="true" data-preserve-type="check" data-preserve-id="markSeen">
			<input type="checkbox" id="markSeen" style="margin-left:25px"/> <label for="markSeen" class="tr">Mark message as read when fetched</label>
		</span>
		<%= _.template($('#input_constructor').html())({
			id: "box",
			description: tr("Folder name"),
			default_selector: "string",
			variants: [
				{value: "INBOX", description: tr("Default folder incoming messages")}
			],
			disable_int: true,
			value_string: "",
			help: {
				description: tr("Folder name")
			}
		}) %>
	<%= _.template($('#block_end').html())() %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get mail with the specified identifier.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
<script>
		
		function switchField(e){
			var target = (e.target || e);
			var next = target.closest('span').nextElementSibling;
			for(var ell of next.getElementsByTagName('input')){
				ell.disabled = !target.checked;
			};
		};
		
		var ells = ['from','to','subject','textPlain','textHtml','textRaw','size','flags','date','attachnames','attachments','rawHeader'];
		
		$(document).ready(function(){
			setTimeout(function(){
				ells.forEach(function(ell){
					switchField(document.getElementById(ell));
				});
			}, 0);
        });
		
		ells.forEach(function(ell){
			document.getElementById(ell).addEventListener('change', switchField);
		});

</script>
