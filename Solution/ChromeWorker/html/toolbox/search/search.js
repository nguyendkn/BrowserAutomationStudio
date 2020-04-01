var SearchTemplate = `
  <div class='container-fluid mainscreen'>
    <div class="ais-SearchBox" id="searchbox">
    
    </div>
    <header class="ais-Header">
      <div class="description-switcher" id="switcher">
    
      </div>
      <div class="pagination-container" id="pagination">

      </div>
    </header>
    <div class="ais-Hits-container" id="hits">
    
    </div>
  </div>
`;

function BrowserAutomationStudio_InitSearch() {
  $(".search")
    .append(SearchTemplate)
    .hide();

  let keys = Object.keys(_A);
  let actions = [];

  keys.forEach(k => {
    let el = _A[k];
    if (el["class"] != "browser") {
      let groupName = "";
      let groupId = "";

      if (_A2G[k]) {
        groupId = _A2G[k];
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
          k: k
        });
      } else {
        actions.push({
          groupName: groupName,
          name: tr(el["name"]),
          groupId: groupId,
          k: k
        });
      }
    }
  });

  let InstantSearch = instantsearch({
    indexName: "InstantSearch",
    searchClient: {
      currentPage: 0,

      getHits(params) {
        let query = params.query;
        return actions.filter(el => {
          return el.name.toLowerCase().indexOf(query) >= 0;
        });
      },

      search(requests) {
        return new Promise(resolve => {
          let hitsResult = this.getHits(requests[0].params);
          this.currentPage = this.currentPage == 0 ? 1 : 0;
          resolve({
            results: [
              {
                nbHits: hitsResult.length,
                hits: hitsResult,
                hitsPerPage: 6,
                nbPages: 2,
                page: 0
              }
            ]
          });
        });
      }
    }
  });

  InstantSearch.addWidgets([
    customPagination({
      container: document.querySelector("#pagination")
    })
  ]);

  InstantSearch.addWidget(
    instantsearch.widgets.searchBox({
      container: "#searchinput"
    })
  );

  InstantSearch.addWidget(
    instantsearch.widgets.hits({
      container: "#hits",
      templates: {
        item: `
				  <div class="hit hit-action" data-value='{{k}}'>
					  <div>
						  {{name}}
					  </div>
				  </div>
				  <div class="hit hit-module">
					  {{groupName}}
				  </div>
				  <div class="hit hit-docs">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
				  </div>
				  <div class="hit hit-docs">
					  {{sub}}
				  </div>
			  `
      }
    })
  );

  InstantSearch.start();
}
