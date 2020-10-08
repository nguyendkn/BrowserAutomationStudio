BasDialogsLib.template = _.template(`
  <div id="modalDialogContainer">
    <div id="modalSearchContainer">
      <input type="text" id="modalSearchInput" placeholder="<%= tr('Start typing ' + metadata.singleName + ' name...') %>">
      <span id="modalSearchIcon" class="modal-search-control">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.167 22.833a6.667 6.667 0 100-13.333 6.667 6.667 0 000 13.333zM24.5 24.5l-3.625-3.625" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>        
      </span>
      <button id="modalSearchClose" class="modal-search-control">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 6l-8 8M6 6l8 8" stroke="#c56d5f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div id="modalContentContainer">
      <div id="modalListContainer">
        <div id="modalListContent">
          <% _.keys(map).forEach((header) => { %>
            <div class="modal-list-wrap">
              <div class="modal-list">
                <div class="modal-list-header">
                  <div class="modal-list-header-content"><%= header %></div>
                  <div class="modal-list-header-column"></div>
                </div>
                <ul class="modal-list-items">
                  <% map[header].forEach((item) => { %>
                    <li class="modal-list-item" data-id="<%= item.id %>">
                      <div class="modal-list-text-lg modal-text-nowrap modal-text-<%= metadata.color %>">
                        <%= metadata.template(item) %>
                      </div>
                      <% if (item.description) { %>
                        <div class="modal-list-item-content">
                          <svg width="9" height="3" viewBox="0 0 9 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="2.5" width="2" height="2" transform="rotate(-90 0.5 2.5)" fill="white" stroke="#bdbdbd" />
                            <rect y="2" width="1" height="9" transform="rotate(-90 0 2)" fill="#bdbdbd" />
                          </svg>    
                          <div class="modal-list-text-sm modal-text-nowrap modal-text-gray">
                            <%= item.description %>
                          </div>
                        </div>
                      <% } %>
                    </li>
                  <% }); %>
                </ul>
              </div>
            </div>
          <% }); %>
        </div>
        <div id="modalListEmpty"><%= tr('No ' + metadata.pluralName + ' found') %></div>
      </div>
      <div id="modalRecentContainer">
        <div id="modalRecentHeader">
          <div id="modalRecentHeaderText">
            <%= tr('Recent ' + metadata.pluralName + ':') %>
          </div>
          <div id="modalRecentHeaderIcon">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 16L11 1M14.3333 16L2.66667 16C1.74619 16 1 15.2538 1 14.3333L1 2.66667C1 1.74619 1.74619 1 2.66667 1L14.3333 1C15.2538 1 16 1.74619 16 2.66667V14.3333C16 15.2538 15.2538 16 14.3333 16Z" stroke="#4f4f4f" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <button id="modalRecentHide" class="modal-recent-button">
            <svg width="6" height="17" viewBox="0 0 6 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 1 12.5 L 5 8.5 L 1 4.5" stroke="#7b7b7b" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>                
          </button>
        </div>
        <div id="modalRecentContent">
          <ul id="modalRecentItems">
            <% recent.forEach((item) => { %>
              <li class="modal-recent-item" data-id="<%= items.find(({ name }) => name === item.name).id %>">
                <div class="modal-recent-icon-left"></div>
                <div class="modal-recent-text modal-text-nowrap modal-text-<%= metadata.color %>">
                  <%= item.name %>
                </div>
                <div class="modal-recent-icon-right">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 5.583H15a4.167 4.167 0 010 8.334h-2.5m-5 0H5a4.167 4.167 0 010-8.334h2.5M6.667 9.75h6.666" stroke="#E3E3E3" stroke-opacity=".5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>                
                </div>
              </li>
            <% }); %>
          </ul>
          <button id="modalRecentShow" class="modal-recent-button">
            <svg width="6" height="17" viewBox="0 0 6 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 1 12.5 L 5 8.5 L 1 4.5" stroke="#7b7b7b" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>                
          </button>
        </div>
      </div>
    </div>
    <% if (options.length) { %>
      <div id="modalOptionsContainer">
        <% options.forEach((option) => { %>
          <div class="modal-option" data-toggle="tooltip" data-placement="top" title="<%= tr(option.description) %>">
            <input type="checkbox" id="<%= option.id %>" <%= option.checked ? 'checked' : '' %> /> 
            <label for="<%= option.id %>"><%= option.text %></label>
          </div>
        <% }); %>
      </div>
    <% } %>
  </div>
`);
