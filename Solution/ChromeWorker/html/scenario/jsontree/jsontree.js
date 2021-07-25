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
      elem.innerHTML = (/*html*/`<ul class="jst-root"></ul>`);
      this.onCollapse = config.onCollapse || (() => { });
      this.onExpand = config.onExpand || (() => { });
      this.onRender = config.onRender || (() => { });
      this.elem = elem;
    }

    render(data) {
      let root = '';

      if (isArray(data)) {
        root = _jsArray('', data, '');
      }

      if (isObject(data)) {
        root = _jsObject('', data, '');
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

      morphdom(this.elem.firstChild, /*html*/`<ul class="jst-root">${root}</ul>`, {
        onBeforeElUpdated: (el, target) => !el.isEqualNode(target),
        onNodeDiscarded: (el) => { },
        onNodeAdded: (el) => { },
        childrenOnly: true,
      });
      this.onRender();
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

  function _collection(value, type, path, brackets) {
    const opening = `<span class="jst-bracket">${brackets[0]}</span>`;
    const closing = `<span class="jst-bracket">${brackets[1]}</span>`;
    const keys = Object.keys(value);

    if (keys.length) {
      const content = keys.map((key, idx) => {
        return _jsNode(key, value[key], path, idx === keys.length - 1)
      }).join('');

      const collapse = `<span class="jst-collapse"></span>`;
      const element = `<ul class="jst-list" data-path="${path}" data-type="${type}">${content}</ul>`;
      return opening + collapse + element + closing;
    }

    return opening + closing;
  }

  function _jsObject(name, value, path) {
    return _collection(value, 'object', _path(path, name), ['{', '}']);
  }

  function _jsArray(name, value, path) {
    return _collection(value, 'array', _path(path, name), ['[', ']']);
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

  function _jsNode(name, value, path, isLast) {
    const content = `<span class="jst-property">${_.escape(name)}</span>` + `<span class="jst-colon">:</span>` + (() => {
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

      throw new Error(`Failed to resolve value type`);
    })();

    return `<li class="jst-item">${content}${!isLast ? '<span class="jst-comma">,</span>' : ''}</li>`
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