(function (global) {
  var defaultAttributes = {
    contenteditable: true,
    spellcheck: false,
  };

  let path = [];

  class JSONTree {
    constructor (el, data, options) {
      el.insertAdjacentHTML('beforeend', `<div class="jst-root"></div>`);
      this.options = options;
      this.data = data;
      this.el = el;
      this.update();
    }

    update(data = this.data) {
      const self = this;
      this.data = data;
      this.root = '';

      if (isArray(data)) {
        console.time('Render JSONTree array root');
        this.root = _jsArray('', data, this.options.rootSort);
        console.timeEnd('Render JSONTree array root');
      }

      if (isObject(data)) {
        console.time('Render JSONTree object root');
        this.root = _jsObject('', data, this.options.rootSort);
        console.timeEnd('Render JSONTree object root');
      }

      if (!this.listenersAttached) {
        const $el = $(this.el);

        $el.on('click', '.jst-item > .fa-minus-circle', function (e) {
          e.preventDefault();
          const $el = $(this), $node = $el.prev();
          const text = $node.text().slice(1, -1);

          $node.text(`"${b64_to_utf8($node.data('value'))}"`).data('value', utf8_to_b64(text));
          $el.removeClass('fa-minus-circle').addClass('fa-plus-circle');
        });

        $el.on('click', '.jst-item > .fa-plus-circle', function (e) {
          e.preventDefault();
          const $el = $(this), $node = $el.prev();
          const text = $node.text().slice(1, -1);

          $node.text(`"${b64_to_utf8($node.data('value'))}"`).data('value', utf8_to_b64(text));
          $el.removeClass('fa-plus-circle').addClass('fa-minus-circle');
        });

        $el.on('click', '.jst-collapse', function (event) {
          event.preventDefault();
          self.collapse(this);
        });

        $el.on('click', '.jst-expand', function (event) {
          event.preventDefault();
          self.expand(this);
        });

        this.listenersAttached = true;
      }

      morphdom(this.el.firstChild, `<div class="jst-root">${this.root}</div>`, {
        onBeforeElUpdated: (el, target) => !el.isEqualNode(target)
      });
    }

    collapse(el) {
      const $el = $(el); $el.next('ul').addClass('jst-collapsed');
      $el.removeClass().addClass('jst-expand');
      BrowserAutomationStudio_PreserveInterfaceState();
    }

    expand(el) {
      const $el = $(el); $el.next('ul').removeClass('jst-collapsed');
      $el.removeClass().addClass('jst-collapse');
      BrowserAutomationStudio_PreserveInterfaceState();
    }

    toggle(el) {
      if ($(el).hasClass('jst-expand')) {
        this.collapse(el);
      } else {
        this.expand(el);
      }
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
        if (value == null) {
          return _jsNull(name, value);
        }
        if (isArray(value)) {
          return _jsArray(name, value);
        }
        if (isObject(value)) {
          return _jsObject(name, value);
        }
    }

    throw new Error(`Failed to detect value type`);
  }

  function _jsObject(name, value, sortFn) {
    path.push(name);
    const html = _collection(value, { 'data-type': 'object', 'data-path': _path() }, ['{', '}']);
    path.pop();
    return html;
  }

  function _jsArray(name, value, sortFn) {
    path.push(name);
    const html = _collection(value, { 'data-type': 'array', 'data-path': _path() }, ['[', ']']);
    path.pop();
    return html;
  }

  function _collection(value, attrs, brackets, sortFn) {
    const collapse = !_.isEmpty(value) ? `<span class="jst-collapse"></span>` : '';
    const closing = _element(brackets[1], { class: 'jst-bracket' });
    const opening = _element(brackets[0], { class: 'jst-bracket' });
    const keys = Object.keys(value); if (sortFn) keys.sort(sortFn);

    var data = keys.map((key, idx, arr) => {
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
      return `${opening}${collapse}${element}${closing}`;
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

  function _element(html, attrs, tag = 'span') {
    attrs = Object.keys(attrs).map((key) => {
      return `${key}="${attrs[key]}"`;
    }).join(' ');
    return `<${tag} ${attrs}>${html}</${tag}>`;
  }

  function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  global.JSONTree = JSONTree;
})(window);