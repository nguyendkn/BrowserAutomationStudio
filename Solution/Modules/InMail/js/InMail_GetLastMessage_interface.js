<div class="container-fluid">
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="getUid">
		<input type="checkbox" checked="checked" id="getUid" style="margin-left:25px"/> <label for="getUid" class="tr">Get message Id</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Get message Id"), description: tr("Get message Id")})) %>"></i>
	</span>
	<%= _.template($('#variable_constructor').html())({
		id: "saveUid",
		description: tr("Message Id"),
		default_variable: "MAIL_ID",
		help: {
			description: tr("Message Id")
		}
	}) %>
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
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="getFrom">
		<input type="checkbox" id="getFrom" style="margin-left:25px"/> <label for="getFrom" class="tr">Get sender of letter</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Get sender of letter"), description: tr("Get sender of letter")})) %>"></i>
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
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="getTo">
		<input type="checkbox" id="getTo" style="margin-left:25px"/> <label for="getTo" class="tr">Get recipient of letter</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Get recipient of letter"), description: tr("Get recipient of letter")})) %>"></i>
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
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="getSubject">
		<input type="checkbox" id="getSubject" style="margin-left:25px"/> <label for="getSubject" class="tr">Get letter subject</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Get letter subject"), description: tr("Get letter subject")})) %>"></i>
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
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="getTextHtml">
		<input type="checkbox" checked="checked" id="getTextHtml" style="margin-left:25px"/> <label for="getTextHtml"><span class="tr">Get body of letter</span> (text/html)</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("text/html"), description: tr("text/html")})) %>"></i>
	</span>
	<span id="advancedTextHtml">
		<%= _.template($('#variable_constructor').html())({
			id: "saveTextHtml",
			description: tr("Body of letter") + " (text/html)",
			default_variable: "MAIL_TEXT_HTML",
			help: {
				description: tr("Body of letter") + " (text/html)"
			}
		}) %>
		<div>
			<span data-preserve="true" data-preserve-type="check" data-preserve-id="getLinksTextHtml">
				<input type="checkbox" id="getLinksTextHtml" style="margin-left:25px"/> <label for="getLinksTextHtml"><span class="tr">Parse links from body of letter</span> (text/html)</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("text/html"), description: tr("text/html")})) %>"></i>
			</span>
			<span>
				<%= _.template($('#variable_constructor').html())({
					id: "saveLinksTextHtml",
					description: tr("Links from body of letter") + " (text/html)",
					default_variable: "MAIL_TEXT_HTML_LINKS_LIST",
					help: {
						description: tr("Links from body of letter") + " (text/html)"
					}
				}) %>
			</span>
		</div>
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
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="getTextPlain">
		<input type="checkbox" checked="checked" id="getTextPlain" style="margin-left:25px"/> <label for="getTextPlain"><span class="tr">Get body of letter</span> (text/plain)</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("text/plain"), description: tr("text/plain")})) %>"></i>
	</span>
	<span id="advancedTextPlain">
		<%= _.template($('#variable_constructor').html())({
			id: "saveTextPlain",
			description: tr("Body of letter") + " (text/plain)",
			default_variable: "MAIL_TEXT_PLAIN",
			help: {
				description: tr("Body of letter") + " (text/plain)"
			}
		}) %>
		<div>
			<span data-preserve="true" data-preserve-type="check" data-preserve-id="getLinksTextPlain">
				<input type="checkbox" id="getLinksTextPlain" style="margin-left:25px"/> <label for="getLinksTextPlain"><span class="tr">Parse links from body of letter</span> (text/plain)</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("text/plain"), description: tr("text/plain")})) %>"></i>
			</span>
			<span>
				<%= _.template($('#variable_constructor').html())({
					id: "saveLinksTextPlain",
					description: tr("Links from body of letter") + " (text/plain)",
					default_variable: "MAIL_TEXT_PLAIN_LINKS_LIST",
					help: {
						description: tr("Links from body of letter") + " (text/plain)"
					}
				}) %>
			</span>
		</div>
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
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="getTextRaw">
		<input type="checkbox" id="getTextRaw" style="margin-left:25px"/> <label for="getTextRaw"><span class="tr">Get body of letter</span> (raw)</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("raw"), description: tr("raw")})) %>"></i>
	</span>
	<span id="advancedTextRaw">
		<%= _.template($('#variable_constructor').html())({
			id: "saveTextRaw",
			description: tr("Body of letter") + " (raw)",
			default_variable: "MAIL_TEXT_RAW",
			help: {
				description: tr("Body of letter") + " (raw)"
			}
		}) %>
		<div>
			<span data-preserve="true" data-preserve-type="check" data-preserve-id="getLinksTextRaw">
				<input type="checkbox" id="getLinksTextRaw" style="margin-left:25px"/> <label for="getLinksTextRaw"><span class="tr">Parse links from body of letter</span> (raw)</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("raw"), description: tr("raw")})) %>"></i>
			</span>
			<span>
				<%= _.template($('#variable_constructor').html())({
					id: "saveLinksTextRaw",
					description: tr("Links from body of letter") + " (raw)",
					default_variable: "MAIL_TEXT_RAW_LINKS_LIST",
					help: {
						description: tr("Links from body of letter") + " (raw)"
					}
				}) %>
			</span>
		</div>
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
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="getSize">
		<input type="checkbox" id="getSize" style="margin-left:25px"/> <label for="getSize" class="tr">Get letter size</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Get letter size"), description: tr("Get letter size")})) %>"></i>
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
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="getFlags">
		<input type="checkbox" id="getFlags" style="margin-left:25px"/> <label for="getFlags" class="tr">Get flags of letter</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Get flags of letter"), description: tr("Get flags of letter")})) %>"></i>
	</span>
	<span id="advancedFlags">
		<%= _.template($('#variable_constructor').html())({
			id: "saveFlags",
			description: tr("Flags of letter"),
			default_variable: "MAIL_FLAGS",
			help: {
				description: tr("Flags of letter")
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
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="getDate">
		<input type="checkbox" id="getDate" style="margin-left:25px"/> <label for="getDate" class="tr">Get receiving date</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Get receiving date"), description: tr("Get receiving date")})) %>"></i>
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
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="getAttachNames">
		<input type="checkbox" id="getAttachNames" style="margin-left:25px"/> <label for="getAttachNames" class="tr">Get list of attached file names</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Get list of attached file names"), description: tr("Get list of attached file names")})) %>"></i>
	</span>
	<span id="advancedAttachnames">
		<%= _.template($('#variable_constructor').html())({
			id: "saveAttachnames",
			description: tr("Attachment names"),
			default_variable: "MAIL_ATTACHMENT_NAMES_LIST",
			help: {
				description: tr("Attachment names")
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
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="getAttachments">
		<input type="checkbox" id="getAttachments" style="margin-left:25px"/> <label for="getAttachments" class="tr">Save attached files</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Save attached files"), description: tr("Save attached files")})) %>"></i>
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
	<span data-preserve="true" data-preserve-type="check" data-preserve-id="getRawHeader">
		<input type="checkbox" id="getRawHeader" style="margin-left:25px"/> <label for="getRawHeader" class="tr">Get technical headers of letter</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Get technical headers of letter"), description: tr("Get technical headers of letter")})) %>"></i>
	</span>
	<span id="advancedRawHeader">
		<%= _.template($('#variable_constructor').html())({
			id: "saveRawHeader",
			description: tr("Technical headers of letter"),
			default_variable: "MAIL_RAW_HEADERS",
			help: {
				description: tr("Technical headers of letter")
			}
		}) %>
	</span>
	<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
		<span data-preserve="true" data-preserve-type="check" data-preserve-id="delAfter">
			<input type="checkbox" id="delAfter" style="margin-left:25px"/> <label for="delAfter" class="tr">Delete letter after receiving</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Delete letter after receiving"), description: tr("Delete letter after receiving")})) %>"></i>
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
		<span data-preserve="true" data-preserve-type="check" data-preserve-id="setFlagsAfter">
			<input type="checkbox" id="setFlagsAfter" style="margin-left:25px"/> <label for="setFlagsAfter" class="tr">Set flags after receiving</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Set flags after receiving"), description: tr("Set flags after receiving")})) %>"></i>
		</span>
		<span id="setFlagsSettings">
			<%= _.template($('#input_constructor').html())({
				id: "setFlags",
				description: tr("Flags"),
				default_selector: "string",
				variants: [
					{value: "\\Seen", description: tr("Message has been read")},
					{value: "\\Answered", description: tr("Message has been answered")},
					{value: "\\Flagged", description: tr("Message is \"flagged\" for urgent/special attention")},
					{value: "\\Deleted", description: tr("Message is marked for removal")},
					{value: "\\Draft", description: tr("Message has not completed composition (marked as a draft)")}
				],
				disable_int: true,
				value_string: "",
				help: {
					description: tr("List or one flag.") + " " + tr("As a list, you can use a string consisting of column names, separated by commas.") + " " + tr("The possible flags may differ depending on the server implementation."),
					examples: [
						{code: "\\Seen", description: tr("Message has been read")},
						{code: "\\Answered", description: tr("Message has been answered")},
						{code: "\\Flagged", description: tr("Message is \"flagged\" for urgent/special attention")},
						{code: "\\Deleted", description: tr("Message is marked for removal")},
						{code: "\\Draft", description: tr("Message has not completed composition (marked as a draft)")}
					]
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
				description: tr("Optional parameter.") + " " + tr("Folder name")
			}
		}) %>
	<%= _.template($('#block_end').html())() %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get the content of the last letter in the specified folder.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
<script>

		$(document).ready(function(){
			setTimeout(function(){
				let switchField = function(e){
					let target = e.target ? $(e.target) : e;
					if(target.length){
						let id = target.prop("id");
						let disable = !target.is(':checked');
						let next = target.closest('span').next();
						if(id.startsWith('getLinks') || id.startsWith('setFlags')){
							if(disable){
								next.hide();
							}else{
								next.show();
							};
						}else{
							next.find('input').prop('disabled', disable);
						};
						if(id.startsWith('getText')){
							let children = next.children('div');
							if(disable){
								children.hide();
							}else{
								children.show();
							};
						};
					};
				};
				let ids = ['getUid','getFrom','getTo','getSubject','getTextHtml','getLinksTextHtml','getTextPlain','getLinksTextPlain','getTextRaw','getLinksTextRaw','getSize','getFlags','getDate','getAttachNames','getAttachments','getRawHeader','setFlagsAfter'];
				ids.forEach(function(id){
					let ell = $('#' + id);
					if(ell.length){
						ell.on('change', switchField);
						switchField(ell);
					};
				});
			}, 0);
		});

</script>
