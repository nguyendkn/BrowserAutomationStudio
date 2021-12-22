fetch.on('message', function(msg, seqno){
	console.log('Message #%d', seqno);
	var prefix = '(#' + seqno + ') ';
	msg.on('body', function(stream, info) {
		var buffer = '';
		stream.on('data', function(chunk) {
			buffer += chunk.toString('utf8');
		});
		stream.once('end', function() {
			console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
		});
	});
	msg.once('attributes', function(attrs) {
		console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
	});
	msg.once('end', function() {
		console.log(prefix + 'Finished');
	});
});
fetch.once('error', function(err) {
	console.log('Fetch error: ' + err);
});
fetch.once('end', function() {
	console.log('Done fetching all messages!');
	imap.end();
});
.map(function(ell){return ell ? Buffer.from(ell, 'base64').toString('utf8') : ""}).join('\r\n')
data.split('\r\n').map(function(ell){return ell ? Buffer.from(ell, 'base64').toString('utf8') : ""}).join('');