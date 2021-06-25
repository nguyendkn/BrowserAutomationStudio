
var JSONTree = (function() {

  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#x27;',
    '/': '&#x2F;'
  };
  
  var defaultAttributes = {
    contenteditable: true,
    spellcheck: false,
  };

  var defaultSettings = {
    indent: 2
  };

  var id = 0;
  var path = [];
  var instances = 0;

  this.create = function(data, settings) {
    instances += 1;
    path = [];
    id = 0;
    return _element(_jsVal('', data, 0, false), { class: 'jstValue' });
  };

  var _escape = function(text) {
    return text.replace(/[&<>'"]/g, function(c) {
      return escapeMap[c];
    });
  };

  var _path = function(name) {
    return '/' + path.concat(name || '').filter((v) => v.length).join('/');
  };

  var _id = function() {
    return "jsontree_" + instances + '_' + id++;
  };

  var _jsVal = function(name, value, depth, indent) {
    if (value !== null) {
      var type = typeof value;
      switch (type) {
        case 'boolean':
          return _jsBool(name, value, indent ? depth : 0);
        case 'number':
          return _jsNum(name, value, indent ? depth : 0);
        case 'string':
          if(value.indexOf("__DATE__") == 0)
          {
            value = value.slice(8)
            return _jsDate(name, value, indent ? depth : 0);
          }
          return _jsStr(name, value, indent ? depth : 0);
        default:
          if (value instanceof Array) {
            return _jsArr(name, value, depth, indent);
          } else {
            return _jsObj(name, value, depth, indent);
          }
      }
    } else {
      return _jsNull(name, indent ? depth : 0);
    }
  };

  var _jsObj = function(name, object, depth, indent) {
    var id = _id(); path.push(name);
    var content = Object.keys(object).sort((a, b) => {
      var a = a.toUpperCase();
      var b = b.toUpperCase();

      if (a.indexOf("GLOBAL:") == 0 && b.indexOf("GLOBAL:") == 0 || a.indexOf("GLOBAL:") < 0 && b.indexOf("GLOBAL:") < 0) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0
      }

      if (a.indexOf("GLOBAL:") == 0 && b.indexOf("GLOBAL:") < 0) {
        return true
      }

      if (a.indexOf("GLOBAL:") < 0 && b.indexOf("GLOBAL:") == 0) {
        return false
      }

      return true;
    }).map((property) => {
      return _property(property, object[property], depth + 1, true);
    }).join(_comma());

    var body = [];

    if(depth > 0)
      body.push(_openBracket('{', indent ? depth : 0, id));

    var attrs = {id: id}
    if (depth > 1) attrs.dataopen = "true"
    body.push(_element(content, attrs))

    if (depth > 0) body.push(_closeBracket('}', depth));
    
    body = body.join('\n');
    var obj = _element(body, { 'data-type': 'object', 'data-path': _path() });
    path.pop();
    return obj;
  };

  var _jsArr = function(name, array, depth, indent) {
    var id = _id(); path.push(name);
    var content = array.map((element, index) => {
      return _jsVal(index.toString(), element, depth + 1, true);
    }).join(_comma());

    var body = [];

    if(depth > 0)
      body.push(_openBracket('[', indent ? depth : 0, id))

    var attrs = {id: id}
    if (depth > 1) attrs.dataopen = "true"
    body.push(_element(content, attrs))

    if (depth > 0) body.push(_closeBracket(']', depth))

    body = body.join('\n');
    var arr = _element(body, { 'data-type': 'array', 'data-path': _path() })
    path.pop();
    return arr;
  };

  var _jsStr = function(name, value, depth) {
    var cut = _cut(value)
    var id = _id()
    var clip = ""
    if(cut["cut"])
    {
      clip = " <i class='fa fa-plus-circle' aria-hidden='true' style='cursor:pointer' onclick='$(\"#" + id + "\").text(b64_to_utf8(" + _quote(utf8_to_b64(_quote(value))) + "));$(this).hide()'></i>"
    }
    return _element(_indent(_quote(_escape(cut["data"])), depth), { class: 'jstStr', id: id, 'data-path': _path(name), ...defaultAttributes }) + clip;
  };

  var _jsNum = function(name, value, depth) {
    return _element(_indent(value, depth), { class: 'jstNum', 'data-path': _path(name), ...defaultAttributes });
  };

  var _jsDate = function(name, value, depth) {
    return _element(_indent(value, depth), { class: 'jstDate', 'data-path': _path(name), ...defaultAttributes });
  };

  var _jsBool = function(name, value, depth) {
    return _element(_indent(value, depth), { class: 'jstBool', 'data-path': _path(name), ...defaultAttributes });
  };

  var _jsNull = function(name, depth) {
    return _element(_indent('null', depth), { class: 'jstNull', 'data-path': _path(name), ...defaultAttributes });
  };

  var _property = function(name, value, depth) {
    var property = _indent(_escape(name) + ': ', depth);
    var propertyValue = _element(_jsVal(name, value, depth, false), {});
    return _element(property + propertyValue, {class: 'jstProperty'});
  }

  var _quote = function(value) {
    return '"' + value + '"';
  }

  var _cut = function(value) {
    return {data: (value.length > 100) ? value.substr(0,97) + "..." : value, cut: value.length > 100};
  }

  var _comma = function() {
    return _element('\n', {class: 'jstComma'});
  }

  var _element = function(content, attrs) {
    var attributes = Object.keys(attrs).map((key) => {
      return `${key}="${attrs[key]}"`;
    }).join(' ');
    return `<span ${attributes}>${content}</span>`;
  }

  var _openBracket = function(symbol, depth, id) {
    return (
    _element(_indent(symbol, depth), {class: 'jstBracket'}) +
    _element('', {class: 'jstFold', onclick: 'JSONTree.toggle(\'' + id + '\')'})
    );
  }

  this.toggle = function(id) {
    var element = document.getElementById(id);
    var parent = element.parentNode;
    var toggleButton = element.previousElementSibling;
    if (element.className === '') {
      element.className = 'jstHiddenBlock';
      parent.className = 'jstFolded';
      toggleButton.className = 'jstExpand';
    } else {
      element.className = '';
      parent.className = '';
      toggleButton.className = 'jstFold';
    }
    BrowserAutomationStudio_PreserveInterfaceState();
  }

  var _closeBracket = function(symbol, depth) {
    return _element(_indent(symbol, depth), {});
  }

  var _indent = function(value, depth) {
    depth = ((depth - 1) * 4)
    if(depth < 0)
      depth = 0
    return Array(depth).join(' ') + value;
  };

  return this;
})();
