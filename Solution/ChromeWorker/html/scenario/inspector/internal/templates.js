_.extend(Scenario.JST, {
  'inspector/modal': _.template(/*html*/`
    <div class="vertical-align-helper">
      <div class="modal-dialog vertical-align-center" role="document">
        <div class="inspector-modal-content">
          <div class="inspector-modal-header">
            <h4><%= tr("Change the variable value") %></h4>
          </div>
          <div class="inspector-modal-body">
            <div class="inspector-modal-inputs">
              <% const style = (target) => type === target ? 'display: block;' : 'display: none;' %>
              <div style="<%- style('custom') %>" data-input-type="custom">
                <textarea id="inspectorModalCustomInput"><%- type === 'custom' ? value : '' %></textarea>
              </div>
              <div style="<%- style('string') %>" data-input-type="string">
                <textarea id="inspectorModalStringInput"><%- type === 'string' ? value : '' %></textarea>
              </div>
              <div style="<%- style('number') %>" data-input-type="number">
                <input id="inspectorModalNumberInput" type="number" value="<%- type === 'number' ? value : 0 %>">
              </div>
              <div style="<%- style('date') %>" data-input-type="date">
                <input id="inspectorModalDateInput" type="text" value="<%- type === 'date' ? value : '' %>">
              </div>
              <div style="<%- style('boolean') %>" data-input-type="boolean">
                <div class="input-radio">
                  <input id="inspectorModalBooleanFalse" type="radio" name="boolean" value="false"
                    <%= (value !== 'true' && type === 'boolean') || !false ? 'checked' : '' %>
                  >
                  <label for="inspectorModalBooleanFalse"><%= tr('False') %></label>
                </div>
                <div class="input-radio" data-input-type="boolean">
                  <input id="inspectorModalBooleanTrue" type="radio" name="boolean" value="true"
                    <%= (value === 'true' && type === 'boolean') ? 'checked' : '' %>
                  >
                  <label for="inspectorModalBooleanTrue"><%= tr('True') %></label>
                </div>
              </div>
              <div style="<%- style('null') %>" data-input-type="null">
                <div class="input-radio">
                  <input id="inspectorModalEmptyUndefined" type="radio" name="empty" value="undefined"
                    <%= (value !== 'null' && type === 'null') || !false ? 'checked' : '' %>
                  >
                  <label for="inspectorModalEmptyUndefined"><%= tr('Undefined') %></label>
                </div>
                <div class="input-radio">
                  <input id="inspectorModalEmptyNull" type="radio" name="empty" value="null"
                    <%= (value === 'null' && type === 'null') ? 'checked' : '' %>
                  >
                  <label for="inspectorModalEmptyNull"><%= tr('Null') %></label>
                </div>
              </div>
            </div>
            <select id="inspectorModalSelect" data-style="inspector-modal-select">
              <% _.each(['Boolean', 'Custom', 'String', 'Number', 'Date', 'Null'], (item) => { %>
                <option class="inspector-modal-select-option" value="<%= item.toLowerCase() %>" <%= item.toLowerCase() === type ? 'selected' : '' %>>
                  <%= tr(item) %>
                </option>
              <% }); %>
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

  'inspector/main': _.template(/*html*/`
    <div id="inspectorNotice" style="display: none; position: absolute; background: #fafafa; padding: 40px; height: calc(100% - 37px); width: 100%; left: 0; top: 6px;">
      <div style="text-align: center; margin: 0 15px;"><%= tr("Data will be loaded at the next script pause") %></div>
    </div>
    <div id="inspectorContent" style="height: 100%; display: flex; flex-direction: column;">
      <ul class="inspector-navigation">
        <li id="inspectorShowVariables"><%= tr('Variables') %></li>
        <li id="inspectorShowResources"><%= tr('Resources') %></li>
        <li id="inspectorShowCallstack"><%= tr('Callstack') %></li>
        <li id="inspectorClose" style="flex: 0;">
          <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 150%"></i>
        </li>
      </ul>
      <div class="inspector-tab" data-tab-name="variables">
        <div class="inspector-label-container">
          <span class="inspector-label"><%= tr('Variables:') %></span>
        </div>
        <div id="inspectorVariablesData"></div>
        <div id="inspectorNoVariables" style="font-size: smaller; margin-top: 10px; display: none;"><%= tr('No variables') %></div>
      </div>
      <div class="inspector-tab" data-tab-name="resources" style="display: none;">
        <div class="inspector-label-container">
          <span class="inspector-label"><%= tr('Resources:') %></span>
        </div>
        <div id="inspectorResourcesData"></div>
        <div id="inspectorNoResources" style="font-size: smaller; margin-top: 10px; display: none;"><%= tr('No resources') %></div>
      </div>
      <div class="inspector-tab" data-tab-name="callstack" style="display: none;">
        <div class="inspector-label-container">
          <span class="inspector-label"><%= tr('Callstack:') %></span>
        </div>
      </div>
    </div>
  `)
})