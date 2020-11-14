_STR_WHITESPACE = '\\s\\uFEFF\\xA0;';
function _is_string(data){
	return typeof data==="string";
};
function _is_not_empty_string(data){
	return _is_string(data) && data.length > 0;
};
function _no_exponents(num){
	var data = String(num).split(/[eE]/);
	if(data.length == 1){return data[0]};

	var z = '';
	var sign = num < 0 ? '-' : '';
	var str = data[0].replace('.', '');
	var mag = Number(data[1]) + 1;

	if(mag < 0){
		z = sign + '0.';
		while (mag++) z += '0';
		return z + str.replace(/^\-/, '');
	};
	mag -= str.length;
	while (mag--) z += '0';
	return str + z;
};
function _to_string(data){
	return _is_string(data) ? data : ((typeof data=="object" && !(data instanceof Date) && !(data instanceof RegExp)) ? JSON.stringify(data) : (typeof data=="number" ? _no_exponents(data) : ((data instanceof RegExp) ? data.source : String(data))));
};
function _to_number(str, dec, dsep, tsep){
	str = _to_string(_avoid_nil(str));
	dec = _avoid_nil(dec);
	
	str = _replace_string(str, _avoid_nil(tsep, ','), '');
	str = _replace_string(str, _avoid_nil(dsep, '.'), '.');
	
	if(dec===-1 || dec===""){return Number(str)};
	
	var factor = Math.pow(10, isFinite(dec) ? dec : 0);
	return Math.round(str * factor)/factor;
};
function _number_format(num, dec, dsep, tsep){
	if(_is_nil(num) || isNaN(num)){return ''};
	num = typeof num==="number" ? num : Number(num);
	dec = _avoid_nil(dec);
	dsep = _avoid_nil(dsep, '.');
	tsep = _avoid_nil(tsep, ',');

	num = (dec===-1 || dec==="") ? _no_exponents(num) : num.toFixed(dec);

	var parts = num.split('.');
	var fnums = parts[0];
	var decimals = parts[1] ? dsep + parts[1] : '';

	return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
};
function _count_substrings(str, sub){
	return _avoid_nil(str.match(new RegExp(sub, "g")), []).length;
};
function _get_substring(str, from, to){
	return str.slice(from, to);
};
function _get_substring_between(str, left, right){
    left = _avoid_nil(left);
    right = _avoid_nil(right);
	
	var start = left==="" ? 0 : str.indexOf(left);
	var end = right==="" ? -1 : str.indexOf(right, start + left.length);
	
	if(end===-1 && right!==""){
		return "";
	}else{
		if(end===-1 && right===""){
			return str.substring(start + left.length);
		}else{
			return str.slice(start + left.length, end);
		};
	};
};
function _splice_string(str, from, count, add){
	from = _avoid_nilb(from, 0);
	count = _avoid_nilb(count, 0);
	if(from < 0){
		from = str.length + from;
		if(from < 0){
			from = 0;
		};
	};
	return str.slice(0, from) + _avoid_nil(add) + str.slice(from + count);
};
function _to_lower_case(str){
	return str.toLowerCase();
};
function _to_upper_case(str){
	return str.toUpperCase();
};
function _contains(str, sub){
	return str.indexOf(sub) > -1;
};
function _length(str){
	return str.length;
};
function _capitalize(str, all, lower){
	return (lower ? str.toLowerCase() : str).replace(new RegExp("(?:^|\\s|[\"'([{])+\\S", (all ? "g" : "")), function(match){return match.toUpperCase()});
};
function _sentences(str){
    return _clean(str).replace(/(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|+|").split("|+|");
};
function _words(str){
    return _avoid_nil(_clean(str).replace(/[\-]{2,}/g, " ").match(/[A-ZА-Я\xC0-\xD6\xD8-\xDE\-]+(?![a-zа-я\xDF-\xF6\xF8-\xFF\-\d])|[A-ZА-Я\xC0-\xD6\xD8-\xDE\-]?[a-zа-я\xDF-\xF6\xF8-\xFF\-\d]+/g), []).filter(function(s){return /([^\-]+)/.test(s)}).map(function(s){return _trim(s, _STR_WHITESPACE + "-")});
};
function _count_words(str){
    return _words(str).length;
};
function _find_substring(str, sub, from){
	return str.indexOf(sub, from);
};
function _starts_with(str, sub, from){
	return str.indexOf(sub) === _avoid_nilb(from, 0);
};
function _ends_with(str, sub, lenght){
	if(_is_nilb(lenght) || lenght > str.length){
		lenght = str.length;
	};
	lenght -= sub.length;
	var last_index = str.indexOf(sub, lenght);
	return last_index !== -1 && last_index === lenght;
};
function _insert_substring(str, index, sub){
	return _splice_string(str, index, 0, sub);
};
function _concat_strings(list, sep){
	return list.filter(function(e){return e!==""}).join(_avoid_nil(sep));
};
function _latinize(str, cyrillic){
	str = _to_string(str);
	if(str===''){
		return '';
	};
	cyrillic = _avoid_nilb(cyrillic, true);
	var get_latin_character = function(character){
		var diacritics_map = {'Á':'A','Ă':'A','Ắ':'A','Ặ':'A','Ằ':'A','Ẳ':'A','Ẵ':'A','Ǎ':'A','Â':'A','Ấ':'A','Ậ':'A','Ầ':'A','Ẩ':'A','Ẫ':'A','Ä':'A','Ǟ':'A','Ȧ':'A','Ǡ':'A','Ạ':'A','Ȁ':'A','À':'A','Ả':'A','Ȃ':'A','Ā':'A','Ą':'A','Å':'A','Ǻ':'A','Ḁ':'A','Ⱥ':'A','Ã':'A','Ꜳ':'AA','Æ':'AE','Ǽ':'AE','Ǣ':'AE','Ꜵ':'AO','Ꜷ':'AU','Ꜹ':'AV','Ꜻ':'AV','Ꜽ':'AY','Ḃ':'B','Ḅ':'B','Ɓ':'B','Ḇ':'B','Ƀ':'B','Ƃ':'B','Ć':'C','Č':'C','Ç':'C','Ḉ':'C','Ĉ':'C','Ċ':'C','Ƈ':'C','Ȼ':'C','Ď':'D','Ḑ':'D','Ḓ':'D','Ḋ':'D','Ḍ':'D','Ɗ':'D','Ḏ':'D','ǲ':'D','ǅ':'D','Đ':'D','Ð':'D','Ƌ':'D','Ǳ':'DZ','Ǆ':'DZ','É':'E','Ĕ':'E','Ě':'E','Ȩ':'E','Ḝ':'E','Ê':'E','Ế':'E','Ệ':'E','Ề':'E','Ể':'E','Ễ':'E','Ḙ':'E','Ë':'E','Ė':'E','Ẹ':'E','Ȅ':'E','È':'E','Ẻ':'E','Ȇ':'E','Ē':'E','Ḗ':'E','Ḕ':'E','Ę':'E','Ɇ':'E','Ẽ':'E','Ḛ':'E','Ꝫ':'ET','Ḟ':'F','Ƒ':'F','Ǵ':'G','Ğ':'G','Ǧ':'G','Ģ':'G','Ĝ':'G','Ġ':'G','Ɠ':'G','Ḡ':'G','Ǥ':'G','Ḫ':'H','Ȟ':'H','Ḩ':'H','Ĥ':'H','Ⱨ':'H','Ḧ':'H','Ḣ':'H','Ḥ':'H','Ħ':'H','Í':'I','Ĭ':'I','Ǐ':'I','Î':'I','Ï':'I','Ḯ':'I','İ':'I','Ị':'I','Ȉ':'I','Ì':'I','Ỉ':'I','Ȋ':'I','Ī':'I','Į':'I','Ɨ':'I','Ĩ':'I','Ḭ':'I','Ꝺ':'D','Ꝼ':'F','Ᵹ':'G','Ꞃ':'R','Ꞅ':'S','Ꞇ':'T','Ꝭ':'IS','Ĵ':'J','Ɉ':'J','Ḱ':'K','Ǩ':'K','Ķ':'K','Ⱪ':'K','Ꝃ':'K','Ḳ':'K','Ƙ':'K','Ḵ':'K','Ꝁ':'K','Ꝅ':'K','Ĺ':'L','Ƚ':'L','Ľ':'L','Ļ':'L','Ḽ':'L','Ḷ':'L','Ḹ':'L','Ⱡ':'L','Ꝉ':'L','Ḻ':'L','Ŀ':'L','Ɫ':'L','ǈ':'L','Ł':'L','Ǉ':'LJ','Ḿ':'M','Ṁ':'M','Ṃ':'M','Ɱ':'M','Ń':'N','Ň':'N','Ņ':'N','Ṋ':'N','Ṅ':'N','Ṇ':'N','Ǹ':'N','Ɲ':'N','Ṉ':'N','Ƞ':'N','ǋ':'N','Ñ':'N','Ǌ':'NJ','Ó':'O','Ŏ':'O','Ǒ':'O','Ô':'O','Ố':'O','Ộ':'O','Ồ':'O','Ổ':'O','Ỗ':'O','Ö':'O','Ȫ':'O','Ȯ':'O','Ȱ':'O','Ọ':'O','Ő':'O','Ȍ':'O','Ò':'O','Ỏ':'O','Ơ':'O','Ớ':'O','Ợ':'O','Ờ':'O','Ở':'O','Ỡ':'O','Ȏ':'O','Ꝋ':'O','Ꝍ':'O','Ō':'O','Ṓ':'O','Ṑ':'O','Ɵ':'O','Ǫ':'O','Ǭ':'O','Ø':'O','Ǿ':'O','Õ':'O','Ṍ':'O','Ṏ':'O','Ȭ':'O','Ƣ':'OI','Ꝏ':'OO','Ɛ':'E','Ɔ':'O','Ȣ':'OU','Ṕ':'P','Ṗ':'P','Ꝓ':'P','Ƥ':'P','Ꝕ':'P','Ᵽ':'P','Ꝑ':'P','Ꝙ':'Q','Ꝗ':'Q','Ŕ':'R','Ř':'R','Ŗ':'R','Ṙ':'R','Ṛ':'R','Ṝ':'R','Ȑ':'R','Ȓ':'R','Ṟ':'R','Ɍ':'R','Ɽ':'R','Ꜿ':'C','Ǝ':'E','Ś':'S','Ṥ':'S','Š':'S','Ṧ':'S','Ş':'S','Ŝ':'S','Ș':'S','Ṡ':'S','Ṣ':'S','Ṩ':'S','ß':'ss','Ť':'T','Ţ':'T','Ṱ':'T','Ț':'T','Ⱦ':'T','Ṫ':'T','Ṭ':'T','Ƭ':'T','Ṯ':'T','Ʈ':'T','Ŧ':'T','Ɐ':'A','Ꞁ':'L','Ɯ':'M','Ʌ':'V','Ꜩ':'TZ','Ú':'U','Ŭ':'U','Ǔ':'U','Û':'U','Ṷ':'U','Ü':'U','Ǘ':'U','Ǚ':'U','Ǜ':'U','Ǖ':'U','Ṳ':'U','Ụ':'U','Ű':'U','Ȕ':'U','Ù':'U','Ủ':'U','Ư':'U','Ứ':'U','Ự':'U','Ừ':'U','Ử':'U','Ữ':'U','Ȗ':'U','Ū':'U','Ṻ':'U','Ų':'U','Ů':'U','Ũ':'U','Ṹ':'U','Ṵ':'U','Ꝟ':'V','Ṿ':'V','Ʋ':'V','Ṽ':'V','Ꝡ':'VY','Ẃ':'W','Ŵ':'W','Ẅ':'W','Ẇ':'W','Ẉ':'W','Ẁ':'W','Ⱳ':'W','Ẍ':'X','Ẋ':'X','Ý':'Y','Ŷ':'Y','Ÿ':'Y','Ẏ':'Y','Ỵ':'Y','Ỳ':'Y','Ƴ':'Y','Ỷ':'Y','Ỿ':'Y','Ȳ':'Y','Ɏ':'Y','Ỹ':'Y','Ź':'Z','Ž':'Z','Ẑ':'Z','Ⱬ':'Z','Ż':'Z','Ẓ':'Z','Ȥ':'Z','Ẕ':'Z','Ƶ':'Z','Þ':'TH','Ĳ':'IJ','Œ':'OE','ᴀ':'A','ᴁ':'AE','ʙ':'B','ᴃ':'B','ᴄ':'C','ᴅ':'D','ᴇ':'E','ꜰ':'F','ɢ':'G','ʛ':'G','ʜ':'H','ɪ':'I','ʁ':'R','ᴊ':'J','ᴋ':'K','ʟ':'L','ᴌ':'L','ᴍ':'M','ɴ':'N','ᴏ':'O','ɶ':'OE','ᴐ':'O','ᴕ':'OU','ᴘ':'P','ʀ':'R','ᴎ':'N','ᴙ':'R','ꜱ':'S','ᴛ':'T','ⱻ':'E','ᴚ':'R','ᴜ':'U','ᴠ':'V','ᴡ':'W','ʏ':'Y','ᴢ':'Z','á':'a','ă':'a','ắ':'a','ặ':'a','ằ':'a','ẳ':'a','ẵ':'a','ǎ':'a','â':'a','ấ':'a','ậ':'a','ầ':'a','ẩ':'a','ẫ':'a','ä':'a','ǟ':'a','ȧ':'a','ǡ':'a','ạ':'a','ȁ':'a','à':'a','ả':'a','ȃ':'a','ā':'a','ą':'a','ᶏ':'a','ẚ':'a','å':'a','ǻ':'a','ḁ':'a','ⱥ':'a','ã':'a','ꜳ':'aa','æ':'ae','ǽ':'ae','ǣ':'ae','ꜵ':'ao','ꜷ':'au','ꜹ':'av','ꜻ':'av','ꜽ':'ay','ḃ':'b','ḅ':'b','ɓ':'b','ḇ':'b','ᵬ':'b','ᶀ':'b','ƀ':'b','ƃ':'b','ɵ':'o','ć':'c','č':'c','ç':'c','ḉ':'c','ĉ':'c','ɕ':'c','ċ':'c','ƈ':'c','ȼ':'c','ď':'d','ḑ':'d','ḓ':'d','ȡ':'d','ḋ':'d','ḍ':'d','ɗ':'d','ᶑ':'d','ḏ':'d','ᵭ':'d','ᶁ':'d','đ':'d','ɖ':'d','ƌ':'d','ð':'d','ı':'i','ȷ':'j','ɟ':'j','ʄ':'j','ǳ':'dz','ǆ':'dz','é':'e','ĕ':'e','ě':'e','ȩ':'e','ḝ':'e','ê':'e','ế':'e','ệ':'e','ề':'e','ể':'e','ễ':'e','ḙ':'e','ë':'e','ė':'e','ẹ':'e','ȅ':'e','è':'e','ẻ':'e','ȇ':'e','ē':'e','ḗ':'e','ḕ':'e','ⱸ':'e','ę':'e','ᶒ':'e','ɇ':'e','ẽ':'e','ḛ':'e','ꝫ':'et','ḟ':'f','ƒ':'f','ᵮ':'f','ᶂ':'f','ǵ':'g','ğ':'g','ǧ':'g','ģ':'g','ĝ':'g','ġ':'g','ɠ':'g','ḡ':'g','ᶃ':'g','ǥ':'g','ḫ':'h','ȟ':'h','ḩ':'h','ĥ':'h','ⱨ':'h','ḧ':'h','ḣ':'h','ḥ':'h','ɦ':'h','ẖ':'h','ħ':'h','ƕ':'hv','í':'i','ĭ':'i','ǐ':'i','î':'i','ï':'i','ḯ':'i','ị':'i','ȉ':'i','ì':'i','ỉ':'i','ȋ':'i','ī':'i','į':'i','ᶖ':'i','ɨ':'i','ĩ':'i','ḭ':'i','ꝺ':'d','ꝼ':'f','ᵹ':'g','ꞃ':'r','ꞅ':'s','ꞇ':'t','ꝭ':'is','ǰ':'j','ĵ':'j','ʝ':'j','ɉ':'j','ḱ':'k','ǩ':'k','ķ':'k','ⱪ':'k','ꝃ':'k','ḳ':'k','ƙ':'k','ḵ':'k','ᶄ':'k','ꝁ':'k','ꝅ':'k','ĺ':'l','ƚ':'l','ɬ':'l','ľ':'l','ļ':'l','ḽ':'l','ȴ':'l','ḷ':'l','ḹ':'l','ⱡ':'l','ꝉ':'l','ḻ':'l','ŀ':'l','ɫ':'l','ᶅ':'l','ɭ':'l','ł':'l','ǉ':'lj','ſ':'s','ẜ':'s','ẛ':'s','ẝ':'s','ḿ':'m','ṁ':'m','ṃ':'m','ɱ':'m','ᵯ':'m','ᶆ':'m','ń':'n','ň':'n','ņ':'n','ṋ':'n','ȵ':'n','ṅ':'n','ṇ':'n','ǹ':'n','ɲ':'n','ṉ':'n','ƞ':'n','ᵰ':'n','ᶇ':'n','ɳ':'n','ñ':'n','ǌ':'nj','ó':'o','ŏ':'o','ǒ':'o','ô':'o','ố':'o','ộ':'o','ồ':'o','ổ':'o','ỗ':'o','ö':'o','ȫ':'o','ȯ':'o','ȱ':'o','ọ':'o','ő':'o','ȍ':'o','ò':'o','ỏ':'o','ơ':'o','ớ':'o','ợ':'o','ờ':'o','ở':'o','ỡ':'o','ȏ':'o','ꝋ':'o','ꝍ':'o','ⱺ':'o','ō':'o','ṓ':'o','ṑ':'o','ǫ':'o','ǭ':'o','ø':'o','ǿ':'o','õ':'o','ṍ':'o','ṏ':'o','ȭ':'o','ƣ':'oi','ꝏ':'oo','ɛ':'e','ᶓ':'e','ɔ':'o','ᶗ':'o','ȣ':'ou','ṕ':'p','ṗ':'p','ꝓ':'p','ƥ':'p','ᵱ':'p','ᶈ':'p','ꝕ':'p','ᵽ':'p','ꝑ':'p','ꝙ':'q','ʠ':'q','ɋ':'q','ꝗ':'q','ŕ':'r','ř':'r','ŗ':'r','ṙ':'r','ṛ':'r','ṝ':'r','ȑ':'r','ɾ':'r','ᵳ':'r','ȓ':'r','ṟ':'r','ɼ':'r','ᵲ':'r','ᶉ':'r','ɍ':'r','ɽ':'r','ↄ':'c','ꜿ':'c','ɘ':'e','ɿ':'r','ś':'s','ṥ':'s','š':'s','ṧ':'s','ş':'s','ŝ':'s','ș':'s','ṡ':'s','ṣ':'s','ṩ':'s','ʂ':'s','ᵴ':'s','ᶊ':'s','ȿ':'s','ɡ':'g','ᴑ':'o','ᴓ':'o','ᴝ':'u','ť':'t','ţ':'t','ṱ':'t','ț':'t','ȶ':'t','ẗ':'t','ⱦ':'t','ṫ':'t','ṭ':'t','ƭ':'t','ṯ':'t','ᵵ':'t','ƫ':'t','ʈ':'t','ŧ':'t','ᵺ':'th','ɐ':'a','ᴂ':'ae','ǝ':'e','ᵷ':'g','ɥ':'h','ʮ':'h','ʯ':'h','ᴉ':'i','ʞ':'k','ꞁ':'l','ɯ':'m','ɰ':'m','ᴔ':'oe','ɹ':'r','ɻ':'r','ɺ':'r','ⱹ':'r','ʇ':'t','ʌ':'v','ʍ':'w','ʎ':'y','ꜩ':'tz','ú':'u','ŭ':'u','ǔ':'u','û':'u','ṷ':'u','ü':'u','ǘ':'u','ǚ':'u','ǜ':'u','ǖ':'u','ṳ':'u','ụ':'u','ű':'u','ȕ':'u','ù':'u','ủ':'u','ư':'u','ứ':'u','ự':'u','ừ':'u','ử':'u','ữ':'u','ȗ':'u','ū':'u','ṻ':'u','ų':'u','ᶙ':'u','ů':'u','ũ':'u','ṹ':'u','ṵ':'u','ᵫ':'ue','ꝸ':'um','ⱴ':'v','ꝟ':'v','ṿ':'v','ʋ':'v','ᶌ':'v','ⱱ':'v','ṽ':'v','ꝡ':'vy','ẃ':'w','ŵ':'w','ẅ':'w','ẇ':'w','ẉ':'w','ẁ':'w','ⱳ':'w','ẘ':'w','ẍ':'x','ẋ':'x','ᶍ':'x','ý':'y','ŷ':'y','ÿ':'y','ẏ':'y','ỵ':'y','ỳ':'y','ƴ':'y','ỷ':'y','ỿ':'y','ȳ':'y','ẙ':'y','ɏ':'y','ỹ':'y','ź':'z','ž':'z','ẑ':'z','ʑ':'z','ⱬ':'z','ż':'z','ẓ':'z','ȥ':'z','ẕ':'z','ᵶ':'z','ᶎ':'z','ʐ':'z','ƶ':'z','ɀ':'z','þ':'th','ﬀ':'ff','ﬃ':'ffi','ﬄ':'ffl','ﬁ':'fi','ﬂ':'fl','ĳ':'ij','œ':'oe','ﬆ':'st','ₐ':'a','ₑ':'e','ᵢ':'i','ⱼ':'j','ₒ':'o','ᵣ':'r','ᵤ':'u','ᵥ':'v','ₓ':'x','Ё':'YO','Й':'I','Ц':'TS','У':'U','К':'K','Е':'E','Н':'N','Г':'G','Ш':'SH','Щ':'SCH','З':'Z','Х':'H','Ъ':"'",'ё':'yo','й':'i','ц':'ts','у':'u','к':'k','е':'e','н':'n','г':'g','ш':'sh','щ':'sch','з':'z','х':'h','ъ':"'",'Ф':'F','Ы':'I','В':'V','А':'a','П':'P','Р':'R','О':'O','Л':'L','Д':'D','Ж':'ZH','Э':'E','ф':'f','ы':'i','в':'v','а':'a','п':'p','р':'r','о':'o','л':'l','д':'d','ж':'zh','э':'e','Я':'Ya','Ч':'CH','С':'S','М':'M','И':'I','Т':'T','Ь':"'",'Б':'B','Ю':'YU','я':'ya','ч':'ch','с':'s','м':'m','и':'i','т':'t','ь':"'",'б':'b','ю':'yu'};
		var latin_character = diacritics_map[character];
		return _is_nil(latin_character) ? character : latin_character;
	};
	var remove_combining_marks = function(character, clean_character){
		return clean_character;
	};
	return str.replace(cyrillic ? /[^A-Za-z0-9]/g : /[^A-ZА-Яa-zа-я0-9]/g, get_latin_character).replace(/([\0-\u02FF\u0370-\u1AAF\u1B00-\u1DBF\u1E00-\u20CF\u2100-\uD7FF\uE000-\uFE1F\uFE30-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])([\u0300-\u036F\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]+)/g, remove_combining_marks);
};
function _declination(num, words){  
    num = Math.abs(num) % 100;
	var num1 = num % 10;
	
    if(num > 10 && num < 20){return words[2]};
    if(num1 > 1 && num1 < 5){return words[1]};
    if(num1==1){return words[0]};
	
    return words[2];
};
function _csv_generate(list, sep){
	sep = _avoid_nilb(sep, ':');
    var res = '';
    var first = true;
    list.forEach(function(item){
		item = _to_string(item);
        var add = item;
        if(typeof item=="string" && (item.indexOf(':') > -1 || item.indexOf(';') > -1 || item.indexOf(',') > -1 || item.indexOf(sep) > -1)){
            add = '"' + add.replace(/["]/gi, '""') + '"';
        };
        if(!first){
            res += sep;
        }else{
            first = false;
        };
        res += add;
    });
    return res;
};
function _csv_parse(str, seps, convert){
	seps = _avoid_nilb(seps, [":", ";", ","]);
	convert = _avoid_nilb(convert, false);
    var res = [];
    var index = 0;
    var len = str.length;
    var InsideQuotes = false;
    var CurrentElement = '';
    
    while(index<len){
        var c = str[index];
        var n = '';
        var HasNext = (index + 1) < len;
        if(HasNext){
            n = str[index + 1];
        };
        index++;

        if(c=='"'){
            if(InsideQuotes){
                if(!HasNext || n!='"'){
                    InsideQuotes = false;
                    continue;
                }else{
                    CurrentElement += '"';
                    index++;
                    continue;
                }
            }else{
                InsideQuotes = true;
                continue;
            }
        };

        if(seps.indexOf(c) > -1){
            if(InsideQuotes){
                CurrentElement += c;
                continue;
            }else{
                res.push(convert ? _from_string(CurrentElement) : CurrentElement);
                CurrentElement = '';
                continue;
            }
        };
        CurrentElement += c;
    };
    res.push(convert ? _from_string(CurrentElement) : CurrentElement);

    return res;
};
function _trim_left(str, chars){
	return str.replace(new RegExp('^[' + _avoid_nilb(chars, _STR_WHITESPACE) + ']+', 'g'), '');
};
function _trim_right(str, chars){
	return str.replace(new RegExp('[' + _avoid_nilb(chars, _STR_WHITESPACE) + ']+$', 'g'), '');
};
function _trim(str, chars, left, right){
	chars = _avoid_nilb(chars, _STR_WHITESPACE);
	str = _avoid_nilb(left, true) ? _trim_left(str, chars) : str;
	str = _avoid_nilb(right, true) ? _trim_right(str, chars) : str;
	return str;
};
function _clean(str, chars_to_delete, chars_to_space, multiple_spaces){
	str = _is_nilb(chars_to_space) ? str : str.replace(new RegExp('[' + chars_to_space + ']+', 'g'), ' ');
	str = _is_nilb(chars_to_delete) ? str : str.replace(new RegExp('[' + chars_to_delete + ']+', 'g'), '');
	str = _trim(str);
	str = _avoid_nilb(multiple_spaces, true) ? str.replace(new RegExp('[' + _STR_WHITESPACE + ']+', 'g'), ' ') : str.replace(new RegExp('[\\uFEFF\\xA0;]', 'g'), ' ');
	return str;
};
function _replace_string(str, from, to){
	return str.split(from).join(to);
};
function _random_string(chars, length){
	return Array(length).join().split(',').map(function(){ return chars.charAt(Math.floor(Math.random() * chars.length)); }).join('');
};
function _escape_html(str){
	var chars = {'¢' : 'cent', '£' : 'pound', '¥' : 'yen', '€': 'euro', '©' :'copy', '®' : 'reg', '<' : 'lt', '>' : 'gt', '"' : 'quot', '&' : 'amp', '\'' : '#39'};
	var regex_string = '[';
	for(var key in chars){
		regex_string += key;
	};
	regex_string += ']';
	var regex = new RegExp(regex_string, 'g');
	var escape_char = function(m){
		return '&' + chars[m] + ';';
	};
	return str.replace(regex, escape_char);
};
function _unescape_html(str){
	var entities = {nbsp: ' ', cent: '¢', pound: '£', yen: '¥', euro: '€', copy: '©', reg: '®', lt: '<', gt: '>', quot: '"', amp: '&', apos: '\''};
	var unescape_char = function(entity, entity_code){
		var match = "";
		if(entity_code in entities){
			return entities[entity_code];
		}else if(match = entity_code.match(/^#x([\da-fA-F]+)$/)){
			return String.fromCharCode(parseInt(match[1], 16));
		}else if(match = entity_code.match(/^#(\d+)$/)){
			return String.fromCharCode(~~match[1]);
		}else{
			return entity;
		};
	};
	return str.replace(/\&([^;]{1,10});/g, unescape_char);
};
function _encode_url_component(str){
	return encodeURIComponent(str);
};
function _decode_url_component(str){
	return decodeURIComponent(str);
};
function _regexp_extract_validation(mode, type){
	if(typeof _STR_REGEXP_EV=="undefined" || _is_nilb(_STR_REGEXP_EV)){
		var tlds = "(AAA|AARP|ABARTH|ABB|ABBOTT|ABBVIE|ABC|ABLE|ABOGADO|ABUDHABI|AC|ACADEMY|ACCENTURE|ACCOUNTANT|ACCOUNTANTS|ACO|ACTOR|AD|ADAC|ADS|ADULT|AE|AEG|AERO|AETNA|AF|AFAMILYCOMPANY|AFL|AFRICA|AG|AGAKHAN|AGENCY|AI|AIG|AIGO|AIRBUS|AIRFORCE|AIRTEL|AKDN|AL|ALFAROMEO|ALIBABA|ALIPAY|ALLFINANZ|ALLSTATE|ALLY|ALSACE|ALSTOM|AM|AMERICANEXPRESS|AMERICANFAMILY|AMEX|AMFAM|AMICA|AMSTERDAM|ANALYTICS|ANDROID|ANQUAN|ANZ|AO|AOL|APARTMENTS|APP|APPLE|AQ|AQUARELLE|AR|ARAB|ARAMCO|ARCHI|ARMY|ARPA|ART|ARTE|AS|ASDA|ASIA|ASSOCIATES|AT|ATHLETA|ATTORNEY|AU|AUCTION|AUDI|AUDIBLE|AUDIO|AUSPOST|AUTHOR|AUTO|AUTOS|AVIANCA|AW|AWS|AX|AXA|AZ|AZURE|BA|BABY|BAIDU|BANAMEX|BANANAREPUBLIC|BAND|BANK|BAR|BARCELONA|BARCLAYCARD|BARCLAYS|BAREFOOT|BARGAINS|BASEBALL|BASKETBALL|BAUHAUS|BAYERN|BB|BBC|BBT|BBVA|BCG|BCN|BD|BE|BEATS|BEAUTY|BEER|BENTLEY|BERLIN|BEST|BESTBUY|BET|BF|BG|BH|BHARTI|BI|BIBLE|BID|BIKE|BING|BINGO|BIO|BIZ|BJ|BLACK|BLACKFRIDAY|BLOCKBUSTER|BLOG|BLOOMBERG|BLUE|BM|BMS|BMW|BN|BNPPARIBAS|BO|BOATS|BOEHRINGER|BOFA|BOM|BOND|BOO|BOOK|BOOKING|BOSCH|BOSTIK|BOSTON|BOT|BOUTIQUE|BOX|BR|BRADESCO|BRIDGESTONE|BROADWAY|BROKER|BROTHER|BRUSSELS|BS|BT|BUDAPEST|BUGATTI|BUILD|BUILDERS|BUSINESS|BUY|BUZZ|BV|BW|BY|BZ|BZH|CA|CAB|CAFE|CAL|CALL|CALVINKLEIN|CAM|CAMERA|CAMP|CANCERRESEARCH|CANON|CAPETOWN|CAPITAL|CAPITALONE|CAR|CARAVAN|CARDS|CARE|CAREER|CAREERS|CARS|CASA|CASE|CASEIH|CASH|CASINO|CAT|CATERING|CATHOLIC|CBA|CBN|CBRE|CBS|CC|CD|CEB|CENTER|CEO|CERN|CF|CFA|CFD|CG|CH|CHANEL|CHANNEL|CHARITY|CHASE|CHAT|CHEAP|CHINTAI|CHRISTMAS|CHROME|CHURCH|CI|CIPRIANI|CIRCLE|CISCO|CITADEL|CITI|CITIC|CITY|CITYEATS|CK|CL|CLAIMS|CLEANING|CLICK|CLINIC|CLINIQUE|CLOTHING|CLOUD|CLUB|CLUBMED|CM|CN|CO|COACH|CODES|COFFEE|COLLEGE|COLOGNE|COM|COMCAST|COMMBANK|COMMUNITY|COMPANY|COMPARE|COMPUTER|COMSEC|CONDOS|CONSTRUCTION|CONSULTING|CONTACT|CONTRACTORS|COOKING|COOKINGCHANNEL|COOL|COOP|CORSICA|COUNTRY|COUPON|COUPONS|COURSES|CPA|CR|CREDIT|CREDITCARD|CREDITUNION|CRICKET|CROWN|CRS|CRUISE|CRUISES|CSC|CU|CUISINELLA|CV|CW|CX|CY|CYMRU|CYOU|CZ|DABUR|DAD|DANCE|DATA|DATE|DATING|DATSUN|DAY|DCLK|DDS|DE|DEAL|DEALER|DEALS|DEGREE|DELIVERY|DELL|DELOITTE|DELTA|DEMOCRAT|DENTAL|DENTIST|DESI|DESIGN|DEV|DHL|DIAMONDS|DIET|DIGITAL|DIRECT|DIRECTORY|DISCOUNT|DISCOVER|DISH|DIY|DJ|DK|DM|DNP|DO|DOCS|DOCTOR|DOG|DOMAINS|DOT|DOWNLOAD|DRIVE|DTV|DUBAI|DUCK|DUNLOP|DUPONT|DURBAN|DVAG|DVR|DZ|EARTH|EAT|EC|ECO|EDEKA|EDU|EDUCATION|EE|EG|EMAIL|EMERCK|ENERGY|ENGINEER|ENGINEERING|ENTERPRISES|EPSON|EQUIPMENT|ER|ERICSSON|ERNI|ES|ESQ|ESTATE|ESURANCE|ET|ETISALAT|EU|EUROVISION|EUS|EVENTS|EXCHANGE|EXPERT|EXPOSED|EXPRESS|EXTRASPACE|FAGE|FAIL|FAIRWINDS|FAITH|FAMILY|FAN|FANS|FARM|FARMERS|FASHION|FAST|FEDEX|FEEDBACK|FERRARI|FERRERO|FI|FIAT|FIDELITY|FIDO|FILM|FINAL|FINANCE|FINANCIAL|FIRE|FIRESTONE|FIRMDALE|FISH|FISHING|FIT|FITNESS|FJ|FK|FLICKR|FLIGHTS|FLIR|FLORIST|FLOWERS|FLY|FM|FO|FOO|FOOD|FOODNETWORK|FOOTBALL|FORD|FOREX|FORSALE|FORUM|FOUNDATION|FOX|FR|FREE|FRESENIUS|FRL|FROGANS|FRONTDOOR|FRONTIER|FTR|FUJITSU|FUJIXEROX|FUN|FUND|FURNITURE|FUTBOL|FYI|GA|GAL|GALLERY|GALLO|GALLUP|GAME|GAMES|GAP|GARDEN|GAY|GB|GBIZ|GD|GDN|GE|GEA|GENT|GENTING|GEORGE|GF|GG|GGEE|GH|GI|GIFT|GIFTS|GIVES|GIVING|GL|GLADE|GLASS|GLE|GLOBAL|GLOBO|GM|GMAIL|GMBH|GMO|GMX|GN|GODADDY|GOLD|GOLDPOINT|GOLF|GOO|GOODYEAR|GOOG|GOOGLE|GOP|GOT|GOV|GP|GQ|GR|GRAINGER|GRAPHICS|GRATIS|GREEN|GRIPE|GROCERY|GROUP|GS|GT|GU|GUARDIAN|GUCCI|GUGE|GUIDE|GUITARS|GURU|GW|GY|HAIR|HAMBURG|HANGOUT|HAUS|HBO|HDFC|HDFCBANK|HEALTH|HEALTHCARE|HELP|HELSINKI|HERE|HERMES|HGTV|HIPHOP|HISAMITSU|HITACHI|HIV|HK|HKT|HM|HN|HOCKEY|HOLDINGS|HOLIDAY|HOMEDEPOT|HOMEGOODS|HOMES|HOMESENSE|HONDA|HORSE|HOSPITAL|HOST|HOSTING|HOT|HOTELES|HOTELS|HOTMAIL|HOUSE|HOW|HR|HSBC|HT|HU|HUGHES|HYATT|HYUNDAI|IBM|ICBC|ICE|ICU|ID|IE|IEEE|IFM|IKANO|IL|IM|IMAMAT|IMDB|IMMO|IMMOBILIEN|IN|INC|INDUSTRIES|INFINITI|INFO|ING|INK|INSTITUTE|INSURANCE|INSURE|INT|INTEL|INTERNATIONAL|INTUIT|INVESTMENTS|IO|IPIRANGA|IQ|IR|IRISH|IS|ISMAILI|IST|ISTANBUL|IT|ITAU|ITV|IVECO|JAGUAR|JAVA|JCB|JCP|JE|JEEP|JETZT|JEWELRY|JIO|JLL|JM|JMP|JNJ|JO|JOBS|JOBURG|JOT|JOY|JP|JPMORGAN|JPRS|JUEGOS|JUNIPER|KAUFEN|KDDI|KE|KERRYHOTELS|KERRYLOGISTICS|KERRYPROPERTIES|KFH|KG|KH|KI|KIA|KIM|KINDER|KINDLE|KITCHEN|KIWI|KM|KN|KOELN|KOMATSU|KOSHER|KP|KPMG|KPN|KR|KRD|KRED|KUOKGROUP|KW|KY|KYOTO|KZ|LA|LACAIXA|LAMBORGHINI|LAMER|LANCASTER|LANCIA|LAND|LANDROVER|LANXESS|LASALLE|LAT|LATINO|LATROBE|LAW|LAWYER|LB|LC|LDS|LEASE|LECLERC|LEFRAK|LEGAL|LEGO|LEXUS|LGBT|LI|LIDL|LIFE|LIFEINSURANCE|LIFESTYLE|LIGHTING|LIKE|LILLY|LIMITED|LIMO|LINCOLN|LINDE|LINK|LIPSY|LIVE|LIVING|LIXIL|LK|LLC|LLP|LOAN|LOANS|LOCKER|LOCUS|LOFT|LOL|LONDON|LOTTE|LOTTO|LOVE|LPL|LPLFINANCIAL|LR|LS|LT|LTD|LTDA|LU|LUNDBECK|LUPIN|LUXE|LUXURY|LV|LY|MA|MACYS|MADRID|MAIF|MAISON|MAKEUP|MAN|MANAGEMENT|MANGO|MAP|MARKET|MARKETING|MARKETS|MARRIOTT|MARSHALLS|MASERATI|MATTEL|MBA|MC|MCKINSEY|MD|ME|MED|MEDIA|MEET|MELBOURNE|MEME|MEMORIAL|MEN|MENU|MERCKMSD|METLIFE|MG|MH|MIAMI|MICROSOFT|MIL|MINI|MINT|MIT|MITSUBISHI|MK|ML|MLB|MLS|MM|MMA|MN|MO|MOBI|MOBILE|MODA|MOE|MOI|MOM|MONASH|MONEY|MONSTER|MORMON|MORTGAGE|MOSCOW|MOTO|MOTORCYCLES|MOV|MOVIE|MP|MQ|MR|MS|MSD|MT|MTN|MTR|MU|MUSEUM|MUTUAL|MV|MW|MX|MY|MZ|NA|NAB|NAGOYA|NAME|NATIONWIDE|NATURA|NAVY|NBA|NC|NE|NEC|NET|NETBANK|NETFLIX|NETWORK|NEUSTAR|NEW|NEWHOLLAND|NEWS|NEXT|NEXTDIRECT|NEXUS|NF|NFL|NG|NGO|NHK|NI|NICO|NIKE|NIKON|NINJA|NISSAN|NISSAY|NL|NO|NOKIA|NORTHWESTERNMUTUAL|NORTON|NOW|NOWRUZ|NOWTV|NP|NR|NRA|NRW|NTT|NU|NYC|NZ|OBI|OBSERVER|OFF|OFFICE|OKINAWA|OLAYAN|OLAYANGROUP|OLDNAVY|OLLO|OM|OMEGA|ONE|ONG|ONL|ONLINE|ONYOURSIDE|OOO|OPEN|ORACLE|ORANGE|ORG|ORGANIC|ORIGINS|OSAKA|OTSUKA|OTT|OVH|PA|PAGE|PANASONIC|PARIS|PARS|PARTNERS|PARTS|PARTY|PASSAGENS|PAY|PCCW|PE|PET|PF|PFIZER|PG|PH|PHARMACY|PHD|PHILIPS|PHONE|PHOTO|PHOTOGRAPHY|PHOTOS|PHYSIO|PICS|PICTET|PICTURES|PID|PIN|PING|PINK|PIONEER|PIZZA|PK|PL|PLACE|PLAY|PLAYSTATION|PLUMBING|PLUS|PM|PN|PNC|POHL|POKER|POLITIE|PORN|POST|PR|PRAMERICA|PRAXI|PRESS|PRIME|PRO|PROD|PRODUCTIONS|PROF|PROGRESSIVE|PROMO|PROPERTIES|PROPERTY|PROTECTION|PRU|PRUDENTIAL|PS|PT|PUB|PW|PWC|PY|QA|QPON|QUEBEC|QUEST|QVC|RACING|RADIO|RAID|RE|READ|REALESTATE|REALTOR|REALTY|RECIPES|RED|REDSTONE|REDUMBRELLA|REHAB|REISE|REISEN|REIT|RELIANCE|REN|RENT|RENTALS|REPAIR|REPORT|REPUBLICAN|REST|RESTAURANT|REVIEW|REVIEWS|REXROTH|RICH|RICHARDLI|RICOH|RIGHTATHOME|RIL|RIO|RIP|RMIT|RO|ROCHER|ROCKS|RODEO|ROGERS|ROOM|RS|RSVP|RU|RUGBY|RUHR|RUN|RW|RWE|RYUKYU|SA|SAARLAND|SAFE|SAFETY|SAKURA|SALE|SALON|SAMSCLUB|SAMSUNG|SANDVIK|SANDVIKCOROMANT|SANOFI|SAP|SARL|SAS|SAVE|SAXO|SB|SBI|SBS|SC|SCA|SCB|SCHAEFFLER|SCHMIDT|SCHOLARSHIPS|SCHOOL|SCHULE|SCHWARZ|SCIENCE|SCJOHNSON|SCOR|SCOT|SD|SE|SEARCH|SEAT|SECURE|SECURITY|SEEK|SELECT|SENER|SERVICES|SES|SEVEN|SEW|SEX|SEXY|SFR|SG|SH|SHANGRILA|SHARP|SHAW|SHELL|SHIA|SHIKSHA|SHOES|SHOP|SHOPPING|SHOUJI|SHOW|SHOWTIME|SHRIRAM|SI|SILK|SINA|SINGLES|SITE|SJ|SK|SKI|SKIN|SKY|SKYPE|SL|SLING|SM|SMART|SMILE|SN|SNCF|SO|SOCCER|SOCIAL|SOFTBANK|SOFTWARE|SOHU|SOLAR|SOLUTIONS|SONG|SONY|SOY|SPACE|SPORT|SPOT|SPREADBETTING|SR|SRL|SS|ST|STADA|STAPLES|STAR|STATEBANK|STATEFARM|STC|STCGROUP|STOCKHOLM|STORAGE|STORE|STREAM|STUDIO|STUDY|STYLE|SU|SUCKS|SUPPLIES|SUPPLY|SUPPORT|SURF|SURGERY|SUZUKI|SV|SWATCH|SWIFTCOVER|SWISS|SX|SY|SYDNEY|SYMANTEC|SYSTEMS|SZ|TAB|TAIPEI|TALK|TAOBAO|TARGET|TATAMOTORS|TATAR|TATTOO|TAX|TAXI|TC|TCI|TD|TDK|TEAM|TECH|TECHNOLOGY|TEL|TEMASEK|TENNIS|TEVA|TF|TG|TH|THD|THEATER|THEATRE|TIAA|TICKETS|TIENDA|TIFFANY|TIPS|TIRES|TIROL|TJ|TJMAXX|TJX|TK|TKMAXX|TL|TM|TMALL|TN|TO|TODAY|TOKYO|TOOLS|TOP|TORAY|TOSHIBA|TOTAL|TOURS|TOWN|TOYOTA|TOYS|TR|TRADE|TRADING|TRAINING|TRAVEL|TRAVELCHANNEL|TRAVELERS|TRAVELERSINSURANCE|TRUST|TRV|TT|TUBE|TUI|TUNES|TUSHU|TV|TVS|TW|TZ|UA|UBANK|UBS|UG|UK|UNICOM|UNIVERSITY|UNO|UOL|UPS|US|UY|UZ|VA|VACATIONS|VANA|VANGUARD|VC|VE|VEGAS|VENTURES|VERISIGN|VERSICHERUNG|VET|VG|VI|VIAJES|VIDEO|VIG|VIKING|VILLAS|VIN|VIP|VIRGIN|VISA|VISION|VIVA|VIVO|VLAANDEREN|VN|VODKA|VOLKSWAGEN|VOLVO|VOTE|VOTING|VOTO|VOYAGE|VU|VUELOS|WALES|WALMART|WALTER|WANG|WANGGOU|WATCH|WATCHES|WEATHER|WEATHERCHANNEL|WEBCAM|WEBER|WEBSITE|WED|WEDDING|WEIBO|WEIR|WF|WHOSWHO|WIEN|WIKI|WILLIAMHILL|WIN|WINDOWS|WINE|WINNERS|WME|WOLTERSKLUWER|WOODSIDE|WORK|WORKS|WORLD|WOW|WS|WTC|WTF|XBOX|XEROX|XFINITY|XIHUAN|XIN|XN--11B4C3D|XN--1CK2E1B|XN--1QQW23A|XN--2SCRJ9C|XN--30RR7Y|XN--3BST00M|XN--3DS443G|XN--3E0B707E|XN--3HCRJ9C|XN--3OQ18VL8PN36A|XN--3PXU8K|XN--42C2D9A|XN--45BR5CYL|XN--45BRJ9C|XN--45Q11C|XN--4GBRIM|XN--54B7FTA0CC|XN--55QW42G|XN--55QX5D|XN--5SU34J936BGSG|XN--5TZM5G|XN--6FRZ82G|XN--6QQ986B3XL|XN--80ADXHKS|XN--80AO21A|XN--80AQECDR1A|XN--80ASEHDB|XN--80ASWG|XN--8Y0A063A|XN--90A3AC|XN--90AE|XN--90AIS|XN--9DBQ2A|XN--9ET52U|XN--9KRT00A|XN--B4W605FERD|XN--BCK1B9A5DRE4C|XN--C1AVG|XN--C2BR7G|XN--CCK2B3B|XN--CG4BKI|XN--CLCHC0EA0B2G2A9GCD|XN--CZR694B|XN--CZRS0T|XN--CZRU2D|XN--D1ACJ3B|XN--D1ALF|XN--E1A4C|XN--ECKVDTC9D|XN--EFVY88H|XN--FCT429K|XN--FHBEI|XN--FIQ228C5HS|XN--FIQ64B|XN--FIQS8S|XN--FIQZ9S|XN--FJQ720A|XN--FLW351E|XN--FPCRJ9C3D|XN--FZC2C9E2C|XN--FZYS8D69UVGM|XN--G2XX48C|XN--GCKR3F0F|XN--GECRJ9C|XN--GK3AT1E|XN--H2BREG3EVE|XN--H2BRJ9C|XN--H2BRJ9C8C|XN--HXT814E|XN--I1B6B1A6A2E|XN--IMR513N|XN--IO0A7I|XN--J1AEF|XN--J1AMH|XN--J6W193G|XN--JLQ61U9W7B|XN--JVR189M|XN--KCRX77D1X4A|XN--KPRW13D|XN--KPRY57D|XN--KPU716F|XN--KPUT3I|XN--L1ACC|XN--LGBBAT1AD8J|XN--MGB9AWBF|XN--MGBA3A3EJT|XN--MGBA3A4F16A|XN--MGBA7C0BBN0A|XN--MGBAAKC7DVF|XN--MGBAAM7A8H|XN--MGBAB2BD|XN--MGBAH1A3HJKRD|XN--MGBAI9AZGQP6J|XN--MGBAYH7GPA|XN--MGBBH1A|XN--MGBBH1A71E|XN--MGBC0A9AZCG|XN--MGBCA7DZDO|XN--MGBCPQ6GPA1A|XN--MGBERP4A5D4AR|XN--MGBGU82A|XN--MGBI4ECEXP|XN--MGBPL2FH|XN--MGBT3DHD|XN--MGBTX2B|XN--MGBX4CD0AB|XN--MIX891F|XN--MK1BU44C|XN--MXTQ1M|XN--NGBC5AZD|XN--NGBE9E0A|XN--NGBRX|XN--NODE|XN--NQV7F|XN--NQV7FS00EMA|XN--NYQY26A|XN--O3CW4H|XN--OGBPF8FL|XN--OTU796D|XN--P1ACF|XN--P1AI|XN--PBT977C|XN--PGBS0DH|XN--PSSY2U|XN--Q7CE6A|XN--Q9JYB4C|XN--QCKA1PMC|XN--QXA6A|XN--QXAM|XN--RHQV96G|XN--ROVU88B|XN--RVC1E0AM3E|XN--S9BRJ9C|XN--SES554G|XN--T60B56A|XN--TCKWE|XN--TIQ49XQYJ|XN--UNUP4Y|XN--VERMGENSBERATER-CTB|XN--VERMGENSBERATUNG-PWB|XN--VHQUV|XN--VUQ861B|XN--W4R85EL8FHU5DNRA|XN--W4RS40L|XN--WGBH1C|XN--WGBL6A|XN--XHQ521B|XN--XKC2AL3HYE2A|XN--XKC2DL3A5EE0H|XN--Y9A3AQ|XN--YFRO4I67O|XN--YGBI2AMMX|XN--ZFR164B|XXX|XYZ|YACHTS|YAHOO|YAMAXUN|YANDEX|YE|YODOBASHI|YOGA|YOKOHAMA|YOU|YOUTUBE|YT|YUN|ZA|ZAPPOS|ZARA|ZERO|ZIP|ZM|ZONE|ZUERICH|ZW|TEST)";
		var non_latin_alphabet_ranges = "А-Яа-я\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0\\u08A2-\\u08AC\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA697\\uA6A0-\\uA6E5\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA793\\uA7A0-\\uA7AA\\uA7F8-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC";
		var email_address = "([a-z0-9!#$%&'*+=?^_`{|}~-]+(\\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*)";
		var domain_with_tld = "([a-z0-9]+(-+[a-z0-9]+)*\\.)+(" + tlds + ")";
		var domain_with_any_tld = "([a-z0-9]+(-+[a-z0-9]+)*\\.)+([a-z0-9][a-z0-9-]{0," + (tlds.split("|").sort(function(a, b){return b.length - a.length;})[0].length - 2) + "}[a-z0-9])";
		var allowed_in_path = "a-zA-Z\\d\\-._~\\!$&*+,;=:@%\\[\\]()";
		var path = "(((\\/(([" + allowed_in_path + "]+(\\/[" + allowed_in_path + "]*)*))?)?)((\\?([" + allowed_in_path + "\\/?]*))?)((\\#([" + allowed_in_path + "\\/?]*))?))?";
		var ipv4 = "((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
		var ipv6 = "\\[(([a-f0-9:]+:+)+[a-f0-9]+)\\]";
		var port = "(:(\\d{1,5}))?";
		var protocol = "(https?:|ftps?:)\\/\\/";
		var confirmed_by_protocol = "(" + protocol + ")\\S+";
		var additional_slashes = "(([\\/]?))+";
		var fqdn = "(((" + protocol + ")?(" + domain_with_tld + "|" + ipv4 + "|(" + protocol + ")(" + ipv6 + "|" + domain_with_any_tld + "))(?!@\\w)" + port + ")|(" + confirmed_by_protocol + "))";
		var non_latin_matches = fqdn + "((((\\/(([" + allowed_in_path + "]+(\\/[" + allowed_in_path + non_latin_alphabet_ranges + "]*)*))?)?)((\\?([" + allowed_in_path + "\\/?]*))?)((\\#([" + allowed_in_path + "\\/?]*))?))?\\b((([" + allowed_in_path + "\\/" + non_latin_alphabet_ranges + "][a-zA-Z\\d\\-_~+=\\/" + non_latin_alphabet_ranges + "]+)?))+)";
		var email = "\\b(mailto:)?" + email_address + "@(" + domain_with_tld + "|" + ipv4 + ")\\b";
		var url = "(" + non_latin_matches + ")|(\\b" + fqdn + path + "\\b" + additional_slashes + ")";
		var file = "(file:\\/\\/\\/)([a-z]+:(\\/|\\\\)+)?([\\w.]+([\\/\\\\]?)+)+";
		var phone = "(?:(?:(?:(\\+)?\\d{1,3}[-\\040.]?)?\\s?\\(?\\d{3}\\)?\\s?[-\\040.]?\\d{3}[-\\040.]?(\\d{4}|\\d{2}[-\\040.]?\\d{2}))|(?:(\\+)(?:9[976]\\d|8[987530]\\d|6[987]\\d|5[90]\\d|42\\d|3[875]\\d|2[98654321]\\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)[-\\040.]?(?:\\d[-\\040.]?){6,12}\\d+))([,;]+[0-9]+#?)*";
		
		_STR_REGEXP_EV = {
			extract: {
				url: new RegExp("(" + url + ")", "gi"),
				email: new RegExp("(" + email + ")", "gi"),
				phone: new RegExp(phone, "g"),
				ip: new RegExp("(" + ipv4 + "|" + ipv6 + ")", "gi"),
				file: new RegExp("(" + file + ")", "gi")
			},
			validate: {
				url: new RegExp("^(" + url + ")$", "i"),
				email: new RegExp("^(" + email + ")$", "i"),
				phone: new RegExp("^" + phone + "$"),
				ip: new RegExp("^(" + ipv4 + "|" + ipv6 + ")$", "i"),
				file: new RegExp("^(" + file + ")$", "i")
			}
		};
	};
	return !_is_nilb(mode) && !_is_nilb(type) ? _STR_REGEXP_EV[mode][type] : (!_is_nilb(mode) && _is_nilb(type) ? _STR_REGEXP_EV[mode] : _STR_REGEXP_EV);
};
function _extract_urls(str){
	return _uniq_arr(_avoid_nil(str.match(_regexp_extract_validation("extract", "url")), []));
};
function _extract_emails(str){
	return _uniq_arr(_avoid_nil(str.match(_regexp_extract_validation("extract", "email")), []));
};
function _extract_phone_numbers(str){
	return _uniq_arr(_avoid_nil(str.match(_regexp_extract_validation("extract", "phone")), []));
};
function _extract_ips(str){
	return _uniq_arr(_avoid_nil(str.match(_regexp_extract_validation("extract", "ip")), []));
};
function _extract_files(str){
	return _uniq_arr(_avoid_nil(str.match(_regexp_extract_validation("extract", "file")), []));
};
function _validate_url(str){
	return _regexp_extract_validation("validate", "url").test(str);
};
function _validate_email(str){
	return _regexp_extract_validation("validate", "email").test(str);
};
function _validate_phone_number(str){
	return _regexp_extract_validation("validate", "phone").test(str);
};
function _validate_ip(str){
	return _regexp_extract_validation("validate", "ip").test(str);
};
function _validate_file(str){
	return _regexp_extract_validation("validate", "file").test(str);
};
function _query_string_decode(qs, sep, eq, options){
	sep = _avoid_nil(sep, '&');
	eq = _avoid_nil(eq, '=');
	var obj = {};

	if(typeof qs !== 'string' || qs.length === 0){
		return obj;
	};

	var regexp = /\+/g;
	qs = qs.replace(/^\?/, "").split(sep);

	var maxKeys = 1000;
	if(options && typeof options.maxKeys === 'number'){
		maxKeys = options.maxKeys;
	};

	var len = qs.length;
	if(maxKeys > 0 && len > maxKeys){
		len = maxKeys;
	};

	for(var i = 0; i < len; ++i){
		var x = qs[i].replace(regexp, '%20');
		var idx = x.indexOf(eq);
		var kstr = '';
		var vstr = '';
		var k = '';
		var v = '';

		if(idx >= 0){
			kstr = x.substr(0, idx);
			vstr = x.substr(idx + 1);
		}else{
			kstr = x;
			vstr = '';
		};

		k = decodeURIComponent(kstr);
		v = decodeURIComponent(_from_string(vstr));

		if (!obj.hasOwnProperty(k)) {
			obj[k] = v;
		} else if (Array.isArray(obj[k])) {
			obj[k].push(v);
		} else {
			obj[k] = [obj[k], v];
		};
	};

	return obj;
};
function _query_string_encode(obj, sep, eq, name){
	sep = _avoid_nil(sep, '&');
	eq = _avoid_nil(eq, '=');
	if(obj === null){
		obj = undefined;
	};

	if(typeof obj === 'object'){
		return Object.keys(obj).map(function(k){
			var ks = encodeURIComponent(_to_string(k)) + eq;
			if (Array.isArray(obj[k])) {
				return obj[k].map(function(v){
					return ks + encodeURIComponent(_to_string(v));
				}).join(sep);
			} else {
				return ks + encodeURIComponent(_to_string(obj[k]));
			}
		}).filter(Boolean).join(sep);
	};

	if (!name) return '';
	return encodeURIComponent(_to_string(name)) + eq + encodeURIComponent(_to_string(obj));
};
function _parse_url(url){
	url = _trim_left(url, "\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF");
	if(!_validate_url(url) && !_validate_file(url)){
		fail(_K=="ru" ? ("Указан недействительный URL | " + url) : ("Invalid URL specified | " + url));
	};
	var required = function(port, protocol){
		protocol = protocol.split(':')[0];
		port = +port;

		if(!port){return false};

		switch (protocol){
			case 'http':
			case 'ws':
				return port !== 80;

			case 'https':
			case 'wss':
				return port !== 443;

			case 'ftp':
				return port !== 21;

			case 'gopher':
				return port !== 70;

			case 'file':
				return false;
		}

		return port !== 0;
	};
	var extract_protocol = function(address){
		var match = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i.exec(address);

		return {
			protocol: match[1] ? match[1].toLowerCase() : '',
			slashes: !!match[2],
			rest: match[3],
			href: address.replace(/\/$/, "")
		};
	};
	var instructions = [
		['#', 'hash'],
		['?', 'query'],
		function sanitize(url){
			return url.replace('\\', '/');
		},
		['/', 'pathname'],
		['@', 'auth', 1],
		[NaN, 'host', undefined, 1, 1],
		[/:(\d+)$/, 'port', undefined, 1],
		[NaN, 'hostname', undefined, 1, 1]
	];
	var instruction = '';
	var index = '';
	var obj = extract_protocol(url || '');
	url = obj.rest;
	delete obj.rest;
	if(!obj.slashes){instructions[3] = [/(.*)/, 'pathname']};
	
	for(var i = 0; i < instructions.length; i++){
		instruction = instructions[i];

		if(typeof instruction === 'function'){
			url = instruction(url);
			continue;
		};

		var parse = instruction[0];
		var key = instruction[1];

		if (parse !== parse){
			obj[key] = url;
		} else if ('string' === typeof parse) {
			if (~(index = url.indexOf(parse))) {
				if ('number' === typeof instruction[2]) {
					obj[key] = url.slice(0, index);
					url = url.slice(index + instruction[2]);
				} else {
					obj[key] = url.slice(index);
					url = url.slice(0, index);
				}
			}
		} else if ((index = parse.exec(url))) {
			obj[key] = index[1];
			url = url.slice(0, index.index);
		}

		obj[key] = obj[key] || '';
		
		if(instruction[4]){obj[key] = obj[key].toLowerCase()};
	};
	
	obj.query = _query_string_decode(obj.query);
	
	if(!required(obj.port, obj.protocol)){
		obj.host = obj.hostname;
		obj.port = '';
	}
	
	if(obj.auth){
		instruction = obj.auth.split(':');
		obj.username = instruction[0] || '';
		obj.password = instruction[1] || '';
	}else{
		obj.username = '';
		obj.password = '';
	};
	
	obj.origin = obj.protocol && obj.host && obj.protocol !== 'file:' ? obj.protocol +'//'+ obj.host : 'null';
	
	return obj;
};
function _parse_ua(uastring, extensions){
	uastring = _trim(uastring, "\\x09\\x0A\\x0B\\x0C\\x0D\\x20\\xA0\\u1680\\u180E\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000\\u2028\\u2029\\uFEFF");

    if (typeof uastring === 'object') {
        extensions = uastring;
        uastring = undefined;
    }

    if (!(this instanceof _parse_ua)) {
        return new _parse_ua(uastring, extensions).getResult();
    }
	
	var EMPTY = '';
	var UNKNOWN = '?';
	var FUNC_TYPE = 'function';
	var UNDEF_TYPE = 'undefined';
	var OBJ_TYPE = 'object';
	var STR_TYPE = 'string';
	var MAJOR = 'major';
	var MODEL = 'model';
	var NAME = 'name';
	var TYPE = 'type';
	var VENDOR = 'vendor';
	var VERSION = 'version';
	var ARCHITECTURE = 'architecture';
	var CONSOLE = 'console';
	var MOBILE = 'mobile';
	var TABLET = 'tablet';
	var SMARTTV = 'smarttv';
	var WEARABLE = 'wearable';
	var EMBEDDED = 'embedded';

	var util = {
		extend: function (regexes, extensions) {
			var mergedRegexes = {};
			for (var i in regexes) {
				if (extensions[i] && extensions[i].length % 2 === 0) {
					mergedRegexes[i] = extensions[i].concat(regexes[i]);
				} else {
					mergedRegexes[i] = regexes[i];
				}
			}
			return mergedRegexes;
		},
		has: function (str1, str2) {
			if (typeof str1 === "string") {
				return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
			} else {
				return false;
			}
		},
		lowerize: function (str) {
			return str.toLowerCase();
		},
		major: function (version) {
			return typeof(version) === STR_TYPE ? version.replace(/[^\d\.]/g, '').split(".")[0] : undefined;
		},
		trim: function (str) {
			return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
		}
	};
	
	var mapper = {

		rgx: function (ua, arrays) {

			var i = 0;
			var j = '';
			var k = '';
			var p = '';
			var q = '';
			var j = '';
			var matches = '';
			var match = '';
			
			while (i < arrays.length && !matches) {

				var regex = arrays[i];
				var props = arrays[i + 1];
				j = 0;
				k = 0;
				
				while (j < regex.length && !matches) {

					matches = regex[j++].exec(ua);

					if (!!matches) {
						for (p = 0; p < props.length; p++) {
							match = matches[++k];
							q = props[p];
							if (typeof q === OBJ_TYPE && q.length > 0) {
								if (q.length == 2) {
									if (typeof q[1] == FUNC_TYPE) {
										this[q[0]] = q[1].call(this, match);
									} else {
										this[q[0]] = q[1];
									}
								} else if (q.length == 3) {
									if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
										this[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
									} else {
										this[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
									}
								} else if (q.length == 4) {
									this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
								}
							} else {
								this[q] = match ? match : undefined;
							}
						}
					}
				}
				i += 2;
			}
		},
		str: function (str, map) {

			for (var i in map) {
				if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
					for (var j = 0; j < map[i].length; j++) {
						if (util.has(map[i][j], str)) {
							return (i === UNKNOWN) ? undefined : i;
						}
					}
				} else if (util.has(map[i], str)) {
					return (i === UNKNOWN) ? undefined : i;
				}
			}
			return str;
		}
	};
	
	var maps = {browser:{oldsafari:{version:{'1.0':'/8','1.2':'/1','1.3':'/3','2.0':'/412','2.0.2':'/416','2.0.3':'/417','2.0.4':'/419','?':'/'}}},device:{amazon:{model:{'Fire Phone':['SD','KF']}},sprint:{model:{'Evo Shift 4G':'7373KT'},vendor:{'HTC':'APA','Sprint':'Sprint'}}},os:{windows:{version:{'ME':'4.90','NT 3.11':'NT3.51','NT 4.0':'NT4.0','2000':'NT 5.0','XP':['NT 5.1','NT 5.2'],'Vista':'NT 6.0','7':'NT 6.1','8':'NT 6.2','8.1':'NT 6.3','10':['NT 6.4','NT 10.0'],'RT':'ARM'}}}};
	
	var regexes = {browser:[[/(opera\smini)\/([\w\.-]+)/i,/(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,/(opera).+version\/([\w\.]+)/i,/(opera)[\/\s]+([\w\.]+)/i],[NAME,VERSION],[/(opios)[\/\s]+([\w\.]+)/i],[[NAME,'Opera Mini'],VERSION],[/\s(opr)\/([\w\.]+)/i],[[NAME,'Opera'],VERSION],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,/(avant\s|iemobile|slim)(?:browser)?[\/\s]?([\w\.]*)/i,/(bidubrowser|baidubrowser)[\/\s]?([\w\.]+)/i,/(?:ms|\()(ie)\s([\w\.]+)/i,/(rekonq)\/([\w\.]*)/i,/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i],[NAME,VERSION],[/(konqueror)\/([\w\.]+)/i],[[NAME,'Konqueror'],VERSION],[/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],[[NAME,'IE'],VERSION],[/(edge|edgios|edga|edg)\/((\d+)?[\w\.]+)/i],[[NAME,'Edge'],VERSION],[/(yabrowser)\/([\w\.]+)/i],[[NAME,'Yandex'],VERSION],[/(Avast)\/([\w\.]+)/i],[[NAME,'Avast Secure Browser'],VERSION],[/(AVG)\/([\w\.]+)/i],[[NAME,'AVG Secure Browser'],VERSION],[/(puffin)\/([\w\.]+)/i],[[NAME,'Puffin'],VERSION],[/(focus)\/([\w\.]+)/i],[[NAME,'Firefox Focus'],VERSION],[/(opt)\/([\w\.]+)/i],[[NAME,'Opera Touch'],VERSION],[/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i],[[NAME,'UCBrowser'],VERSION],[/(comodo_dragon)\/([\w\.]+)/i],[[NAME,/_/g,' '],VERSION],[/(windowswechat qbcore)\/([\w\.]+)/i],[[NAME,'WeChat(Win) Desktop'],VERSION],[/(micromessenger)\/([\w\.]+)/i],[[NAME,'WeChat'],VERSION],[/(brave)\/([\w\.]+)/i],[[NAME,'Brave'],VERSION],[/(qqbrowserlite)\/([\w\.]+)/i],[NAME,VERSION],[/(QQ)\/([\d\.]+)/i],[NAME,VERSION],[/m?(qqbrowser)[\/\s]?([\w\.]+)/i],[NAME,VERSION],[/(baiduboxapp)[\/\s]?([\w\.]+)/i],[NAME,VERSION],[/(2345Explorer)[\/\s]?([\w\.]+)/i],[NAME,VERSION],[/(MetaSr)[\/\s]?([\w\.]+)/i],[NAME],[/(LBBROWSER)/i],[NAME],[/xiaomi\/miuibrowser\/([\w\.]+)/i],[VERSION,[NAME,'MIUI Browser']],[/;fbav\/([\w\.]+);/i],[VERSION,[NAME,'Facebook']],[/safari\s(line)\/([\w\.]+)/i,/android.+(line)\/([\w\.]+)\/iab/i],[NAME,VERSION],[/headlesschrome(?:\/([\w\.]+)|\s)/i],[VERSION,[NAME,'Chrome Headless']],[/\swv\).+(chrome)\/([\w\.]+)/i],[[NAME,/(.+)/,'$1 WebView'],VERSION],[/((?:oculus|samsung)browser)\/([\w\.]+)/i],[[NAME,/(.+(?:g|us))(.+)/,'$1 $2'],VERSION],[/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i],[VERSION,[NAME,'Android Browser']],[/(sailfishbrowser)\/([\w\.]+)/i],[[NAME,'Sailfish Browser'],VERSION],[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i],[NAME,VERSION],[/(dolfin)\/([\w\.]+)/i],[[NAME,'Dolphin'],VERSION],[/(qihu|qhbrowser|qihoobrowser|360browser)/i],[[NAME,'360 Browser']],[/((?:android.+)crmo|crios)\/([\w\.]+)/i],[[NAME,'Chrome'],VERSION],[/(coast)\/([\w\.]+)/i],[[NAME,'Opera Coast'],VERSION],[/fxios\/([\w\.-]+)/i],[VERSION,[NAME,'Firefox']],[/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],[VERSION,[NAME,'Mobile Safari']],[/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],[VERSION,NAME],[/webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[[NAME,'GSA'],VERSION],[/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[NAME,[VERSION,mapper.str,maps.browser.oldsafari.version]],[/(webkit|khtml)\/([\w\.]+)/i],[NAME,VERSION],[/(navigator|netscape)\/([\w\.-]+)/i],[[NAME,'Netscape'],VERSION],[/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,/(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,/(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,/(links)\s\(([\w\.]+)/i,/(gobrowser)\/?([\w\.]*)/i,/(ice\s?browser)\/v?([\w\._]+)/i,/(mosaic)[\/\s]([\w\.]+)/i],[NAME,VERSION]],cpu:[[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],[[ARCHITECTURE,'amd64']],[/(ia32(?=;))/i],[[ARCHITECTURE,util.lowerize]],[/((?:i[346]|x)86)[;\)]/i],[[ARCHITECTURE,'ia32']],[/windows\s(ce|mobile);\sppc;/i],[[ARCHITECTURE,'arm']],[/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],[[ARCHITECTURE,/ower/,'',util.lowerize]],[/(sun4\w)[;\)]/i],[[ARCHITECTURE,'sparc']],[/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],[[ARCHITECTURE,util.lowerize]]],device:[[/\((ipad|playbook);[\w\s\),;-]+(rim|apple)/i],[MODEL,VENDOR,[TYPE,TABLET]],[/applecoremedia\/[\w\.]+ \((ipad)/],[MODEL,[VENDOR,'Apple'],[TYPE,TABLET]],[/(apple\s{0,1}tv)/i],[[MODEL,'Apple TV'],[VENDOR,'Apple'],[TYPE,SMARTTV]],[/(archos)\s(gamepad2?)/i,/(hp).+(touchpad)/i,/(hp).+(tablet)/i,/(kindle)\/([\w\.]+)/i,/\s(nook)[\w\s]+build\/(\w+)/i,/(dell)\s(strea[kpr\s\d]*[\dko])/i],[VENDOR,MODEL,[TYPE,TABLET]],[new RegExp("(kf[A-z]+)\sbuild\/.+silk\\/","i")],[MODEL,[VENDOR,'Amazon'],[TYPE,TABLET]],[new RegExp("(sd|kf)[0349hijorstuw]+\\sbuild\\/.+silk\\/","i")],[[MODEL,mapper.str,maps.device.amazon.model],[VENDOR,'Amazon'],[TYPE,MOBILE]],[/android.+aft([bms])\sbuild/i],[MODEL,[VENDOR,'Amazon'],[TYPE,SMARTTV]],[/\((ip[honed|\s\w*]+);.+(apple)/i],[MODEL,VENDOR,[TYPE,MOBILE]],[/\((ip[honed|\s\w*]+);/i],[MODEL,[VENDOR,'Apple'],[TYPE,MOBILE]],[/(blackberry)[\s-]?(\w+)/i,/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,/(hp)\s([\w\s]+\w)/i,/(asus)-?(\w+)/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/\(bb10;\s(\w+)/i],[MODEL,[VENDOR,'BlackBerry'],[TYPE,MOBILE]],[/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone|p00c)/i],[MODEL,[VENDOR,'Asus'],[TYPE,TABLET]],[new RegExp("(sony)\\s(tablet\\s[ps])\\sbuild\\/","i"),new RegExp("(sony)?(?:sgp.+)\\sbuild\\/","i")],[[VENDOR,'Sony'],[MODEL,'Xperia Tablet'],[TYPE,TABLET]],[/android.+\s([c-g]\d{4}|so[-l]\w+)(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i],[MODEL,[VENDOR,'Sony'],[TYPE,MOBILE]],[/\s(ouya)\s/i,/(nintendo)\s([wids3u]+)/i],[VENDOR,MODEL,[TYPE,CONSOLE]],[/android.+;\s(shield)\sbuild/i],[MODEL,[VENDOR,'Nvidia'],[TYPE,CONSOLE]],[/(playstation\s[34portablevi]+)/i],[MODEL,[VENDOR,'Sony'],[TYPE,CONSOLE]],[/(sprint\s(\w+))/i],[[VENDOR,mapper.str,maps.device.sprint.vendor],[MODEL,mapper.str,maps.device.sprint.model],[TYPE,MOBILE]],[/(htc)[;_\s-]+([\w\s]+(?=\)|\sbuild)|\w+)/i,/(zte)-(\w*)/i,/(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i],[VENDOR,[MODEL,/_/g,' '],[TYPE,MOBILE]],[/(nexus\s9)/i],[MODEL,[VENDOR,'HTC'],[TYPE,TABLET]],[/d\/huawei([\w\s-]+)[;\)]/i,/(nexus\s6p|vog-l29|ane-lx1|eml-l29|ele-l29)/i],[MODEL,[VENDOR,'Huawei'],[TYPE,MOBILE]],[/android.+(bah2?-a?[lw]\d{2})/i],[MODEL,[VENDOR,'Huawei'],[TYPE,TABLET]],[/(microsoft);\s(lumia[\s\w]+)/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/[\s\(;](xbox(?:\sone)?)[\s\);]/i],[MODEL,[VENDOR,'Microsoft'],[TYPE,CONSOLE]],[/(kin\.[onetw]{3})/i],[[MODEL,/\./g,' '],[VENDOR,'Microsoft'],[TYPE,MOBILE]],[new RegExp("\\s(milestone|droid(?:[2-4x]|\\s(?:bionic|x2|pro|razr))?:?(\\s4g)?)[\\w\\s]+build\\/","i"),/mot[\s-]?(\w*)/i,new RegExp("(XT\\d{3,4}) build\\/","i"),/(nexus\s6)/i],[MODEL,[VENDOR,'Motorola'],[TYPE,MOBILE]],[new RegExp("android.+\\s(mz60\\d|xoom[\\s2]{0,2})\\sbuild\\/","i")],[MODEL,[VENDOR,'Motorola'],[TYPE,TABLET]],[/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],[[VENDOR,util.trim],[MODEL,util.trim],[TYPE,SMARTTV]],[/hbbtv.+maple;(\d+)/i],[[MODEL,/^/,'SmartTV'],[VENDOR,'Samsung'],[TYPE,SMARTTV]],[/\(dtv[\);].+(aquos)/i],[MODEL,[VENDOR,'Sharp'],[TYPE,SMARTTV]],[/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,/((SM-T\w+))/i],[[VENDOR,'Samsung'],MODEL,[TYPE,TABLET]],[/smart-tv.+(samsung)/i],[VENDOR,[TYPE,SMARTTV],MODEL],[/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,/(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,/sec-((sgh\w+))/i],[[VENDOR,'Samsung'],MODEL,[TYPE,MOBILE]],[/sie-(\w*)/i],[MODEL,[VENDOR,'Siemens'],[TYPE,MOBILE]],[/(maemo|nokia).*(n900|lumia\s\d+)/i,/(nokia)[\s_-]?([\w-]*)/i],[[VENDOR,'Nokia'],MODEL,[TYPE,MOBILE]],[/android[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i],[MODEL,[VENDOR,'Acer'],[TYPE,TABLET]],[/android.+([vl]k\-?\d{3})\s+build/i],[MODEL,[VENDOR,'LG'],[TYPE,TABLET]],[/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],[[VENDOR,'LG'],MODEL,[TYPE,TABLET]],[/(lg) netcast\.tv/i],[VENDOR,MODEL,[TYPE,SMARTTV]],[/(nexus\s[45])/i,/lg[e;\s\/-]+(\w*)/i,/android.+lg(\-?[\d\w]+)\s+build/i],[MODEL,[VENDOR,'LG'],[TYPE,MOBILE]],[/(lenovo)\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+))/i],[VENDOR,MODEL,[TYPE,TABLET]],[/android.+(ideatab[a-z0-9\-\s]+)/i],[MODEL,[VENDOR,'Lenovo'],[TYPE,TABLET]],[/(lenovo)[_\s-]?([\w-]+)/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/linux;.+((jolla));/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/((pebble))app\/[\d\.]+\s/i],[VENDOR,MODEL,[TYPE,WEARABLE]],[/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i],[VENDOR,MODEL,[TYPE,MOBILE]],[/crkey/i],[[MODEL,'Chromecast'],[VENDOR,'Google'],[TYPE,SMARTTV]],[/android.+;\s(glass)\s\d/i],[MODEL,[VENDOR,'Google'],[TYPE,WEARABLE]],[/android.+;\s(pixel c)[\s)]/i],[MODEL,[VENDOR,'Google'],[TYPE,TABLET]],[/android.+;\s(pixel( [23])?( xl)?)[\s)]/i],[MODEL,[VENDOR,'Google'],[TYPE,MOBILE]],[/android.+;\s(\w+)\s+build\/hm\1/i,/android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,/android.+(mi[\s\-_]*(?:a\d|one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i,/android.+(redmi[\s\-_]*(?:note)?(?:[\s_]?[\w\s]+))\s+build/i],[[MODEL,/_/g,' '],[VENDOR,'Xiaomi'],[TYPE,MOBILE]],[/android.+(mi[\s\-_]*(?:pad)(?:[\s_]?[\w\s]+))\s+build/i],[[MODEL,/_/g,' '],[VENDOR,'Xiaomi'],[TYPE,TABLET]],[/android.+;\s(m[1-5]\snote)\sbuild/i],[MODEL,[VENDOR,'Meizu'],[TYPE,MOBILE]],[/(mz)-([\w-]{2,})/i],[[VENDOR,'Meizu'],MODEL,[TYPE,MOBILE]],[/android.+a000(1)\s+build/i,/android.+oneplus\s(a\d{4})[\s)]/i],[MODEL,[VENDOR,'OnePlus'],[TYPE,MOBILE]],[/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i],[MODEL,[VENDOR,'RCA'],[TYPE,TABLET]],[/android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i],[MODEL,[VENDOR,'Dell'],[TYPE,TABLET]],[/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i],[MODEL,[VENDOR,'Verizon'],[TYPE,TABLET]],[/android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i],[[VENDOR,'Barnes & Noble'],MODEL,[TYPE,TABLET]],[/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i],[MODEL,[VENDOR,'NuVision'],[TYPE,TABLET]],[/android.+;\s(k88)\sbuild/i],[MODEL,[VENDOR,'ZTE'],[TYPE,TABLET]],[/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i],[MODEL,[VENDOR,'Swiss'],[TYPE,MOBILE]],[/android.+[;\/]\s*(zur\d{3})\s+build/i],[MODEL,[VENDOR,'Swiss'],[TYPE,TABLET]],[/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i],[MODEL,[VENDOR,'Zeki'],[TYPE,TABLET]],[/(android).+[;\/]\s+([YR]\d{2})\s+build/i,/android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i],[[VENDOR,'Dragon Touch'],MODEL,[TYPE,TABLET]],[/android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i],[MODEL,[VENDOR,'Insignia'],[TYPE,TABLET]],[/android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i],[MODEL,[VENDOR,'NextBook'],[TYPE,TABLET]],[/android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i],[[VENDOR,'Voice'],MODEL,[TYPE,MOBILE]],[/android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i],[[VENDOR,'LvTel'],MODEL,[TYPE,MOBILE]],[/android.+;\s(PH-1)\s/i],[MODEL,[VENDOR,'Essential'],[TYPE,MOBILE]],[/android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i],[MODEL,[VENDOR,'Envizen'],[TYPE,TABLET]],[/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i],[VENDOR,MODEL,[TYPE,TABLET]],[/android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i],[MODEL,[VENDOR,'MachSpeed'],[TYPE,TABLET]],[/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i],[VENDOR,MODEL,[TYPE,TABLET]],[/android.+[;\/]\s*TU_(1491)\s+build/i],[MODEL,[VENDOR,'Rotor'],[TYPE,TABLET]],[/android.+(KS(.+))\s+build/i],[MODEL,[VENDOR,'Amazon'],[TYPE,TABLET]],[/android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i],[VENDOR,MODEL,[TYPE,TABLET]],[/\s(tablet|tab)[;\/]/i,/\s(mobile)(?:[;\/]|\ssafari)/i],[[TYPE,util.lowerize],VENDOR,MODEL],[/[\s\/\(](smart-?tv)[;\)]/i],[[TYPE,SMARTTV]],[/(android[\w\.\s\-]{0,9});.+build/i],[MODEL,[VENDOR,'Generic']]],engine:[[/windows.+\sedge\/([\w\.]+)/i],[VERSION,[NAME,'EdgeHTML']],[/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],[VERSION,[NAME,'Blink']],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,/(icab)[\/\s]([23]\.[\d\.]+)/i],[NAME,VERSION],[/rv\:([\w\.]{1,9}).+(gecko)/i],[VERSION,NAME]],os:[[/microsoft\s(windows)\s(vista|xp)/i],[NAME,VERSION],[/(windows)\snt\s6\.2;\s(arm)/i,/(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i,/(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],[NAME,[VERSION,mapper.str,maps.os.windows.version]],[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],[[NAME,'Windows'],[VERSION,mapper.str,maps.os.windows.version]],[/\((bb)(10);/i],[[NAME,'BlackBerry'],VERSION],[/(blackberry)\w*\/?([\w\.]*)/i,/(tizen|kaios)[\/\s]([\w\.]+)/i,/(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i],[NAME,VERSION],[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i],[[NAME,'Symbian'],VERSION],[/\((series40);/i],[NAME],[/mozilla.+\(mobile;.+gecko.+firefox/i],[[NAME,'Firefox OS'],VERSION],[/(nintendo|playstation)\s([wids34portablevu]+)/i,/(mint)[\/\s\(]?(\w*)/i,/(mageia|vectorlinux)[;\s]/i,/(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,/(hurd|linux)\s?([\w\.]*)/i,/(gnu)\s?([\w\.]*)/i],[NAME,VERSION],[/(cros)\s[\w]+\s([\w\.]+\w)/i],[[NAME,'Chromium OS'],VERSION],[/(sunos)\s?([\w\.\d]*)/i],[[NAME,'Solaris'],VERSION],[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i],[NAME,VERSION],[/(haiku)\s(\w+)/i],[NAME,VERSION],[/cfnetwork\/.+darwin/i,/ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i],[[VERSION,/_/g,'.'],[NAME,'iOS']],[/(mac\sos\sx)\s?([\w\s\.]*)/i,/(macintosh|mac(?=_powerpc)\s)/i],[[NAME,'Mac OS'],[VERSION,/_/g,'.']],[/((?:open)?solaris)[\/\s-]?([\w\.]*)/i,/(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i,/(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i,/(unix)\s?([\w\.]*)/i],[NAME,VERSION]]};

    var ua = uastring || ((window && window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : EMPTY);
    var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;

    this.getBrowser = function () {
        var browser = {
            name: undefined,
            version: undefined
        };
        mapper.rgx.call(browser, ua, rgxmap.browser);
        browser.major = util.major(browser.version);
        return browser;
    };
    this.getCPU = function () {
        var cpu = {
            architecture: undefined
        };
        mapper.rgx.call(cpu, ua, rgxmap.cpu);
        return cpu;
    };
    this.getDevice = function () {
        var device = {
            vendor: undefined,
            model: undefined,
            type: undefined
        };
        mapper.rgx.call(device, ua, rgxmap.device);
        return device;
    };
    this.getEngine = function () {
        var engine = {
            name: undefined,
            version: undefined
        };
        mapper.rgx.call(engine, ua, rgxmap.engine);
        return engine;
    };
    this.getOS = function () {
        var os = {
            name: undefined,
            version: undefined
        };
        mapper.rgx.call(os, ua, rgxmap.os);
        return os;
    };
    this.getResult = function () {
        return {
            ua: this.getUA(),
            browser: this.getBrowser(),
            engine: this.getEngine(),
            os: this.getOS(),
            device: this.getDevice(),
            cpu: this.getCPU()
        };
    };
    this.getUA = function () {
        return ua;
    };
    this.setUA = function (uastring) {
        ua = uastring;
        return this;
    };
    return this;
};
function _uniq_arr(arr){
	return arr.filter(function(e,i){return arr.indexOf(e)===i});
};
function _is_json_string(str){
	if((str.indexOf("[") > -1 && str.indexOf("]") > -1) || (str.indexOf("{") > -1 && str.indexOf("}") > -1)){
		try{
			JSON.parse(str);
		}catch(e){
			return false;
		};
		return true;
	}else{
		return false;
	};
};
function _convert_to_list(str){
	return (str==="" || typeof str=="object") ? str : (_is_json_string(str) ? JSON.parse(str) : str.split(/,\s|,/));
};
function _from_string(str){
    return (typeof str=="string" && str!=="") ? (isNaN(str) ? (str=="true" || str=="false" ? str=="true" : (_is_json_string(str) ? JSON.parse(str) : (str=="null" ? null : (str=="undefined" ? undefined : str)))) : Number(str)) : str;
};
function _is_nil(str){
	return typeof str==="undefined" || str===null;
};
function _is_nilb(str){
	return _is_nil(str) || str==="";
};
function _avoid_nil(str, def){
	return _is_nil(str) ? _avoid_nil(def, "") : str;
};
function _avoid_nilb(str, def){
	return _is_nilb(str) ? _avoid_nil(def, "") : str;
};