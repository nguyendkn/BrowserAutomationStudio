(function (global) {
  class JSONTree {
    static colors = {
      undefined: '#808080',
      boolean: '#2525cc',
      string: '#2db669',
      number: '#d036d0',
      date: '#ce904a',
      null: '#808080',
    };

    constructor (elem, config = {}) {
      elem.innerHTML = (/*html*/`<div class="jst-root"></div>`);
      this.onCollapse = config.onCollapse || (() => { });
      this.onExpand = config.onExpand || (() => { });
      this.format = config.format || ((v) => v);
      this.config = config;
      this.elem = elem;
    }

    render(data) {
      this.data = data;
      this.root = null;

      if (isArray(data)) {
        this.root = _jsArray('', data, '', this.config.rootSort);
      }

      if (isObject(data)) {
        this.root = _jsObject('', data, '', this.config.rootSort);
      }

      if (!this.listenersAttached) {
        const $elem = $(this.elem);

        $elem.on('click', '.jst-item > .fa-minus-circle', (e) => {
          e.preventDefault();
          const $el = $(e.target), $node = $el.prev();
          const text = $node.text().slice(1, -1);

          $node.text(`"${b64_to_utf8($node.data('value'))}"`).data('value', utf8_to_b64(text));
          $el.removeClass('fa-minus-circle').addClass('fa-plus-circle');
        });

        $elem.on('click', '.jst-item > .fa-plus-circle', (e) => {
          e.preventDefault();
          const $el = $(e.target), $node = $el.prev();
          const text = $node.text().slice(1, -1);

          $node.text(`"${b64_to_utf8($node.data('value'))}"`).data('value', utf8_to_b64(text));
          $el.removeClass('fa-plus-circle').addClass('fa-minus-circle');
        });

        $elem.on('click', '.jst-collapse', (e) => {
          this.collapse(e.target);
          e.preventDefault();
        });

        $elem.on('click', '.jst-expand', (e) => {
          this.expand(e.target);
          e.preventDefault();
        });

        this.listenersAttached = true;
      }

      morphdom(this.elem.firstChild, /*html*/`<div class="jst-root">${this.root || ''}</div>`, {
        onBeforeElUpdated: (el, target) => !el.isEqualNode(target),
        onNodeDiscarded: (el) => { },
        onNodeAdded: (el) => { },
        childrenOnly: true,
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

  function _collection(value, type, path, brackets, sortFn) {
    const opening = `<span class="jst-bracket">${brackets[0]}</span>`;
    const closing = `<span class="jst-bracket">${brackets[1]}</span>`;
    let keys = Object.keys(value);

    if (keys.length) {
      if (sortFn) keys = sortFn(keys);

      const data = keys.map((key, idx, arr) => {
        const html = ['<li class="jst-item">'];
        html.push(_jsNode(key, value[key], path));
        if (idx !== arr.length - 1) html.push(_comma());
        html.push('</li>');
        return html.join('');
      }).join('');

      const collapse = `<span class="jst-collapse"></span>`;
      const element = `<ul class="jst-list" data-path="${path}" data-type="${type}">${data}</ul>`;
      return opening + collapse + element + closing;
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
    return _element(`"${_.escape(data)}"`, { class: 'jst-node', 'data-path': _path(path, name), 'data-type': 'string', 'data-value': utf8_to_b64(value) }) + clip;
  }

  function _jsUndefined(name, value, path) {
    return _element(void 0, { class: 'jst-node', 'data-path': _path(path, name), 'data-type': 'undefined' });
  }

  function _jsBoolean(name, value, path) {
    return _element(value, { class: 'jst-node', 'data-path': _path(path, name), 'data-type': 'boolean' });
  }

  function _jsNumber(name, value, path) {
    return _element(value, { class: 'jst-node', 'data-path': _path(path, name), 'data-type': 'number' });
  }

  function _jsDate(name, value, path) {
    return _element(value, { class: 'jst-node', 'data-path': _path(path, name), 'data-type': 'date' });
  }

  function _jsNull(name, value, path) {
    return _element(null, { class: 'jst-node', 'data-path': _path(path, name), 'data-type': 'null' });
  }

  function _jsNode(name, value, path) {
    return _element(_.escape(name), { class: 'jst-property' }) + _colon() + (() => {
      switch (typeof (value)) {
        case 'boolean':
          return _jsBoolean(name, value, path);
        case 'number':
          return _jsNumber(name, value, path);
        case 'string':
          if (value.indexOf('__UNDEFINED__') === 0) {
            return _jsUndefined(name, value.slice(13), path);
          }
          if (value.indexOf('__DATE__') === 0) {
            return _jsDate(name, value.slice(8), path);
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
    })();
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