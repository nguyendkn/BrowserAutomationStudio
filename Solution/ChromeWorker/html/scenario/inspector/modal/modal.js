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
    template: Scenario.JST['inspector/modal'],

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

        if (type === 'boolean') {
          const $falseRadio = this.$('#inspectorModalBooleanFalse');
          const $trueRadio = this.$('#inspectorModalBooleanTrue');
          $input = this.$('#inspectorModalBoolean');

          if ($falseRadio.prop('checked')) {
            $falseRadio.trigger('change');
          }

          if ($trueRadio.prop('checked')) {
            $falseRadio.trigger('change');
          }
        } else {
          if (type === 'number') {
            $input = this.$('#inspectorModalNumberInput');
          }

          if (type === 'date') {
            $input = this.$('#inspectorModalTextInput');
          }

          $input.trigger('change');
        }

        this.$('.inspector-modal-inputs').children().not($input).hide();
        this.model.set('type', type);
        $input.show();
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
      value = type === 'raw' ? JSON.stringify(value) : value.toString();
      value = value.indexOf('__DATE__') === 0 ? value.slice(8) : value;

      this.once('accept', () => {
        this.$el.modal('hide');
        this.close();
        callback({ ...this.model.toJSON(), cancel: false });
      });

      this.once('cancel', () => {
        this.$el.modal('hide');
        this.close();
        callback({ ...this.model.toJSON(), cancel: true });
      });

      this.model = new Model({ value, type });
    },

    render() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$('#inspectorModalSelect').trigger('change').selectpicker();
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