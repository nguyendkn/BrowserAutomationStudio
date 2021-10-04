(({ App, Backbone, $, _ }) => {
  const { Inspector, JST } = App;

  const Model = Backbone.Model.extend({
    defaults: () => ({
      sorting: 'alphabetically',
      filters: {},
      query: ''
    })
  });

  Inspector.ToolsView = Backbone.View.extend({
    template: _.template(/*html*/`
      <div class="inspector-tools">
        <div class="inspector-tools-panel">
          <input type="search" class="inspector-tools-input" placeholder="<%= tr('Search by name') %>..." value="<%= query %>">
          <div class="dropdown">
            <button data-toggle="dropdown" type="button" aria-expanded="false" aria-haspopup="true">
              <i class="fa fa-filter"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-right inspector-tools-menu">
              <li data-sorting="alphabetically">
                <a href="#"><%= tr('Alphabetically') %></a>
              </li>
              <li data-sorting="frequency">
                <a href="#"><%= tr('By frequency of use') %></a>
              </li>
              <li data-sorting="dateModified">
                <a href="#"><%= tr('By date modified') %></a>
              </li>
              <li data-sorting="dateCreated">
                <a href="#"><%= tr('By date created') %></a>
              </li>
              <% if (!_.isEmpty(filters)) { %>
                <% _.each(filters, (checked, value) => { %>
                  <li>
                    <% const type = _.upperFirst(value), id = _.uniqueId('inspectorFilter' + type) %>
                    <input type="checkbox" id="<%= id %>" value="<%= value %>" <%= checked ? 'checked' : '' %>>
                    <label for="<%= id %>"><%= tr(type) %></label>
                  </li>
                <% }) %>
              <% } %>
            </ul>
          </div>
        </div>
        <button class="inspector-tools-toggle" type="button">
          <i class="fa fa-chevron-up"></i>
        </button>
      </div>
    `),

    initialize(options) {
      this.model = new Model(_.pick(options, [
        'filters',
        'sorting',
        'query'
      ]));
    },

    render() {
      if (this.$el.is(':empty')) {
        const json = this.model.toJSON();
        this.$el.html(this.template(json));
      }

      return this;
    },

    events: {
      'change .inspector-tools-menu > li > input': function (e) {
        const { checked, value } = e.target;
        this.model.set('filters', { ...this.model.get('filters'), [value]: checked });
      },

      'input .inspector-tools-input': _.debounce(function (e) {
        this.model.set('query', e.target.value.trim().toLowerCase());
      }, 200),

      'click .inspector-tools-menu > [data-sorting]': function (e) {
        e.preventDefault();
        this.model.set('sorting', e.currentTarget.dataset.sorting);
      },

      'click .inspector-tools-menu > :not([data-sorting])': function (e) {
        e.stopPropagation();
      },

      'click .inspector-tools-toggle': function (e) {
        $(e.currentTarget).find('i').toggleClass('fa-chevron-down fa-chevron-up');
        this.$('.inspector-tools-panel').toggleClass('collapsed');
      }
    }
  });
})(window);