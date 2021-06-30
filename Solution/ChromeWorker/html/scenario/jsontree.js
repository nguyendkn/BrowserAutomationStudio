const JSONTree = (function () {
  var defaultAttributes = {
    contenteditable: true,
    spellcheck: false,
  };

  var listenersAttached = false;
  var path = [];

  this.create = function (data, settings) {
    let root = ''; const self = this;

    if (_.isArray(data)) {
      root = _jsArray('', data);
    }

    if (_.isObject(data)) {
      root = _jsObject('', data);
    }

    if (!listenersAttached) {
      $(document).on('click', '.jst-item > .fa-minus-circle', function (e) {
        const $el = $(this), $node = $el.prev('span');
        const text = $node.text().slice(1, -1);
        $node.text(`"${b64_to_utf8($node.data('value'))}"`)
          .data('value', utf8_to_b64(text));
        $el.removeClass('fa-minus-circle').addClass('fa-plus-circle');
        return false;
      });

      $(document).on('click', '.jst-item > .fa-plus-circle', function (e) {
        const $el = $(this), $node = $el.prev('span');
        const text = $node.text().slice(1, -1);
        $node.text(`"${b64_to_utf8($node.data('value'))}"`)
          .data('value', utf8_to_b64(text));
        $el.removeClass('fa-plus-circle').addClass('fa-minus-circle');
        return false;
      });

      $(document).on('click', '.jst-collapse', function (e) {
        self.collapse(this);
        return false;
      });

      $(document).on('click', '.jst-expand', function (e) {
        self.expand(this);
        return false;
      });

      listenersAttached = true;
    }

    return `<div class="jst-root">${root}</div>`;
  }

  this.collapse = function (el) {
    const $el = $(el); $el.next('ul').addClass('jst-collapsed');
    $el.removeClass().addClass('jst-expand');
    BrowserAutomationStudio_PreserveInterfaceState();
  }

  this.expand = function (el) {
    const $el = $(el); $el.next('ul').removeClass('jst-collapsed');
    $el.removeClass().addClass('jst-collapse');
    BrowserAutomationStudio_PreserveInterfaceState();
  }

  this.toggle = function (el) {
    if ($(el).hasClass('jst-expand')) {
      this.collapse(el);
    } else {
      this.expand(el);
    }
  }

  function _path(name) {
    return '/' + path.concat(name || '').filter((v) => v.length).join('/');
  }

  function _jsValue(name, value) {
    switch (typeof value) {
      case 'boolean':
        return _jsBoolean(name, value);
      case 'number':
        return _jsNumber(name, value);
      case 'string':
        if (value.indexOf('__DATE__') == 0) {
          value = value.slice(8)
          return _jsDate(name, value);
        }
        return _jsString(name, value);
      default:
        if (_.isNull(value)) {
          return _jsNull(name);
        }
        if (_.isArray(value)) {
          return _jsArray(name, value);
        }
        if (_.isObject(value)) {
          return _jsObject(name, value);
        }
        throw new Error('Can not resolve value type');
    }
  }

  function _jsObject(name, value) {
    path.push(name);
    const html = _collection(value, { 'data-type': 'object', 'data-path': _path() }, ['{', '}']);
    path.pop();
    return html;
  }

  function _jsArray(name, value) {
    path.push(name);
    const html = _collection(value, { 'data-type': 'array', 'data-path': _path() }, ['[', ']']);
    path.pop();
    return html;
  }

  function _collapse(data) {
    if (_.size(data)) {
      return '<span class="jst-collapse"></span>';
    }
    return '';
  }

  function _collection(value, attrs, brackets) {
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
  }

  function _jsString(name, value) {
    const needCut = value.length > 100;
    const data = needCut ? `${value.slice(0, 97)}...` : value;
    const clip = needCut ? `<i class="fa fa-plus-circle" aria-hidden="true"></i>` : '';
    return _element(`"${_.escape(data)}"`, { class: 'jst-node-string', 'data-path': _path(name), 'data-value': utf8_to_b64(value), ...defaultAttributes }) + clip;
  }

  function _jsBoolean(name, value) {
    return _element(value, { class: 'jst-node-boolean', 'data-path': _path(name), ...defaultAttributes });
  }

  function _jsNumber(name, value) {
    return _element(value, { class: 'jst-node-number', 'data-path': _path(name), ...defaultAttributes });
  }

  function _jsDate(name, value) {
    return _element(value, { class: 'jst-node-date', 'data-path': _path(name), ...defaultAttributes });
  }

  function _jsNull(name, value) {
    return _element(null, { class: 'jst-node-null', 'data-path': _path(name), ...defaultAttributes });
  }

  function _property(name, value) {
    var property = _element(_.escape(name), { class: 'jst-property' });
    return [property + _colon(), _jsValue(name, value)].join('');
  }

  function _colon() {
    return _element(': ', { class: 'jst-colon' });
  }

  function _comma() {
    return _element('\n', { class: 'jst-comma' });
  }

  function _element(content, attrs, tag = 'span') {
    attrs = Object.keys(attrs).map((key) => {
      return `${key}="${attrs[key]}"`;
    }).join(' ');
    return `<${tag} ${attrs}>${content}</${tag}>`;
  }

  return this;
})();
