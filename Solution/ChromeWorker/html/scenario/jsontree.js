(function (global) {
  const defaultAttributes = {
    contenteditable: true,
    spellcheck: false,
  };

  let path = [];

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
      path = [];

      if (isArray(data)) {
        this.root = _renderArray('', data, this.config.rootSort);
      }

      if (isObject(data)) {
        this.root = _renderObject('', data, this.config.rootSort);
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
      el.nextSibling.classList.add('jst-collapsed');
      el.className = 'jst-expand';
      this.onCollapse();
    }

    expand(el) {
      el.nextSibling.classList.remove('jst-collapsed');
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
          return _renderArray(name, value);
        }
        if (isObject(value)) {
          return _renderObject(name, value);
        }
    }

    throw new Error(`Failed to detect value type`);
  }

  function _collection(value, type, path, brackets, sortFn) {
    return (/*html*/`
      <span class="jst-bracket">${brackets[0]}</span>
      <span class="jst-collapse"></span>
      <ul class="jst-list" data-type="${type}" data-path="${path}">
      ${(() => {
        const keys = Object.keys(value);

        if (keys.length) {
          if (sortFn) keys.sort(sortFn);

          return keys.map((key, idx, arr) => {
            return (/*html*/`
              <li class="jst-item">
                ${_property(key, value[key])}
                ${idx !== arr.length - 1 ? _comma() : ''}
              </li>
            `);
          }).join('')
        }
        return '';
      })()}
      </ul>
      <span class="jst-bracket">${brackets[1]}</span>
    `);
  }

  function _renderObject(name, value, sortFn) {
    path.push(name);
    const html = _collection(value, 'object', _path(), ['{', '}'], sortFn);
    path.pop();
    return html;
  }

  function _renderArray(name, value, sortFn) {
    path.push(name);
    const html = _collection(value, 'array', _path(), ['[', ']'], sortFn);
    path.pop();
    return html;
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
    return _element(':', { class: 'jst-colon' });
  }

  function _comma() {
    return _element(',', { class: 'jst-comma' });
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