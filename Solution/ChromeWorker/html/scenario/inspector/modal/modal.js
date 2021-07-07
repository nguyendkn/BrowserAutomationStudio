(function (global, $, _) {
  const InspectorModal = Backbone.View.extend({
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
        e.preventDefault();
        this.options.value = e.target.value;
      },

      'change #inspectorModalTextInput': function (e) {
        e.preventDefault();
        this.options.value = e.target.value;
      },

      'change #inspectorModalTextarea': function (e) {
        e.preventDefault();
        this.options.value = e.target.value;
      },

      'change #inspectorModalSelect': function (e) {
        const value = e.target.value || this.options.type;
        let $input = this.$('#inspectorModalTextarea');

        if (value === 'number') {
          $input = this.$('#inspectorModalNumberInput');
        } else if (value === 'boolean' || value === 'date') {
          $input = this.$('#inspectorModalTextInput');
        }

        this.$('.inspector-modal-inputs').children().not($input).hide();
        $input.val(this.options.value).show();
        e.preventDefault();
      },

      'click #inspectorModalAccept': function (e) {
        e.preventDefault();
        this.$el.modal('hide');
        this.remove().options.callback({
          type: this.$('#inspectorModalSelect').val(),
          value: this.options.value
        });
      },

      'click #inspectorModalCancel': function (e) {
        e.preventDefault();
        this.$el.modal('hide');
        this.remove().options.callback({
          type: this.$('#inspectorModalSelect').val(),
          value: null
        });
      },
    },

    render() {
      this.$el.html(this.template());

      this.$('#inspectorModalSelect').val(this.options.type).trigger('change').selectpicker({
        style: 'inspector-modal-select',
        template: { caret: '' },
      });

      this.$el.modal({ backdrop: 'static' });
      return this;
    },
  }, {
    show(options) {
      const modal = new InspectorModal(options);
      return modal.render();
    }
  });

  global.Scenario.InspectorModal = InspectorModal;
})(window, jQuery, _);