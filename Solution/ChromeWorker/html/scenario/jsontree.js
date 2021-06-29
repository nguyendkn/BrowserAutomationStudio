
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
      root = _jsArray('', data);
    }

    if (_.isObject(data)) {
      root = _jsObject('', data);
    }

    instances += 1;
    return `<div class="jst-tree">${root}</div>`;
  };

  this.toggle = function (elem) {
    var $collection = $(elem).next('ul');

    if ($collection.hasClass('jst-collapsed')) {
      elem.className = 'jst-collapse';
    } else {
      elem.className = 'jst-expand';
    }

    $collection.toggleClass('jst-collapsed');
    BrowserAutomationStudio_PreserveInterfaceState();
  };

  var _path = function (name) {
    return '/' + path.concat(name || '').filter((v) => v.length).join('/');
  };

  var _id = function () {
    return "jsontree_" + instances + '_' + internalId++;
  };

  var _jsValue = function (label, value) {
    switch (typeof value) {
      case 'boolean':
        return _jsBoolean(label, value);
      case 'number':
        return _jsNumber(label, value);
      case 'string':
        if (value.indexOf("__DATE__") == 0) {
          value = value.slice(8)
          return _jsDate(label, value);
        }
        return _jsString(label, value);
      default:
        if (_.isNull(value)) {
          return _jsNull(label);
        }
        if (_.isArray(value)) {
          return _jsArray(label, value);
        }
        if (_.isObject(value)) {
          return _jsObject(label, value);
        }
        throw new Error('Can not resolve value type');
    }
  };

  var _jsObject = function (label, value) {
    path.push(label);
    const html = _collection(value, { 'data-type': 'object', 'data-path': _path() }, ['{', '}']);
    path.pop();
    return html;
  };

  var _jsArray = function (label, value) {
    path.push(label);
    const html = _collection(value, { 'data-type': 'array', 'data-path': _path() }, ['[', ']']);
    path.pop();
    return html;
  };

  var _collapse = function (data) {
    if (_.size(data)) {
      var onClick = 'onclick="JSONTree.toggle(this); return false;"';
      return '<span class="jst-collapse" ' + onClick + '></span>';
    }
    return '';
  };

  var _collection = function (value, attrs, brackets) {
    const closing = _element(brackets[1], { class: 'jst-bracket' });
    const opening = _element(brackets[0], { class: 'jst-bracket' });

    var data = Object.keys(value).map((key, idx, arr) => {
      var html = ['<li class="jst-item">'];
      html.push(_property(key, value[key]));
      if (idx !== arr.length - 1) {
        html.push(_comma());
      }
      html.push('</li>');
      return html.join('');
    }).join('');

    if (data.length) {
      const element = _element(data, { class: 'jst-list', ...attrs }, 'ul');
      return `${opening}${_collapse(value)}${element}${closing}`;
    }

    return opening + closing;
  };

  var _jsString = function (name, value) {
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
    return _element(_quote(_.escape(cut.data)), { class: 'jst-node-string', id: id, 'data-path': _path(name), ...defaultAttributes }) + clip;
  };

  var _jsBoolean = function (name, value) {
    return _element(value, { class: 'jst-node-boolean', 'data-path': _path(name), ...defaultAttributes });
  };

  var _jsNumber = function (name, value) {
    return _element(value, { class: 'jst-node-number', 'data-path': _path(name), ...defaultAttributes });
  };

  var _jsDate = function (name, value) {
    return _element(value, { class: 'jst-node-date', 'data-path': _path(name), ...defaultAttributes });
  };

  var _jsNull = function (name, value) {
    return _element(null, { class: 'jst-node-null', 'data-path': _path(name), ...defaultAttributes });
  };

  var _property = function (name, value) {
    var property = _element(_.escape(name), { class: 'jst-property' });
    return [property + _colon(), _jsValue(name, value)].join('');
  };

  var _colon = function () {
    return _element(': ', { class: 'jst-colon' });
  };

  var _comma = function () {
    return _element('\n', { class: 'jst-comma' });
  };

  var _element = function (content, attrs, tag = 'span') {
    attrs = Object.keys(attrs).map((key) => {
      return `${key}="${attrs[key]}"`;
    }).join(' ');
    return `<${tag} ${attrs}>${content}</${tag}>`;
  };

  return this;
})();
