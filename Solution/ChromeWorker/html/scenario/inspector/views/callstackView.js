(({ App, Backbone, _ }) => {
  const { Inspector } = App;

  const stackTemplate = _.template(/*html*/`
    <ul class="callstack-data">
      <% _.each(stack, ({ id, type, name, ...item }) => { %>
        <% const pid = (type !== 'function' || _.isEmpty(item.arguments)) ? '' : _.uniqueId('params'), expanded = _.has(state, id) && !state[id] %>
        <li class="callstack-item" data-id="<%= id %>" data-type="<%= type %>" style="<%= pid ? 'border-color: #c4c4c4;' : '' %><%= filters[type + 's'] ? '' : 'display: none;' %>">
          <div>
            <span class="callstack-item-name"><%= name + (type === 'action' ? ':' : '') %></span>
            <% if (type === 'action') { %>
              <span class="callstack-item-data text-truncate"><%= name === 'If' ? item.expression : item.iterator %></span>
            <% } else if (pid) { %>
              <button class="callstack-toggle-params" type="button" data-toggle="collapse" data-target="#<%= pid %>" aria-expanded="<%= expanded %>" aria-controls="<%= pid %>">
                <i class="fa fa-minus"></i>
                <i class="fa fa-plus"></i>
              </button>
            <% } %>
          </div>
          <% if (pid) { %>
            <ul class="callstack-item-params collapse <%= expanded ? 'in' : '' %>" id="<%= pid %>" aria-expanded="<%= expanded %>">
              <% _.each(item.arguments, (value, name) => { %>
                <li class="callstack-item-param">
                  <span><%= name %>:</span>
                  <span><%= value %></span>
                </li>
              <% }) %>
            </ul>
          <% } %>
        </li>
      <% }) %>
    </ul>
  `);

  const Model = Backbone.Model.extend({
    defaults: () => ({
      stack: [],
      state: {},
    }),

    update: function (stack) {
      this.set('stack', stack);
    }
  });

  Inspector.CallstackView = Backbone.View.extend({
    template: _.template(/*html*/`
      <div class="inspector-panel">
        <div class="inspector-panel-data"></div>
        <div class="inspector-panel-info">
          <span><%= tr('No callstack') %></span>
        </div>
      </div>
    `),

    initialize() {
      const model = this.model = new Model()
        .on('change:stack', () => {
          this.renderStack()
        });

      this.tools = new Inspector.ToolsView({
        filters: {
          functions: true,
          actions: true,
        }
      });

      this.tools.model.on('change:filters', this.applyFilters, this);
    },

    render() {
      const $el = this.$el;

      if ($el.is(':empty')) {
        $el.html(this.template());
        $el.prepend(this.tools.render().el);
      }

      return this.renderStack();
    },

    renderStack() {
      const panel = this.el.querySelector('.inspector-panel');
      panel.dataset.empty = _.isEmpty(this.model.get('stack'));
      const html = stackTemplate({
        ...this.model.toJSON(),
        filters: this.tools.model.get('filters'),
        sorting: this.tools.model.get('sorting'),
      });

      morphdom(panel.querySelector('.inspector-panel-data'), `<div class="inspector-panel-data">${html}</div>`, {
        onBeforeElUpdated: (from, to) => !from.isEqualNode(to),
        getNodeKey({ classList, dataset, id }) {
          if (classList) {
            if (classList.contains('callstack-item')) {
              return dataset.id;
            }
          }
          return id;
        },
        childrenOnly: true
      });

      return this;
    },

    applyFilters() {
      _.each(this.tools.model.get('filters'), (visible, type) => {
        this.$(`[data-type="${type.slice(0, -1)}"]`).toggle(visible);
      });

      return this;
    },

    restoreState(state = this.model.get('state')) {
      this.model.set('state', state);
      return this;
    },

    events: {
      'change .inspector-tools > ul > li > input': function (e) {
        const { checked, value } = e.target;
        this.model.set('filters', { ...this.model.get('filters'), [value]: checked });
      },

      'show.bs.collapse .callstack-item': function (e) {
        const { id } = e.currentTarget.dataset;
        this.model.set('state', { ...this.model.get('state'), [id]: false });
      },

      'hide.bs.collapse .callstack-item': function (e) {
        const { id } = e.currentTarget.dataset;
        this.model.set('state', { ...this.model.get('state'), [id]: true });
      },

      'click .callstack-item-name': function (e) {
        const { id } = e.target.closest('li').dataset;
        BrowserAutomationStudio_FocusAction(id);
      },

      'click .callstack-item-data': function (e) {
        e.target.classList.toggle('text-truncate');
      }
    }
  });
})(window);