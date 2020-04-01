let searchTemplate = `
  <div class='container-fluid mainscreen'>
    <div class='pagination-container' id='pagination'>
      <p class='pagination-results' id='count'>0 results</p>
      <nav>
        <button class='pagination-button-left pagination-button' data-value='' id='prevpage' aria-label="Previous results">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <button class='pagination-button-left pagination-button' data-value='' id='nextpage' aria-label="Next results">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </nav>
      <p class='pagination-pages'>1 - 9</p>
    </div>
    <ol class='results-container' id='results'></ol>
  </div>
`;

let itemTemplate = _.template(`
<li class='result-item'>
    <img src='<%= icon %>'>
    <div class='hit hit-action' data-value='<%= key %>'>
      <%= name %>
    </div>
    <div class="hit hit-module">
      <%= groupId %>
    </div>
    <div class="hit hit-docs">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </div>
    <div class="hit hit-docs">
      {{sub}}
    </div>
</li>`);

function BrowserAutomationStudio_InitSearch() {
  $('.search').append(searchTemplate).hide();

  let keys = Object.keys(_A);
  let actions = [];

  keys.forEach(key => {
    let el = _A[key];

    if (el["class"] != "browser") {
      let groupName = "";
      let groupId = "";

      if (_A2G[key]) {
        groupId = _A2G[key];
        if (_G[groupId]) {
          groupName = _G[groupId]["name"] + " : ";
        }
      }

      if (el["suggestion"]) {
        actions.push({
          suggestionEn: el["suggestion"]["en"],
          suggestionRu: el["suggestion"]["ru"],
          groupName: groupName,
          name: tr(el["name"]),
          groupId: groupId,
          key: key
        });
      } else {
        actions.push({
          groupName: groupName,
          name: tr(el["name"]),
          groupId: groupId,
          key: key
        });
      }
    }
  });

  $("#searchinput").keyup(event => {
    $("#results").empty();

    let query = $("#searchinput").val();
    let results = actions.filter(el => {
      if (el.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        return true;
      }
      return false;
    });

    console.log(query);
    console.log(results);

    let container = $("#results");
    let counter = $('#count');

    results.forEach(val => {
      if (val.groupId && val.groupId.length > 0) {
        container.append(
          itemTemplate({
            icon: _G[val.groupId]["icon"],
            groupId: val.groupId,
            name: val.name,
            key: val.key
          })
        );
      } else {
        container.append(
          itemTemplate({
            groupId: val.groupId,
            name: val.name,
            key: val.key,
            icon: ""
          })
        );
      }
    });

    counter.html(`${results.length} results`);
  });
}
