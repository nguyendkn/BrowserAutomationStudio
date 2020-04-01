const customPagination = instantsearch.connectors.connectPagination(
  (renderOptions, isFirstRender) => {
    const {
      pages,
      nbPages,
      nbHits,
      currentRefinement,
      isFirstPage,
      isLastPage,
      refine
    } = renderOptions;
    const container = document.querySelector("#pagination");
    console.log(renderOptions);

    container.innerHTML = `
			  <p class='pagination-results'>
				  ${nbHits} results
			  </p>
			  <nav>
				  <button class='pagination-button-left pagination-button' data-value='${currentRefinement -
            1}' id='prevpage' aria-label="Previous results">
					  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
						  stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
						  <line x1="19" y1="12" x2="5" y2="12"></line>
						  <polyline points="12 19 5 12 12 5"></polyline>
					  </svg>
				  </button>
				  <button class='pagination-button-left pagination-button' data-value='${currentRefinement +
            1}' id='nextpage' aria-label="Next results">
					  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
						  stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
						  <line x1="5" y1="12" x2="19" y2="12"></line>
						  <polyline points="12 5 19 12 12 19"></polyline>
					  </svg>
				  </button>
			  </nav>
			  <p class='pagination-pages'>
				  1 - 9
			  </p>`;

    document.querySelector("#prevpage").addEventListener("click", event => {
      event.preventDefault();

      let value = event.currentTarget.dataset.value;
      console.log(value);
      refine(value);
    });

    document.querySelector("#nextpage").addEventListener("click", event => {
      event.preventDefault();

      let value = event.currentTarget.dataset.value;
      console.log(value);
      refine(value);
    });
  }
);
