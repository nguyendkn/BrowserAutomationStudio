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
              <% const style = target => type === target ? 'display: block' : 'display: none'; let id; %>
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
                <div class="input-radio">
                  <% id = _.uniqueId('inspectorModalInput') %>
                  <input id="<%= id %>" type="radio" name="boolean" value="false" <%= (type === 'boolean' && value !== 'true') || !false ?'checked' : '' %>>
                  <label for="<%= id %>"><%= tr('False') %></label>
                </div>
                <div class="input-radio">
                  <% id = _.uniqueId('inspectorModalInput') %>
                  <input id="<%= id %>" type="radio" name="boolean" value="true" <%= (type === 'boolean' && value === 'true') ? 'checked' : '' %>>
                  <label for="<%= id %>"><%= tr('True') %></label>
                </div>
              </div>
              <div style="<%= style('null') %>" data-input-type="null">
                <div class="input-radio">
                  <% id = _.uniqueId('inspectorModalInput') %>
                  <input id="<%= id %>" type="radio" name="empty" value="undefined" <%= (type === 'null' && value !== 'null') || !false ? 'checked' : '' %>>
                  <label for="<%= id %>"><%= tr('Undefined') %></label>
                </div>
                <div class="input-radio">
                  <% id = _.uniqueId('inspectorModalInput') %>
                  <input id="<%= id %>" type="radio" name="empty" value="null" <%= (type === 'null' && value === 'null') ? 'checked' : '' %>>
                  <label for="<%= id %>"><%= tr('Null') %></label>
                </div>
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
      <div class="inspector-header" style="display: flex; border-bottom: thin solid #e0e0e0;">
        <ul class="inspector-nav" role="tablist">
          <li class="inspector-nav-item active" role="presentation">
            <a href="#variables" aria-controls="variables" role="tab" data-toggle="tab"><%= tr('Variables') %></a>
          </li>
          <li class="inspector-nav-item" role="presentation">
            <a href="#resources" aria-controls="resources" role="tab" data-toggle="tab"><%= tr('Resources') %></a>
          </li>
          <li class="inspector-nav-item" role="presentation">
            <a href="#callstack" aria-controls="callstack" role="tab" data-toggle="tab"><%= tr('Callstack') %></a>
          </li>
        </ul>
        <button id="inspectorClose" type="button" style="min-width: 28px; border: none; background: #fafafa;">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" height="12" width="12" fill="#000" style="vertical-align: middle">
            <path d="M12 1.0501l-1.05-1.05L6 4.9501 1.05.0001 0 1.0501l4.95 4.95-4.95 4.95 1.05 1.05L6 7.0501l4.95 4.95 1.05-1.05-4.95-4.95 4.95-4.95z"/>
          </svg>
        </button>
      </div>
      <div class="inspector-tabs">
        <div class="inspector-tab active" id="variables" role="tabpanel"></div>
        <div class="inspector-tab" id="resources" role="tabpanel"></div>
        <div class="inspector-tab" id="callstack" role="tabpanel"></div>
      </div>
      <div class="inspector-notice" style="display: none;">
        <span><%= tr("Data will be loaded at the next script pause") %></span>
      </div>
    </div>
  `),

  'inspector/variables': _.template(/*html*/`
    <%= App.JST['inspector/tools'](obj) %>
    <div class="inspector-panel">
      <div class="inspector-panel-info" style="display: none;">
        <span style="text-align: center;"><%= tr('No variables') %></span>
      </div>
      <div class="inspector-panel-data"></div>
    </div>
  `),

  'inspector/resources': _.template(/*html*/`
    <%= App.JST['inspector/tools'](obj) %>
    <div class="inspector-panel">
      <div class="inspector-panel-info" style="display: none;">
        <span style="text-align: center;"><%= tr('No resources') %></span>
      </div>
      <div class="inspector-panel-data"></div>
    </div>
  `),

  'inspector/callstack': _.template(/*html*/`
    <div class="inspector-tools" style="background: #fafafa;">
      <ul class="" style="flex: 1">
        <% _.each(['Functions', 'Actions'], type => { %>
          <li class="">
            <% const id = _.uniqueId('inspectorFilter' + type), lower = type.toLowerCase() %>
            <input type="checkbox" id="<%= id %>" value="<%= lower %>" <%= filters[lower] ? 'checked' : '' %>>
            <label for="<%= id %>"><%= type %></label>
          </li>
        <% }) %>
      </ul>
    </div>
    <div class="inspector-panel">
      <div class="inspector-panel-info" style="display: none;">
        <span style="text-align: center;"><%= tr('No callstack') %></span>
      </div>
      <div class="inspector-panel-data"></div>
    </div>
  `),

  'inspector/stack': _.template(/*html*/`
    <% if (stack.length) { %>
      <ul class="callstack-data" style="display: flex; list-style: none; flex-flow: column; padding: 0; margin: 0;">
        <% _.each(stack, item => { %>
          <% const paramsId = (item.type === 'function' && !_.isEmpty(item.arguments)) ? _.uniqueId('params') : '' %>
          <li class="callstack-item" data-id="<%= item.id %>" data-type="<%= item.type %>" style="<%= paramsId ? 'border-color: #C4C4C4' : '' %>">
            <div style="display: flex; justify-content: space-between;">
              <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                <span class="callstack-item-name"><%= item.name + (item.type === 'action' ? ':' : '') %></span>
                <% if (item.type === 'action') { %>
                  <% if (item.name === 'If') { %>
                    <span style="color: #838383; font-size: 95%;"><%= item.expression %></span>
                  <% } else { %>
                    <span style="color: #838383; font-size: 95%;"><%= item.iterator %></span>
                  <% } %>
                <% } %>
              </div>
              <% if (paramsId) { %>
                <button class="callstack-toggle-params" title="<%= tr('Toggle function params') %>" type="button" data-toggle="collapse" data-target="#<%= paramsId %>" aria-expanded="false" aria-controls="<%= paramsId %>">
                  <i class="fa fa-minus"></i>
                  <i class="fa fa-plus"></i>
                </button>
              <% } %>
            </div>
            <% if (paramsId) { %>
              <ul class="callstack-function-params collapse" id="<%= paramsId %>">
                <% _.each(item.arguments, (value, param) => { %>
                  <li class="callstack-function-param">
                    <span><%= param %>:</span>
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
        <button class="inspector-tools-button" title="<%= tr('Sorting') %>" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fa fa-filter"></i>
        </button>
        <ul class="inspector-sort-menu dropdown-menu dropdown-menu-right">
          <li class="inspector-sort-menu-item" data-sort-type="alphabetically"><%= tr('Alphabetically') %></li>
          <li class="inspector-sort-menu-item" data-sort-type="frequency"><%= tr('By frequency of use') %></li>
          <li class="inspector-sort-menu-item" data-sort-type="dateModified"><%= tr('By date modified') %></li>
          <li class="inspector-sort-menu-item" data-sort-type="dateAdded"><%= tr('By date added') %></li>
        </ul>
      </div>
      <div class="dropdown">
        <button class="inspector-tools-button" title="<%= tr('Filters') %>" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fa fa-cog"></i>
        </button>
        <ul class="inspector-filter-menu dropdown-menu dropdown-menu-right">
          <% _.each(['Undefined', 'Boolean', 'Number', 'Groups', 'String', 'Object', 'Array', 'Date', 'Null'], type => { %>
            <li class="inspector-filter-menu-item">
              <% const id = _.uniqueId('inspectorFilter' + type), lower = type.toLowerCase() %>
              <input type="checkbox" id="<%= id %>" value="<%= lower %>" <%= filters[lower] ? 'checked' : '' %>>
              <label for="<%= id %>"><%= type %></label>
            </li>
          <% }) %>
        </ul>
      </div>
    </div>
  `)
})