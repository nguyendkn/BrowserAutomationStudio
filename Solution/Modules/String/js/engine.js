function _is_string(data){
	return typeof data==="string";
};
function _is_not_empty_string(str){
	return typeof str==="string" && str.length > 0;
};
function _to_string(data){
	return (typeof data=="object" && !(data instanceof Date)) ? JSON.stringify(data) : String(data);
};
function _to_number(str, dec, dsep, tsep){
	str = _avoid_nil(str);
	dec = _avoid_nil(dec);
	dsep = _avoid_nil(dsep, '.');
	tsep = _avoid_nil(tsep, ',');
	
	str = str.split(tsep).join('');
	str = str.split(dsep).join('.');
	
	if(dec===-1 || dec===""){return Number(str)};
	
	var factor = Math.pow(10, isFinite(dec) ? dec : 0);
	return Math.round(str * factor)/factor;
};
function _number_format(num, dec, dsep, tsep){
	if(_is_nil(num) || isNaN(num)){return ''};
	dec = _avoid_nil(dec);
	dsep = _avoid_nil(dsep, '.');
	tsep = _avoid_nil(tsep, ',');

	num = (dec===-1 || dec==="") ? String(num) : num.toFixed(dec);

	var parts = num.split('.');
	var fnums = parts[0];
	var decimals = parts[1] ? dsep + parts[1] : '';

	return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
};
function _count_substrings(str, sub){
	return (str.match(new RegExp(sub, "g")) || []).length;
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
	if(from < 0){
		from = str.length + from;
		if(from < 0){
			from = 0;
		};
	};
	return str.slice(0, from) + (add || "") + str.slice(from + count);
};
function _to_lower_case(str){
	return str.toLowerCase();
};
function _to_upper_case(str){
	return str.toUpperCase();
};
function _contains(str, contains){
	return str.indexOf(contains) > -1;
};
function _length(str){
	return str.length;
};
function _capitalize(str, all, lower){
	return (lower ? str.toLowerCase() : str).replace(new RegExp("(?:^|\\s|[\"'([{])+\\S", (all ? "g" : "")), function(match){return match.toUpperCase()});
};
function _words(str){
    return str.replace(/(^\s*)|(\s*$)/gi,"").replace(/[ ]{2,}/gi," ").replace(/\n /,"\n").split(' ').filter(function(s){return /([^_\-\,\.\!\?\;\:\|]+)/.test(s)}).map(function(s){return s.replace(/([_\-\,\.\!\?\;\:]+$|^[_\-\,\.\!\?\;\:]+)/g, "")});
};
function _count_words(str){
    return _words(str).length;
};
function _find_substring(str, sub){
	return str.indexOf(sub);
};
function _starts_with(str, sub){
	return str.startsWith(sub);
};
function _ends_with(str, sub){
	return str.endsWith(sub);
};
function _insert_substring(str, index, sub){
	return _splice_string(str, index, 0, sub);
};
function _is_nil(str){
	return str===undefined || str===null;
};
function _avoid_nil(str, def_val){
	return _is_nil(str) ? _avoid_nil(def_val, "") : str;
};