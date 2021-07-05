(function (global) {
  const defaultAttributes = {
    contenteditable: true,
    spellcheck: false,
  };

  class JSONTree {
    constructor (elem, config) {
      elem.insertAdjacentHTML('beforeend', `<div class="jst-root"></div>`);
      this.onCollapse = config.onCollapse || (() => { });
      this.onExpand = config.onExpand || (() => { });
      this.config = config;
      this.elem = elem;
    }

    update(data) {
      const self = this;
      this.data = data;
      this.root = '';

      if (isArray(data)) {
        this.root = _jsArray('', data, '', this.config.rootSort);
      }

      if (isObject(data)) {
        this.root = _jsObject('', data, '', this.config.rootSort);
      }

      if (!this.listenersAttached) {
        const $elem = $(this.elem);

        $elem.on('click', '.jst-item > .fa-minus-circle', function (e) {
          e.preventDefault();
          const $el = $(this), $node = $el.prev();
          const text = $node.text().slice(1, -1);

          $node.text(`"${b64_to_utf8($node.data('value'))}"`).data('value', utf8_to_b64(text));
          $el.removeClass('fa-minus-circle').addClass('fa-plus-circle');
        });

        $elem.on('click', '.jst-item > .fa-plus-circle', function (e) {
          e.preventDefault();
          const $el = $(this), $node = $el.prev();
          const text = $node.text().slice(1, -1);

          $node.text(`"${b64_to_utf8($node.data('value'))}"`).data('value', utf8_to_b64(text));
          $el.removeClass('fa-plus-circle').addClass('fa-minus-circle');
        });

        $elem.on('click', '.jst-collapse', function (event) {
          event.preventDefault();
          self.collapse(this);
        });

        $elem.on('click', '.jst-expand', function (event) {
          event.preventDefault();
          self.expand(this);
        });

        this.listenersAttached = true;
      }

      morphdom(this.elem.firstChild, `<div class="jst-root">${this.root}</div>`, {
        onBeforeElUpdated: (el, target) => !el.isEqualNode(target)
      });
    }

    collapse(el) {
      el.nextElementSibling.classList.add('jst-collapsed');
      el.className = 'jst-expand';
      this.onCollapse();
    }

    expand(el) {
      el.nextElementSibling.classList.remove('jst-collapsed');
      el.className = 'jst-collapse';
      this.onExpand();
    }

    toggle(el) {
      if (el.classList.contains('jst-expand')) {
        this.collapse(el);
      } else {
        this.expand(el);
      }
    }
  }

  function _jsValue(name, value, path) {
    switch (typeof value) {
      case 'boolean':
        return _jsBoolean(name, value, path);
      case 'number':
        return _jsNumber(name, value, path);
      case 'string':
        if (value.indexOf('__DATE__') == 0) {
          value = value.slice(8)
          return _jsDate(name, value, path);
        }
        return _jsString(name, value, path);
      default:
        if (value == null) {
          return _jsNull(name, value, path);
        }
        if (isArray(value)) {
          return _jsArray(name, value, path);
        }
        if (isObject(value)) {
          return _jsObject(name, value, path);
        }
    }

    throw new Error(`Failed to detect value type`);
  }

  function _collection(value, type, path, brackets, sortFn) {
    const closing = _element(brackets[1], { class: 'jst-bracket' });
    const opening = _element(brackets[0], { class: 'jst-bracket' });
    const keys = Object.keys(value);

    if (keys.length) {
      if (sortFn) keys.sort(sortFn);

      var data = keys.map((key, idx, arr) => {
        var html = ['<li class="jst-item">'];
        html.push(_property(key, value[key], path));
        if (idx !== arr.length - 1) {
          html.push(_comma());
        }
        html.push('</li>');
        return html.join('');
      }).join('');

      const collapse = `<span class="jst-collapse"></span>`;
      const element = _element(data, { class: 'jst-list', 'data-type': type, 'data-path': path }, 'ul');
      return `${opening}${collapse}${element}${closing}`;
    }

    return opening + closing;
  }

  function _jsObject(name, value, path, sortFn) {
    return _collection(value, 'object', _path(path, name), ['{', '}'], sortFn);
  }

  function _jsArray(name, value, path, sortFn) {
    return _collection(value, 'array', _path(path, name), ['[', ']'], sortFn);
  }

  function _jsString(name, value, path) {
    const needCut = value.length > 100;
    const data = needCut ? `${value.slice(0, 97)}...` : value;
    const clip = needCut ? `<i class="fa fa-plus-circle" aria-hidden="true"></i>` : '';
    return _element(`"${_.escape(data)}"`, { class: 'jst-node-string', 'data-path': _path(path, name), 'data-value': utf8_to_b64(value), ...defaultAttributes }) + clip;
  }

  function _jsBoolean(name, value, path) {
    return _element(value, { class: 'jst-node-boolean', 'data-path': _path(path, name), ...defaultAttributes });
  }

  function _jsNumber(name, value, path) {
    return _element(value, { class: 'jst-node-number', 'data-path': _path(path, name), ...defaultAttributes });
  }

  function _jsDate(name, value, path) {
    return _element(value, { class: 'jst-node-date', 'data-path': _path(path, name), ...defaultAttributes });
  }

  function _jsNull(name, value, path) {
    return _element(null, { class: 'jst-node-null', 'data-path': _path(path, name), ...defaultAttributes });
  }

  function _property(name, value, path) {
    var property = _element(_.escape(name), { class: 'jst-property' });
    return [property + _colon(), _jsValue(name, value, path)].join('');
  }

  function _colon() {
    return /*html*/`<span class="jst-colon">:</span>`;
  }

  function _comma() {
    return /*html*/`<span class="jst-comma">,</span>`;
  }

  function _element(html, attrs, tag = 'span') {
    attrs = Object.keys(attrs).map((key) => {
      return `${key}="${attrs[key]}"`;
    }).join(' ');
    return `<${tag} ${attrs}>${html}</${tag}>`;
  }

  function _path(path, name) {
    return name ? `${path}/${name}` : path;
  }

  function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  global.JSONTree = JSONTree;
})(window);