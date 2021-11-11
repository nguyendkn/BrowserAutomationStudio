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
      'input [data-input-type] textarea'(e) {
        if (e.target.type === 'radio' && !e.target.checked) return;
        this.model.set('value', e.target.value);
      },

      'input [data-input-type] input'(e) {
        if (e.target.type === 'radio' && !e.target.checked) return;
        this.model.set('value', e.target.value);
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

      'click .btn-accept'() {
        this.trigger('submit');
      },

      'click .btn-cancel'() {
        this.trigger('cancel');
      },

      'hidden.bs.modal'() {
        this.trigger('cancel');
      }
    },

    initialize({ callback, value, type, name }) {
      if (['object', 'array'].includes(type)) type = 'custom';
      value = type === 'custom' ? JSON.stringify(value) : String(value);

      const model = new Model({ value, type, name }).on('change:type', (__, type) => {
        const $inputs = this.$('[data-input-type]');
        $inputs.parent('form').trigger('reset');

        const $unused = $inputs.filter((_, el) => el.dataset.inputType !== type)
          .hide().find(':input').prop('required', false);

        const $target = $inputs.filter((_, el) => el.dataset.inputType === type)
          .show().find(':input').prop('required', true);

        $target.first().trigger('input');
      });

      model.bind('change', () => {
        const disabled = _.isEqual({ value, type, name }, model.toJSON());
        this.$('.btn-accept').prop('disabled', disabled);
      });

      this.bind('submit', () => {
        const valid = this.$('form')[0].reportValidity();
        if (valid || model.get('type') === 'string') this.trigger('accept');
      });

      this.once('accept', () => {
        const json = this.close().model.toJSON();
        callback({ ...json, cancel: false });
      });

      this.once('cancel', () => {
        const json = this.close().model.toJSON();
        callback({ ...json, cancel: true });
      });

      this.model = model;
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template(this.model.toJSON()));
        this.$('select').selectpicker();
        this.$el.modal({ backdrop: 'static' });
      }

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
            <h4 style="opacity: 1.0;"><%= tr('Edit the value of the "{name}" variable', { name }) %></h4>
            <h6 style="opacity: 0.5;"><%= tr('Change or set data type and value') %></h6>
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
                  <%= tr('$' + _.upperFirst(item)).slice(1) %>
                </option>
              <% }) %>
            </select>
            <div class="inspector-modal-body-content">
              <form class="inspector-modal-form" action="javascript:void(0)">
                <% const style = v => 'display: ' + (v === type ? 'block;' : 'none;') %>
                <div style="<%= style('custom') %>" data-input-type="custom">
                  <textarea><%- type === 'custom' ? value : '' %></textarea>
                </div>
                <div style="<%= style('string') %>" data-input-type="string">
                  <textarea><%- type === 'string' ? value : '' %></textarea>
                </div>
                <div style="<%= style('number') %>" data-input-type="number">
                  <input type="number" value="<%- type === 'number' ? value : 0 %>">
                </div>
                <div style="<%= style('date') %>" data-input-type="date">
                  <input type="text" value="<%- type === 'date' ? value : '' %>">
                </div>
                <div style="<%= style('boolean') %>" data-input-type="boolean">
                  <% _.each(['false', 'true'], (val, at) => { %>
                    <div class="input-radio">
                      <% const id = _.uniqueId('inspectorModalInput') %>
                      <input type="radio" id="<%= id %>" name="boolean" value="<%= val %>" <%= (type === 'boolean' ? value === val : at === 0) ? 'checked' : '' %>>
                      <label for="<%= id %>"><%= tr(_.upperFirst(val)) %></label>
                    </div>
                  <% }) %>
                </div>
                <div style="<%= style('undefined') %>" data-input-type="undefined">
                  <input type="hidden" value="undefined">
                </div>
                <div style="<%= style('null') %>" data-input-type="null">
                  <input type="hidden" value="null">
                </div>
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
                  <span style="margin-left: 12px;"><%= tr('Copy to clipboard') %></span>
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <a href="#" id="inspectorModalSearchVariable">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="m15.7164 15.111-4.2359-3.9328c2.1796-2.63853 1.8355-6.65365-.8031-8.83329C8.03894.165276 4.02382.509429 1.84418 3.14794-.335456 5.78644.00869703 9.80156 2.6472 11.9812c2.29436 1.9502 5.73589 1.9502 8.0302 0l4.2359 3.9329.8031-.8031ZM1.50003 7.16306c0-2.86795 2.29435-5.1623 5.16229-5.1623 2.86795 0 5.16228 2.29435 5.16228 5.1623 0 2.86794-2.29433 5.16234-5.16228 5.16234-2.86794 0-5.16229-2.2944-5.16229-5.16234Z" fill="#fff" />
                      </svg>
                      <%= tr('Search for variable in project') %>
                    </a>
                  </li>
                  <li>
                    <a href="#" id="inspectorModalCopyName">
                      <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 1v1h3v6h1V2h3V1H3ZM12 6v1h4v9h1V7h4V6h-9Z" fill="#fff" />
                      </svg>
                      <%= tr('Copy the variable name') %>
                    </a>
                  </li>
                  <li>
                    <a href="#" id="inspectorModalClearData">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.4834 14.498h11.5v1h-11.5v-1ZM13.6733 5.25329l-3.96501-3.96c-.09288-.09298-.20316-.16674-.32456-.21706C9.26233 1.0259 9.1322 1 9.00079 1c-.13142 0-.26155.0259-.38294.07623-.1214.05032-.23169.12408-.32456.21706l-7 7c-.09298.09287-.16674.20316-.21706.32456C1.0259 8.73924 1 8.86937 1 9.00079c0 .13141.0259.26154.07623.38294.05032.1214.12408.23168.21706.32456l2.255 2.29001h4.795l5.33001-5.33001c.093-.09288.1667-.20316.217-.32456.0504-.1214.0763-.25153.0763-.38294 0-.13142-.0259-.26155-.0763-.38294-.0503-.1214-.124-.23169-.217-.32456ZM7.92829 10.9983h-3.945l-2-2.00001 3.155-3.155 3.965 3.96-1.175 1.19501Zm1.88-1.88001-3.96-3.965 3.135-3.155 4.00001 3.965-3.17501 3.155Z" fill="#fff" />
                      </svg>
                      <%= tr('Clear data') %>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="inspector-modal-footer">
            <button type="button" class="btn-base btn-accept" disabled><%= tr('Save changes') %></button>
            <button type="button" class="btn-base btn-cancel"><%= tr('Cancel') %></button>
          </div>
        </div>
      </div>
    `)
  });

  _.extend(_L, {
    // Hack - use the `$` symbol to avoid overriding the translation after loading it from modules
    '$Date': { ru: '$Дата' },
    '$Array': { ru: '$Массив' },
    '$Number': { ru: '$Число' },
    '$String': { ru: '$Строка' },
    '$Object': { ru: '$Объект' },
    '$Custom': { ru: '$Особый' },
    '$Boolean': { ru: '$Булево' },
    'Clear data': { ru: 'Очистить данные' },
    'Save changes': { ru: 'Сохранить изменения' },
    'Copy to clipboard': { ru: 'Копировать в буфер обмена' },
    'Copy the variable name': { ru: 'Копировать имя переменной' },
    'Search for variable in project': { ru: 'Поиск переменной в проекте' },
    'Edit the value of the "{name}" variable': { ru: 'Изменить значение переменной "{name}"' }
  });
})(window);
