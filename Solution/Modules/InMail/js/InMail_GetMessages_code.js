<% body = [['html', textHtml], ['plain', textPlain], ['raw', textRaw]].filter(function(el){return el[1]}) %>
<% headers = [['from', from], ['to', to], ['subject', subject], ['raw', rawHeader]].filter(function(el){return el[1]}) %>
_call_function(_InMail.getMessages, {uids: (<%= uids %>)<%if(body.length){%>, body: ([<%= body.map(function(el){return "'" + el[0] + "'"}).join(', ') %>])<%}%><%if(headers.length){%>, headers: ([<%= headers.map(function(el){return "'" + el[0] + "'"}).join(', ') %>])<%}%><%if(size){%>, size: (<%= size %>)<%}%><%if(attachments){%>, attachments: (<%= attachmentsMask %>)<%}%><%if(markSeen){%>, markSeen: (<%= markSeen %>)<%}%><%if(box!=='""'){%>, box: (<%= box %>)<%}%>})!
var messageData = _result_function()[0];
<%if(from){%><%= saveFrom %> = messageData["headers"]["from"];<%}%>
<%if(to){%><%= saveTo %> = messageData["headers"]["to"];<%}%>
<%if(subject){%><%= saveSubject %> = messageData["headers"]["subject"];<%}%>
<%if(rawHeader){%><%= saveRawHeader %> = messageData["headers"]["raw"];<%}%>
<%if(textHtml){%><%= saveTextHtml %> = messageData["body"]["html"];<%}%>
<%if(textPlain){%><%= saveTextPlain %> = messageData["body"]["plain"];<%}%>
<%if(textRaw){%><%= saveTextRaw %> = messageData["body"]["raw"];<%}%>
<%if(size){%><%= saveSize %> = messageData["size"];<%}%>
<%if(flags){%><%= saveFlags %> = messageData["flags"];<%}%>
<%if(date){%><%= saveDate %> = messageData["date"];<%}%>
<%if(attachments){%><%= saveAttachments %> = messageData["attachments"];<%}%>
