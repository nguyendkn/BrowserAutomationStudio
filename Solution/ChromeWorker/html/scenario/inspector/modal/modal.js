(function (global, $, _) {
  const Model = Backbone.Model.extend({
    defaults: {
      value: '',
      type: '',
    },

    initialize({ value, type }) {
      this._value = value;
      this._type = type;
    },

    toJSON() {
      const valueChanged = this._value !== this.get('value');
      const typeChanged = this._type !== this.get('type');
      const isChanged = valueChanged || typeChanged;

      return { ..._.clone(this.attributes), isChanged };
    }
  });

  const View = Backbone.View.extend({
    template: _.template(/*html*/`
      <div class="vertical-align-helper">
        <div class="modal-dialog vertical-align-center" role="document">
          <div class="inspector-modal-content">
            <div class="inspector-modal-header">
              <h4><%= tr("Change the variable value") %></h4>
            </div>
            <div class="inspector-modal-body">
              <div class="inspector-modal-inputs">
                <textarea id="inspectorModalTextarea" style="resize: vertical; display: none;"></textarea>
                <input id="inspectorModalNumberInput" type="number" style="display: none;">
                <input id="inspectorModalTextInput" type="text" style="display: none;">
                <div id="inspectorModalBoolean" class="inspector-modal-boolean" style="display: none;">
                  <div class="input-radio">
                    <input id="inspectorModalBooleanFalse" type="radio" name="boolean" value="false">
                    <label for="inspectorModalBooleanFalse"><%= tr('False') %></label>
                  </div>
                  <div class="input-radio">
                    <input id="inspectorModalBooleanTrue" type="radio" name="boolean" value="true">
                    <label for="inspectorModalBooleanTrue"><%= tr('True') %></label>
                  </div>
                </div>
              </div>
              <select id="inspectorModalSelect" data-style="inspector-modal-select">
                <option class="inspector-modal-select-option" value="boolean"><%= tr('Boolean') %></option>
                <option class="inspector-modal-select-option" value="string"><%= tr('String') %></option>
                <option class="inspector-modal-select-option" value="number"><%= tr('Number') %></option>
                <option class="inspector-modal-select-option" value="date"><%= tr('Date') %></option>
                <option class="inspector-modal-select-option" value="raw"><%= tr('Raw') %></option>
              </select>
            </div>
            <div class="inspector-modal-footer">
              <button type="button" id="inspectorModalAccept" class="btn-base btn-accept" data-dismiss="modal"><%= tr('Accept') %></button>
              <button type="button" id="inspectorModalCancel" class="btn-base btn-cancel" data-dismiss="modal"><%= tr('Cancel') %></button>
            </div>
          </div>
        </div>
      </div>
    `),

    className: 'modal',

    tagName: 'div',

    events: {
      'change #inspectorModalBooleanFalse': function (e) {
        if (e.target.checked) {
          this.model.set({ value: e.target.value });
        }
      },

      'change #inspectorModalBooleanTrue': function (e) {
        if (e.target.checked) {
          this.model.set({ value: e.target.value });
        }
      },

      'change #inspectorModalNumberInput': function (e) {
        this.model.set({ value: e.target.value });
      },

      'change #inspectorModalTextInput': function (e) {
        this.model.set({ value: e.target.value });
      },

      'change #inspectorModalTextarea': function (e) {
        this.model.set({ value: e.target.value });
      },

      'change #inspectorModalSelect': function (e) {
        const type = e.target.value || this.model.get('type');
        let $input = this.$('#inspectorModalTextarea');
        const value = this.model.get('value');

        if (type === 'boolean') {
          $input = this.$('#inspectorModalBoolean');

          if (value !== 'true') {
            $input.find('#inspectorModalBooleanFalse')
              .prop('checked', true)
              .trigger('change');
          } else {
            $input.find('#inspectorModalBooleanTrue')
              .prop('checked', true)
              .trigger('change');
          }

          $input.show();
        } else {
          if (type === 'number') {
            $input = this.$('#inspectorModalNumberInput');
          }

          if (type === 'date') {
            $input = this.$('#inspectorModalTextInput');
          }

          $input.val(value).trigger('change').show();
        }

        this.$('.inspector-modal-inputs').children().not($input).hide();
        this.model.set('type', type);
      },

      'click #inspectorModalAccept': function (e) {
        e.preventDefault();
        this.trigger('accept');
      },

      'click #inspectorModalCancel': function (e) {
        e.preventDefault();
        this.trigger('cancel');
      },
    },

    initialize({ callback, value, type }) {
      value = type === 'raw' ? JSON.stringify(value) : value.toString()

      this.once('accept', (data) => {
        this.$el.modal('hide');
        callback({ ...this.model.toJSON(), cancel: false });
        this.close();
      });

      this.once('cancel', (data) => {
        this.$el.modal('hide');
        callback({ ...this.model.toJSON(), cancel: true });
        this.close();
      });

      this.model = new Model({ value, type });
    },

    render() {
      this.$el.html(this.template());
      this.$('#inspectorModalSelect').val(this.model.get('type')).trigger('change').selectpicker();
      this.$el.modal({ backdrop: 'static' });
      return this;
    },

    close() {
      this.unbind();
      this.remove();
      return this;
    }
  });

  global.Scenario.InspectorModal = View;
})(window, jQuery, _);