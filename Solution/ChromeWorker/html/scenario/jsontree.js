
var JSONTree = (function () {
  var defaultAttributes = {
    contenteditable: true,
    spellcheck: false,
  };

  var internalId = 0;
  var instances = 0;
  var path = [];

  this.create = function (data, settings) {
    let root = '';

    if (_.isArray(data)) {
      root = _jsArr('', data);
    }

    if (_.isObject(data)) {
      root = _jsObj('', data);
    }

    instances += 1;
    return `<div class="jstTree">${root}</div>`;
  };

  this.click = function (elem) {
    var $collection = $(elem).nextAll('.jstList');

    if ($collection.hasClass('jstCollapsed')) {
      elem.className = 'jstCollapse';
    } else {
      elem.className = 'jstExpand';
    }

    $collection.toggleClass('jstCollapsed');
    BrowserAutomationStudio_PreserveInterfaceState();
  };

  var _path = function (name) {
    return '/' + path.concat(name || '').filter((v) => v.length).join('/');
  };

  var _id = function () {
    return "jsontree_" + instances + '_' + internalId++;
  };

  var _jsVal = function (name, value) {
    switch (typeof value) {
      case 'boolean':
        return _jsBool(name, value);
      case 'number':
        return _jsNum(name, value);
      case 'string':
        if (value.indexOf("__DATE__") == 0) {
          value = value.slice(8)
          return _jsDate(name, value);
        }
        return _jsStr(name, value);
      default:
        if (_.isNull(value)) {
          return _jsNull(name);
        }
        if (_.isArray(value)) {
          return _jsArr(name, value);
        }
        if (_.isObject(value)) {
          return _jsObj(name, value);
        }
        throw new Error('Can not resolve value type');
    }
  };

  var _jsObj = function (label, value) {
    path.push(label);
    const html = _collection(value, { 'data-type': 'object', 'data-path': _path() }, _id(), ['{', '}'], label === '');
    path.pop();
    return html;
  };

  var _jsArr = function (label, value) {
    path.push(label);
    const html = _collection(value, { 'data-type': 'array', 'data-path': _path() }, _id(), ['[', ']'], label === '');
    path.pop();
    return html;
  };

  var _collapse = function (data) {
    if (_.size(data)) {
      var onClick = 'onclick="JSONTree.click(this); return false;"';
      return '<span class="jstCollapse" ' + onClick + '></span>';
    }
    return '';
  };

  var _collection = function (target, attrs, id, [open, close], isRoot) {
    const closing = _element(close, { id: `closing_${id}`, class: 'jstBracket' });
    const opening = _element(open, { id: `opening_${id}`, class: 'jstBracket' });

    var data = Object.keys(target).map((key, idx, arr) => {
      var html = ['<li class="jstItem">'];
      html.push(_property(key, target[key]));
      if (idx !== arr.length - 1) {
        html.push(_comma());
      }
      html.push('</li>');
      return html.join('');
    }).join('');

    if (data.length) {
      const element = _element(data, { class: 'jstList', ...attrs }, 'ul');
      return `${opening}${_collapse(target)}${element}${closing}`;
    }

    return opening + closing;
  };

  var _jsStr = function (name, value) {
    var _quote = function (value) {
      return '"' + value + '"';
    }
    var _cut = function (value) {
      return { data: (value.length > 100) ? value.substr(0, 97) + "..." : value, cut: value.length > 100 };
    }
    var cut = _cut(value);
    var id = _id();
    var clip = "";
    if (cut.cut) {
      clip = ` <i class='fa fa-plus-circle' aria-hidden='true' style='cursor:pointer' onclick='$("#${id}").text(b64_to_utf8("${_quote(utf8_to_b64(_quote(value)))}"));$(this).hide()'></i>`
    }
    return _element(_quote(_.escape(cut.data)), { class: 'jstStr', id: id, 'data-path': _path(name), ...defaultAttributes }) + clip;
  };

  var _jsNum = function (name, value) {
    return _element(value, { class: 'jstNum', 'data-path': _path(name), ...defaultAttributes });
  };

  var _jsDate = function (name, value) {
    return _element(value, { class: 'jstDate', 'data-path': _path(name), ...defaultAttributes });
  };

  var _jsBool = function (name, value) {
    return _element(value, { class: 'jstBool', 'data-path': _path(name), ...defaultAttributes });
  };

  var _jsNull = function (name) {
    return _element('null', { class: 'jstNull', 'data-path': _path(name), ...defaultAttributes });
  };

  var _property = function (name, value) {
    var property = _element(_.escape(name), { class: 'jstProperty' });
    return [property + _colon(), _jsVal(name, value)].join('');
  };

  var _colon = function () {
    return _element(': ', { class: 'jstColon' });
  };

  var _comma = function () {
    return _element('\n', { class: 'jstComma' });
  };

  var _element = function (content, attrs, tag = 'span') {
    attrs = Object.keys(attrs).map((key) => {
      return `${key}="${attrs[key]}"`;
    }).join(' ');
    return `<${tag} ${attrs}>${content}</${tag}>`;
  };

  return this;
})();
