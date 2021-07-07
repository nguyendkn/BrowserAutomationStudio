(function (global, $, _) {
  const Model = Backbone.Model.extend({
    defaults: {
      previousValue: '',
      updatedValue: '',
      type: '',
      path: '',
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
                <div class="inspector-modal-boolean" style="display: none;">
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
              <select id="inspectorModalSelect">
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

    id: 'inspectorModal',

    className: 'modal',

    tagName: 'div',

    events: {
      'change #inspectorModalNumberInput': function (e) {
        this.model.set({ updatedValue: e.target.value });
      },

      'change #inspectorModalTextInput': function (e) {
        this.model.set({ updatedValue: e.target.value });
      },

      'change #inspectorModalTextarea': function (e) {
        this.model.set({ updatedValue: e.target.value });
      },

      'change #inspectorModalSelect': function (e) {
        const type = e.target.value || this.model.get('type');
        let $input = this.$('#inspectorModalTextarea');

        if (type === 'number') {
          $input = this.$('#inspectorModalNumberInput');
        } else if (type === 'boolean' || type === 'date') {
          $input = this.$('#inspectorModalTextInput');
        }

        this.$('.inspector-modal-inputs').children().not($input).hide();
        $input.val(this.model.get('updatedValue')).show();
        this.model.set('type', type);
      },

      'click #inspectorModalAccept': function (e) {
        e.preventDefault();
        this.$el.modal('hide');
        this.trigger('accept', { ...this.model.toJSON() }).remove();
      },

      'click #inspectorModalCancel': function (e) {
        e.preventDefault();
        this.$el.modal('hide');
        this.trigger('cancel', { ...this.model.toJSON() }).remove();
      },
    },

    initialize(options) {
      this.model = new Model({
        previousValue: options.value,
        updatedValue: options.value,
        type: options.type,
        path: options.path,
      });
    },

    render() {
      this.$el.html(this.template());

      this.$('#inspectorModalSelect').val(this.model.get('type')).trigger('change').selectpicker({
        style: 'inspector-modal-select',
        template: { caret: '' },
      });

      this.$el.modal({ backdrop: 'static' });
      return this;
    },

    remove() {
      this.$el.unbind();
      this.$el.remove();
      return this;
    }
  }, {
    show(options) {
      const modal = new View(options);

      modal.once('accept', (data) => {
        modal.off();
        options.callback({ ...data, cancel: false });
      });

      modal.once('cancel', (data) => {
        modal.off();
        options.callback({ ...data, cancel: true });
      });

      return modal.render();
    }
  });

  global.Scenario.InspectorModal = View;
})(window, jQuery, _);