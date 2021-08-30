(({ App, _ }) => {
  _.extend(App.JST, {
    'inspector/modal': _.template(/*html*/`
      <div class="vertical-align-helper">
        <div class="modal-dialog vertical-align-center" role="document">
          <div class="inspector-modal-content">
            <div class="inspector-modal-header">
              <h4><%= tr("Change the variable value") %></h4>
            </div>
            <div class="inspector-modal-body">
              <form class="inspector-modal-form" action="javascript:void(0)">
                <% const style = target => type === target ? 'display: block' : 'display: none'; %>
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
                  <% _.each(['False', 'True'], (item, idx) => { %>
                    <% const id = _.uniqueId('inspectorModalInput'), val = item.toLowerCase() %>
                    <div class="input-radio">
                      <input id="<%= id %>" type="radio" name="boolean" value="<%= val %>"<%= (type === 'boolean' ? value === val : idx === 0) ? 'checked' : '' %>>
                      <label for="<%= id %>"><%= tr(item) %></label>
                    </div>
                  <% }) %>
                </div>
                <div style="<%= style('null') %>" data-input-type="null">
                  <% _.each(['Undefined', 'Null'], (item, idx) => { %>
                    <% const id = _.uniqueId('inspectorModalInput'), val = item.toLowerCase() %>
                    <div class="input-radio">
                      <input id="<%= id %>" type="radio" name="empty" value="<%= val %>"<%= (type === 'null' ? value === val : idx === 0) ? 'checked' : '' %>>
                      <label for="<%= id %>"><%= tr(item) %></label>
                    </div>
                  <% }) %>
                </div>
              </form>
              <select id="inspectorModalSelect" data-style="inspector-modal-select">
                <% _.each(['Boolean', 'Custom', 'String', 'Number', 'Date', 'Null'], item => { %>
                  <option class="inspector-modal-select-option" value="<%= item.toLowerCase() %>" <%= item.toLowerCase() === type ? 'selected' : '' %>>
                    <%= tr(item) %>
                  </option>
                <% }) %>
              </select>
            </div>
            <div class="inspector-modal-footer">
              <button type="button" id="inspectorModalAccept" class="btn-base btn-accept"><%= tr('Accept') %></button>
              <button type="button" id="inspectorModalCancel" class="btn-base btn-cancel"><%= tr('Cancel') %></button>
            </div>
          </div>
        </div>
      </div>
    `),

    'inspector/main': _.template(/*html*/`
      <div class="inspector-content">
        <div class="inspector-header">
          <ul class="inspector-nav" role="tablist">
            <li class="active" role="presentation">
              <a data-toggle="tab" href="#variables" role="tab" aria-controls="variables"><%= tr('Variables') %></a>
            </li>
            <li class="" role="presentation">
              <a data-toggle="tab" href="#resources" role="tab" aria-controls="resources"><%= tr('Resources') %></a>
            </li>
            <li class="" role="presentation">
              <a data-toggle="tab" href="#callstack" role="tab" aria-controls="resources"><%= tr('Callstack') %></a>
            </li>
          </ul>
          <button id="inspectorClose" type="button" style="min-width: 28px; border: none; background: #fafafa;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" height="12" width="12" fill="#000" style="vertical-align: middle">
              <path d="M12 1.0501l-1.05-1.05L6 4.9501 1.05.0001 0 1.0501l4.95 4.95-4.95 4.95 1.05 1.05L6 7.0501l4.95 4.95 1.05-1.05-4.95-4.95 4.95-4.95z" />
            </svg>
          </button>
        </div>
        <div class="inspector-tabs">
          <div class="inspector-tab active" id="variables" role="tabpanel"></div>
          <div class="inspector-tab" id="resources" role="tabpanel"></div>
          <div class="inspector-tab" id="callstack" role="tabpanel"></div>
        </div>
        <div class="inspector-notice" style="display: none">
          <span><%= tr("Data will be loaded at the next script pause") %></span>
        </div>
      </div>
    `),

    'inspector/variables': _.template(/*html*/`
      <%= App.JST['inspector/tools'](obj) %>
      <div class="inspector-panel" data-empty="true">
        <div class="inspector-panel-info">
          <span><%= tr('No variables') %></span>
        </div>
        <div class="inspector-panel-data"></div>
      </div>
    `),

    'inspector/resources': _.template(/*html*/`
      <%= App.JST['inspector/tools'](obj) %>
      <div class="inspector-panel" data-empty="true">
        <div class="inspector-panel-info">
          <span><%= tr('No resources') %></span>
        </div>
        <div class="inspector-panel-data"></div>
      </div>
    `),

    'inspector/callstack': _.template(/*html*/`
      <div class="inspector-tools" style="background: #fafafa;">
        <ul class="" style="flex: 1">
          <% _.each(['Functions', 'Actions'], type => { %>
            <li class="">
              <% const id = _.uniqueId('inspectorFilter' + type), val = type.toLowerCase() %>
              <input type="checkbox" id="<%= id %>" value="<%= val %>" <%= filters[val] ? 'checked' : '' %>>
              <label for="<%= id %>"><%= type %></label>
            </li>
          <% }) %>
        </ul>
      </div>
      <div class="inspector-panel" data-empty="true">
        <div class="inspector-panel-info">
          <span><%= tr('No callstack') %></span>
        </div>
        <div class="inspector-panel-data"></div>
      </div>
    `),

    'inspector/stack': _.template(/*html*/`
      <% if (stack.length) { %>
        <ul class="callstack-data">
          <% _.each(stack, ({ id, type, name, ...item }) => { %>
            <% const paramsId = (type === 'function' && !_.isEmpty(item.arguments)) ? _.uniqueId('params') : '', expanded = _.has(state, id) && !state[id] %>
            <li class="callstack-item" data-id="<%= id %>" data-type="<%= type %>" style="<%= paramsId ? 'border-color: #c4c4c4' : '' %>">
              <div>
                <span class="callstack-item-name"><%= name + (type === 'action' ? ':' : '') %></span>
                <% if (type === 'action') { %>
                  <% if (name === 'If') { %>
                    <span class="callstack-item-data"><%= item.expression %></span>
                  <% } else { %>
                    <span class="callstack-item-data"><%= item.iterator %></span>
                  <% } %>
                <% } else if (paramsId) { %>
                  <button class="callstack-toggle-params" title="<%= tr('Show or hide function params') %>" type="button" data-toggle="collapse" data-target="#<%= paramsId %>" aria-expanded="<%= expanded %>" aria-controls="<%= paramsId %>">
                    <i class="fa fa-minus"></i>
                    <i class="fa fa-plus"></i>
                  </button>
                <% } %>
              </div>
              <% if (paramsId) { %>
                <ul class="callstack-function-params collapse <%= expanded ? 'in' : '' %>" id="<%= paramsId %>" aria-expanded="<%= expanded %>">
                  <% _.each(item.arguments, (value, name) => { %>
                    <li class="callstack-function-param">
                      <span><%= name %>:</span>
                      <span><%= value %></span>
                    </li>
                  <% }) %>
                </ul>
              <% } %>
            </li>
          <% }) %>
        </ul>
      <% } %>
    `),

    'inspector/tools': _.template(/*html*/`
      <div class="inspector-tools">
        <span style="width: 26px; padding: 3px 6px;">
          <i class="fa fa-search"></i>
        </span>
        <input type="text" class="inspector-filter-input" placeholder="<%= tr('Filter by name') + '...' %>">
        <div class="dropdown">
          <button class="inspector-tools-button" data-toggle="dropdown" type="button" title="<%= tr('Sorting') %>" aria-haspopup="true" aria-expanded="false">
            <i class="fa fa-filter"></i>
          </button>
          <ul class="inspector-sort-menu dropdown-menu dropdown-menu-right">
            <li data-sorting="alphabetically"><%= tr('Alphabetically') %></li>
            <li data-sorting="frequency"><%= tr('By frequency of use') %></li>
            <li data-sorting="dateModified"><%= tr('By date modified') %></li>
            <li data-sorting="dateAdded"><%= tr('By date added') %></li>
          </ul>
        </div>
        <div class="dropdown">
          <button class="inspector-tools-button" data-toggle="dropdown" type="button" title="<%= tr('Filters') %>" aria-haspopup="true" aria-expanded="false">
            <i class="fa fa-cog"></i>
          </button>
          <ul class="inspector-filter-menu dropdown-menu dropdown-menu-right">
            <% _.each(['Undefined', 'Boolean', 'Number', 'Groups', 'String', 'Object', 'Array', 'Date', 'Null'], type => { %>
              <li>
                <% const id = _.uniqueId('inspectorFilter' + type), val = type.toLowerCase() %>
                <input type="checkbox" id="<%= id %>" value="<%= val %>" <%= filters[val] ? 'checked' : '' %>>
                <label for="<%= id %>"><%= type %></label>
              </li>
            <% }) %>
          </ul>
        </div>
      </div>
    `)
  })
})(window);