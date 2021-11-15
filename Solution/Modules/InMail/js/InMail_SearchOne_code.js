_call_function(_InMail.searchOne, {criteria: {<%= [["from", from], ["to", to], ["subject", subject], ["text", text]].filter(function(el){return el[1] !== '""'}).map(function(el){return el[0] + ':(' + el[1] + ')'}).join(', ') %>}, sorts: {type: (<%= sortType %>), field: (<%= sortField %>)}, folder: (<%= folder %>), errorNotFound: (<%= errorNotFound %>)})!
<%= variable %> = _result_function();
