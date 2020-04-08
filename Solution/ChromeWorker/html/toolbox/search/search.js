function SearchManager() {
  const excludedActions = ["httpclientgetcookiesforurl", "getcookiesforurl", "check"];
  const groups = _.filter(_TaskCollection.toJSON(), {type: 'group'});
  
  let lastQuery = null;

  let actions = [];
  let pages = [];

  let current = 0;
  let total = 0;

  const getText = (element) => {
    let html = tr(element.html());
    let node = $("<div/>");
    node.append(html);
    return node.text();
  };

  _.forOwn(_A, (el, action) => {
    let actionContent = $("#" + action).text();

    let defaultDesc = $(actionContent)
      .find(".tooltip-paragraph-first-fold");
    let shortDesc = $(actionContent)
      .find(".short-description");
    let description = null;

    if (defaultDesc.length) 
      description = getText(defaultDesc);
    if (shortDesc.length) 
      description = getText(shortDesc);

    let group = _.find(groups, {
      name: _A2G[action] || "browser"
    });
      
    actions.push({
      popup: !_.has(_A2G, action),
      module: group.description,
      description: description,
      name: tr(el["name"]),
      icon: group.icon,
      key: action,
    });
  });

  this.Search = function (query) {
    lastQuery = query;
    $('.results-recent').hide();
    renderSearch(_.filter(actions, (el) => {
      let queryLower = query.toLowerCase();
      let nameLower = el.name.toLowerCase();
      if (excludedActions.includes(el.key)) {
        return false;
      }
      return nameLower.indexOf(queryLower) >= 0;
    }));
  };

  this.Recent = function () {
    lastQuery = null;
    $('.results-recent').show();
    renderSearch(_.map(ActionHistory, (el) => {
      return _.find(actions, {key: el});
    }));
  };

  const getItemsCount = (rows) => {
    let screenWidth = $(window).width();
    if (screenWidth > 960) return 3 * rows;
    if (screenWidth > 480) return 2 * rows;
    return rows;
  };

  const renderSearch = (results, rows) => {
    rows = rows || (Math.floor(window.innerHeight / 100) - 1);
    let itemsCount = getItemsCount(rows);
    results = _.take(results, 100);
    pages = _.chunk(results, itemsCount);
    total = results.length;
    current = 0;

    let allInView = renderPage(pages[0]);
    if (!allInView && rows > 1) {
      renderSearch(results, rows - 1);
    }
  };

  const inViewport = (element) => {
    let viewport = {};
    viewport.top = $(window).scrollTop();
    viewport.bottom = viewport.top + $(window).height();

    let bounds = {};
    bounds.top = element.offset().top;
    bounds.bottom = bounds.top + element.outerHeight();

    return bounds.top >= viewport.top && bounds.bottom <= viewport.bottom;
  };

  const renderPagination = () => {
    $("#count").html(`${total} results`);
    
    if (total > 0) {
      $("#pages").html(`${current + 1} - ${pages.length}`);
    } else {
      $("#pages").html(`${current + 1} - ${pages.length + 1}`);
    }

    $(".results-empty").toggle(total == 0);
  };

  const renderPage = (page) => {
    let container = $("#results");
    container.unmark();
    container.empty();

    if (total == 0) {
      renderPagination();
      return true;
    }

    page.forEach((item) =>  container.append(template({item})));

    $(".result-item").click(function () {
      let action = $(this).find(".result-action").text().trim();
      let popup = $(this).data("popup");
      let value = $(this).data("value");

      if (popup) {
        BrowserAutomationStudio_Notify("search", action);
      } else {
        $("body").css("overflow-y", "visible");
        _Router.navigate(`#!/${value}`, true);
      }
    });

    $("#nextpage").prop("disabled", () => {
      return pages.length == 1 || current == pages.length - 1;
    });

    $("#prevpage").prop("disabled", () => {
      return pages.length == 1 || current == 0;
    });

    renderPagination();
    container.mark(lastQuery || "");
    return inViewport(container);
  };

  this.Render = function () {
    $("#nextpage").click(() => renderPage(pages[++current]));
    $("#prevpage").click(() => renderPage(pages[--current]));
    $(".results-recent").text(tr("Recent actions"));
    $(".results-empty").text(tr("Nothing found"));

    $(window).resize(() => {
      if (lastQuery) {
        this.Search(lastQuery);
      } else {
        this.Recent();
      }
    });

    $("#pagination").hide();
    $(".search").hide();
  };

  this.Show = function () {
    $("body").css("overflow-y", "hidden");
    $("#pagination, .search").show();
    $("#searchinput").focus();
    $(".actions").hide();

    this.Recent();
  };

  this.Hide = function () {
    $("body").css("overflow-y", "visible");
    $("#pagination, .search").hide();
    $("#searchinput").blur();
    $(".actions").show();

    $("#searchinput").val("");
  };

  let template = _.template(`
    <li class="result-item" data-value="<%= item.key %>" data-popup="<%= item.popup %>">
        <img src="<%= item.icon %>">
        <div class="result result-action">
          <%= item.name %>
        </div>
        <div class="result result-module">
          <%= item.module %>
        </div>
        <div class="result result-description">
          <%= item.description %>
        </div>
    </li>
  `);
}
