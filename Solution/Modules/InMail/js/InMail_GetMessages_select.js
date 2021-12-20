var uids = GetInputConstructorValue("uids", loader);
if(uids["original"].length == 0){
    Invalid(tr("The parameter \"") + tr("Message Id") + tr("\" is not specified"));
    return;
};
var from = $("#from").is(':checked');
var saveFrom = this.$el.find("#saveFrom").val().toUpperCase();
if(from && saveFrom.length == 0){
	Invalid(tr("The parameter \"") + tr("Variable") + " -> " + tr("Recipient of letter") + tr("\" is not specified"));
    return;
};
var to = $("#to").is(':checked');
var saveTo = this.$el.find("#saveTo").val().toUpperCase();
if(to && saveTo.length == 0){
	Invalid(tr("The parameter \"") + tr("Variable") + " -> " + tr("Recipient of letter") + tr("\" is not specified"));
    return;
};
var subject = $("#subject").is(':checked');
var saveSubject = this.$el.find("#saveSubject").val().toUpperCase();
if(subject && saveSubject.length == 0){
	Invalid(tr("The parameter \"") + tr("Variable") + " -> " + tr("Letter subject") + tr("\" is not specified"));
    return;
};
var text = $("#text").is(':checked');
var saveText = this.$el.find("#saveText").val().toUpperCase();
if(text && saveText.length == 0){
	Invalid(tr("The parameter \"") + tr("Variable") + " -> " + tr("Text of letter") + tr("\" is not specified"));
    return;
};
var size = $("#size").is(':checked');
var saveSize = this.$el.find("#saveSize").val().toUpperCase();
if(size && saveSize.length == 0){
	Invalid(tr("The parameter \"") + tr("Variable") + " -> " + tr("Letter size") + tr("\" is not specified"));
    return;
};
var flags = $("#flags").is(':checked');
var saveFlags = this.$el.find("#saveFlags").val().toUpperCase();
if(flags && saveFlags.length == 0){
	Invalid(tr("The parameter \"") + tr("Variable") + " -> " + tr("Letter flags") + tr("\" is not specified"));
    return;
};
var date = $("#date").is(':checked');
var saveDate = this.$el.find("#saveDate").val().toUpperCase();
if(date && saveDate.length == 0){
	Invalid(tr("The parameter \"") + tr("Variable") + " -> " + tr("Receiving date") + tr("\" is not specified"));
    return;
};
var attachments = $("#attachments").is(':checked');
var attachmentsMask = GetInputConstructorValue("attachmentsMask", loader);
var saveAttachments = this.$el.find("#saveAttachments").val().toUpperCase();
if(attachments && saveAttachments.length == 0){
	Invalid(tr("The parameter \"") + tr("Variable") + " -> " + tr("Attachments") + tr("\" is not specified"));
    return;
};
var markSeen = $("#markSeen").is(':checked');
var box = GetInputConstructorValue("box", loader);
try{
    var code = loader.GetAdditionalData() + _.template($("#InMail_GetMessages_code").html())({
        "uids": uids["updated"],
		"from": from,
        "saveFrom": "VAR_" + saveFrom,
		"to": to,
        "saveTo": "VAR_" + saveTo,
		"subject": subject,
        "saveSubject": "VAR_" + saveSubject,
		"headers": [],
		"text": text,
        "saveText": "VAR_" + saveText,
		"size": size,
        "saveSize": "VAR_" + saveSize,
		"flags": flags,
        "saveFlags": "VAR_" + saveFlags,
        "date": date,
        "saveDate": "VAR_" + saveDate,
        "attachments": attachments,
        "attachmentsMask": attachmentsMask["updated"],
        "saveAttachments": "VAR_" + saveAttachments,
        "markSeen": markSeen,
        "box": box["updated"]
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}
