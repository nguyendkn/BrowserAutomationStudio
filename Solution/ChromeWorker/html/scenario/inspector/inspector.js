(({ App, Backbone }) => {
  const { Inspector } = App;

  window.addEventListener('message', ({ data }) => {
    if (data.type === 'hide') {
      App.InspectorFrame.hide();
    }
  }, false);

  App.InspectorFrame = {
    sendData(data) {
      const frame = document.querySelector('#inspectorFrame');
      frame.contentWindow.postMessage(data, '*');
    },

    show() {
      const frame = document.querySelector('#inspectorFrame');
      $(frame.parentNode).show();
    },

    hide() {
      const frame = document.querySelector('#inspectorFrame');
      $(frame.parentNode).hide();
    },
  };

  Inspector.Main = Backbone.View.extend({
    template: _.template(/*html*/`
      <div class="inspector-content">
        <div class="inspector-header">
          <ul class="inspector-nav" role="tablist">
            <li class="active" role="presentation">
              <a data-toggle="tab" href="#variables" role="tab" aria-controls="variables"><%= tr('Variables') %></a>
            </li>
            <li role="presentation">
              <a data-toggle="tab" href="#resources" role="tab" aria-controls="resources"><%= tr('Resources') %></a>
            </li>
            <li role="presentation">
              <a data-toggle="tab" href="#callstack" role="tab" aria-controls="callstack"><%= tr('Call stack') %></a>
            </li>
          </ul>
        </div>
        <div class="inspector-tabs">
          <div class="inspector-tab active" id="variables" role="tabpanel"></div>
          <div class="inspector-tab" id="resources" role="tabpanel"></div>
          <div class="inspector-tab" id="callstack" role="tabpanel"></div>
        </div>
      </div>
    `),

    initialize() {
      ['isscriptexecuting', 'istaskexecuting'].forEach(attr => {
        _GobalModel.on(`change:${attr}`, (__, value) => {
          if (value || this.$el.is(':hidden')) return;
          this.variables.model.set('highlight', true);
          this.resources.model.set('highlight', true);
        });
      });

      this.on('show', () => BrowserAutomationStudio_AskForVariablesUpdateOrWait());
    },

    render() {
      if (this.$el.is(':empty')) {
        this.setElement('#inspector').$el.html(this.template());

        this.resizable = interact(this.el).resizable({
          listeners: {
            move: ({ client: { y } }) => {
              this.$el.outerHeight(Math.max(120, Math.min(
                window.outerHeight - 300 - 30,
                window.outerHeight - y - 30,
              )));
            }
          },
          edges: { top: true }
        });

        this.variables = new Inspector.VariablesView({
          el: '#variables'
        }).render();

        this.resources = new Inspector.ResourcesView({
          el: '#resources'
        }).render();

        this.callstack = new Inspector.CallstackView({
          el: '#callstack'
        }).render();
      }

      return this;
    },

    showNotice() {
      return this;
    },

    hideNotice() {
      return this;
    },

    show() {
      if (this.$el.is(':visible')) return this;
      this.$el.show();
      return this.trigger('show');
    },

    hide() {
      if (this.$el.is(':hidden')) return this;
      this.$el.hide();
      return this.trigger('hide');
    },

    events: {
      'keydown': e => e.stopPropagation(),

      'keyup': e => e.stopPropagation(),
    }
  });
})(window);