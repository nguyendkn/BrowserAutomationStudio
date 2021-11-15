(({ App, Backbone, $, _ }) => {
  const { Inspector } = App;

  const Model = Backbone.Model.extend({
    defaults: () => ({
      value: null,
      type: null,
      name: null
    })
  });

  Inspector.Modal = Backbone.View.extend({
    attributes: { tabindex: '-1' },

    className: 'modal modal-centered',

    events: {
      'input [data-input-type] :input'(e) {
        const el = e.target, model = this.model;
        if (el.type === 'radio' && !el.checked) return;
        const valid = el.checkValidity() || model.get('type') === 'string';

        if (!valid) {
          this.$('#inspectorModalError').html(el.validationMessage);
        }

        $(el).closest('form').toggleClass('invalid', !valid);
        model.set('value', el.value);
      },

      'click #inspectorModalSearchVariable'(e) {
        _ActionFinder.Show();
        $("#findinput").val(this.model.get('name'));
        _ActionFinder.FindNext(true);
        this.cancel();
      },

      'click #inspectorModalClearData'(e) {
        // for (const el of this.$('form')[0].elements) {
        //   if (el.type !== 'hidden') {
        //     $(el).val('');
        //   }
        // }
      },

      'click #inspectorModalCopyData'(e) {
        const text = this.model.get('value');
        ClipboardJS.copy(text, { container: this.el });
      },

      'click #inspectorModalCopyName'(e) {
        const text = this.model.get('name');
        ClipboardJS.copy(text, { container: this.el });
      },

      'change select[data-style]'(e) {
        this.model.set('type', e.target.value);
      },

      'click .btn-accept': 'accept',

      'click .btn-cancel': 'cancel',

      'hidden.bs.modal': 'cancel',

      'keydown'(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
          this.$('.btn-accept').click();
        }
      }
    },

    initialize({ callback, value, type, name }) {
      if (['object', 'array'].includes(type)) type = 'custom';
      const attrs = { value: type === 'custom' ? JSON.stringify(value) : String(value), type, name };

      this.model = new Model(attrs).on('change', model => {
        const type = model.get('type'), $form = this.$('form');

        if (model.hasChanged('type')) {
          const $inputs = $form.trigger('reset').find('[data-input-type]');

          const $unused = $inputs.filter((_, el) => el.dataset.inputType !== type)
            .hide().find(':input').prop('required', false);

          const $target = $inputs.filter((_, el) => el.dataset.inputType === type)
            .show().find(':input').prop('required', true);

          $target.first().trigger('input');
        } else if (model.hasChanged('value')) {
          this.$('.btn-accept').prop('disabled', () => {
            const equal = _.isEqual(model.toJSON(), attrs);
            return equal || $form.hasClass('invalid');
          });
        }
      });
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template(this.model.toJSON()));
        this.$('select').selectpicker();
        this.$el.modal({ backdrop: 'static' });
      }

      return this;
    },

    accept() {
      this.options.callback({
        ...this.close().model.toJSON(),
        cancel: false
      });
      return this;
    },

    cancel() {
      this.options.callback({
        ...this.close().model.toJSON(),
        cancel: true
      });
      return this;
    },

    close() {
      this.$el.modal('hide');
      this.remove().off();
      return this;
    },

    template: _.template(/*html*/`
      <div class="modal-dialog" role="document" style="flex: 1;">
        <div class="inspector-modal-content">
          <div class="inspector-modal-header">
            <h4><%= $t('Edit the value of the "{name}" variable', { name }) %></h4>
            <h6><%= $t('Change or set data type and value') %></h6>
            <button data-dismiss="modal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 7.05L16.95 6L12 10.95L7.05 6L6 7.05L10.95 12L6 16.95L7.05 18L12 13.05L16.95 18L18 16.95L13.05 12L18 7.05Z" fill="#606060"/>
              </svg>            
            </button>
          </div>
          <div class="inspector-modal-body">
            <select data-style="inspector-modal-select">
              <% _.each(['undefined', 'boolean', 'custom', 'string', 'number', 'date', 'null'], item => { %>
                <option class="inspector-modal-select-option" value="<%= item %>" <%= item === type ? 'selected' : '' %>>
                  <%= $t('inspector.' + item) %>
                </option>
              <% }) %>
            </select>
            <div class="inspector-modal-body-content">
              <form class="inspector-modal-form" onsubmit="return false">
                <% _.each(['undefined', 'boolean', 'custom', 'string', 'number', 'date', 'null'], item => { %>
                  <% const required = item === type ? 'required' : '' %>
                  <div data-input-type="<%= item %>" style="display: <%= item === type ? 'flex' : 'none' %>;">
                    <% if (item === 'boolean') { %>
                      <% _.each(['false', 'true'], (val, at) => { %>
                        <div class="input-radio">
                          <% const id = _.uniqueId('inspectorModalInput') %>
                          <input type="radio" id="<%= id %>" name="boolean" value="<%= val %>" <%= (type === item ? value === val : at === 0) ? 'checked' : '' %> <%= required %>>
                          <label for="<%= id %>"><%= $t(_.upperFirst(val)) %></label>
                        </div>
                      <% }) %>
                    <% } else if (item === 'custom') { %>
                      <textarea <%= required %>><%- type === item ? value : '' %></textarea>
                    <% } else if (item === 'string') { %>
                      <textarea <%= required %>><%- type === item ? value : '' %></textarea>
                    <% } else if (item === 'number') { %>
                      <input type="number" value="<%- type === item ? value : 0 %>" <%= required %>>
                    <% } else if (item === 'date' ) { %>
                      <input type="text" value="<%- type === item ? value : '' %>" <%= required %>>
                    <% } else { %>
                      <input type="hidden" value="<%= item %>">
                    <% } %>
                  </div>
                <% }) %>
                <span id="inspectorModalError"></span>
              </form>
              <div class="inspector-modal-tools dropdown" style="display: flex;">
                <button type="button" id="inspectorModalShowMenu" style="flex: 0; border-left-width: 1px;" data-toggle="dropdown">
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 5h16M0 .5h16M0 9.5h16" stroke="#606060" stroke-linecap="square"/>
                  </svg>
                </button>
                <button type="button" id="inspectorModalCopyData" style="flex: 1; border-left-width: 0px;">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3V0H2v12h4v3h9V3h-3Zm-6 8H3V1h8v2H6v8Zm8 3H7V4h7v10Z" fill="#606060" />
                  </svg>
                  <span style="margin-left: 12px;"><%= $t('Copy to clipboard') %></span>
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <a href="#" id="inspectorModalSearchVariable">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="m15.7164 15.111-4.2359-3.9328c2.1796-2.63853 1.8355-6.65365-.8031-8.83329C8.03894.165276 4.02382.509429 1.84418 3.14794-.335456 5.78644.00869703 9.80156 2.6472 11.9812c2.29436 1.9502 5.73589 1.9502 8.0302 0l4.2359 3.9329.8031-.8031ZM1.50003 7.16306c0-2.86795 2.29435-5.1623 5.16229-5.1623 2.86795 0 5.16228 2.29435 5.16228 5.1623 0 2.86794-2.29433 5.16234-5.16228 5.16234-2.86794 0-5.16229-2.2944-5.16229-5.16234Z" fill="#fff" />
                      </svg>
                      <%= $t('Search for variable in project') %>
                    </a>
                  </li>
                  <li>
                    <a href="#" id="inspectorModalCopyName">
                      <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 1v1h3v6h1V2h3V1H3ZM12 6v1h4v9h1V7h4V6h-9Z" fill="#fff" />
                      </svg>
                      <%= $t('Copy the variable name') %>
                    </a>
                  </li>
                  <li>
                    <a href="#" id="inspectorModalClearData">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.4834 14.498h11.5v1h-11.5v-1ZM13.6733 5.25329l-3.96501-3.96c-.09288-.09298-.20316-.16674-.32456-.21706C9.26233 1.0259 9.1322 1 9.00079 1c-.13142 0-.26155.0259-.38294.07623-.1214.05032-.23169.12408-.32456.21706l-7 7c-.09298.09287-.16674.20316-.21706.32456C1.0259 8.73924 1 8.86937 1 9.00079c0 .13141.0259.26154.07623.38294.05032.1214.12408.23168.21706.32456l2.255 2.29001h4.795l5.33001-5.33001c.093-.09288.1667-.20316.217-.32456.0504-.1214.0763-.25153.0763-.38294 0-.13142-.0259-.26155-.0763-.38294-.0503-.1214-.124-.23169-.217-.32456ZM7.92829 10.9983h-3.945l-2-2.00001 3.155-3.155 3.965 3.96-1.175 1.19501Zm1.88-1.88001-3.96-3.965 3.135-3.155 4.00001 3.965-3.17501 3.155Z" fill="#fff" />
                      </svg>
                      <%= $t('Clear data') %>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="inspector-modal-description">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0C3.58172 0 0 3.58172 0 8c0 4.4183 3.58172 8 8 8 4.4183 0 8-3.5817 8-8 0-4.41828-3.5817-8-8-8Z" fill="#606060" />
                  <path d="m8.26 10.168.336-4.508V3H7.112v2.66l.294 4.508h.854Zm.434 2.8v-1.666H7v1.666h1.694Z" fill="#fff" />
                </svg>
                <span style="margin-left: 14px;">Changes browser settings: network, canvas, webgl, etc.</span>
              </div>
            </div>
          </div>
          <div class="inspector-modal-footer">
            <button type="button" class="btn-base btn-accept" disabled><%= $t('Save changes') %></button>
            <button type="button" class="btn-base btn-cancel"><%= $t('Cancel') %></button>
          </div>
        </div>
      </div>
    `)
  });

  _.extend(_L, {
    'Edit the value of the "{name}" variable': { ru: 'Изменить значение переменной "{name}"' },
    'Search for variable in project': { ru: 'Поиск переменной в проекте' },
    'Copy the variable name': { ru: 'Копировать имя переменной' },
    'Copy to clipboard': { ru: 'Копировать в буфер обмена' },
    'Save changes': { ru: 'Сохранить изменения' },
    'Clear data': { ru: 'Очистить данные' },
    'inspector.undefined': { ru: 'Undefined', en: 'Undefined' },
    'inspector.boolean': { ru: 'Булево', en: 'Boolean' },
    'inspector.custom': { ru: 'Особый', en: 'Custom' },
    'inspector.object': { ru: 'Объект', en: 'Object' },
    'inspector.string': { ru: 'Строка', en: 'String' },
    'inspector.number': { ru: 'Число', en: 'Number' },
    'inspector.array': { ru: 'Массив', en: 'Array' },
    'inspector.date': { ru: 'Дата', en: 'Date' },
    'inspector.null': { ru: 'Null', en: 'Null' }
  });
})(window);
