(({ App, Backbone, $, _ }) => {
  const { Inspector } = App;

  const Model = Backbone.Model.extend({
    defaults: () => ({
      value: null,
      type: null,
      path: null
    })
  });

  Inspector.Modal = Backbone.View.extend({
    template: _.template(String.raw`
      <div class="modal-dialog" role="document" style="flex: 1;">
        <div class="inspector-modal-content">
          <div class="inspector-modal-header">
            <h4><%= tr("Change the variable value") %></h4>
          </div>
          <div class="inspector-modal-body">
            <select id="inspectorModalSelect" data-style="inspector-modal-select">
              <% _.each(['undefined', 'boolean', 'custom', 'string', 'number', 'date', 'null'], item => { %>
                <option class="inspector-modal-select-option" value="<%= item %>" <%= item === type ? 'selected' : '' %>>
                  <%= tr(_.upperFirst(item)) %>
                </option>
              <% }) %>
            </select>
            <form class="inspector-modal-form" action="javascript:void(0)">
              <% const style = v => 'display: ' + (type === v ? 'block' : 'none') %>
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
          </div>
          <div class="inspector-modal-footer">
            <button type="button" id="inspectorModalAccept" class="btn-base btn-accept" disabled><%= tr('Save changes') %></button>
            <button type="button" id="inspectorModalCancel" class="btn-base btn-cancel"><%= tr('Cancel') %></button>
          </div>
        </div>
      </div>
    `),

    attributes: { tabindex: '-1' },

    className: 'modal modal-centered',

    events: {
      'input [data-input-type] textarea': function (e) {
        if (e.target.type === 'radio' && !e.target.checked) return;
        this.model.set('value', e.target.value);
      },

      'input [data-input-type] input': function (e) {
        if (e.target.type === 'radio' && !e.target.checked) return;
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalSelect': function (e) {
        this.model.set('type', e.target.value);
      },

      'click #inspectorModalAccept': function (e) {
        this.trigger('submit');
      },

      'click #inspectorModalCancel': function (e) {
        this.trigger('cancel');
      },

      'hidden.bs.modal': function (e) {
        this.trigger('cancel');
      }
    },

    initialize({ callback, value, type, path }) {
      if (['object', 'array'].includes(type)) type = 'custom';
      value = type === 'custom' ? JSON.stringify(value) : String(value);

      const model = new Model({ value, type, path }).on('change:type', (__, type) => {
        const $inputs = this.$('[data-input-type]');
        $inputs.parent('form').trigger('reset');

        const $unused = $inputs.filter((at, el) => {
          return el.dataset.inputType !== type
        }).hide().find(':input').prop('required', false);

        const $target = $inputs.filter((at, el) => {
          return el.dataset.inputType === type
        }).show().find(':input').prop('required', true);

        $target.first().each((at, el) => {
          const $el = $(el), { type } = el;

          if (type === 'radio') {
            $el.prop('checked', true);
          } else if (type !== 'hidden') {
            $el.val(type === 'number' ? 0 : '');
          }

          $el.trigger('input');
        });
      });

      model.bind('change', () => {
        const disabled = _.isEqual({ value, type, path }, model.toJSON());
        this.$('#inspectorModalAccept').prop('disabled', disabled);
      });

      this.bind('submit', () => {
        const valid = this.el.querySelector('form').reportValidity();
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
        this.$('#inspectorModalSelect').selectpicker();
        this.$el.modal({ backdrop: 'static' });
      }

      return this;
    },

    close() {
      this.$el.modal('hide');
      this.remove().off();
      return this;
    }
  });

  _.extend(_L, {
    'Save changes': { ru: 'Сохранить изменения' },
    'Copy to clipboard': { ru: 'Копировать в буфер обмена' },
    'Copy the variable name': { ru: 'Копировать имя переменной' },
    'Search for variable in project': { ru: 'Поиск переменной в проекте' }
  });
})(window);