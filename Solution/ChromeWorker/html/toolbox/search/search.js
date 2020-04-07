function SearchManager() {
  const excludedActions = [
    "httpclientgetcookiesforurl",
    "getcookiesforurl"
  ]
  
  let lastQuery = "";

  let actions = [];
  let pages = [];

  let current = 0;
  let total = 0;

  _.forOwn(_A, (el, action) => {
    if (excludedActions.includes(action)) return;

    let selector = '.tooltip-paragraph-first-fold';
    let script = $("#" + action).text();
    let data = $(script).find(selector);

    actions.push({
      groupId: _A2G[action] || "browser",
      description: tr(data.text()),
      popup: !_.has(_A2G, action),
      name: tr(el["name"]),
      key: action,
    });
  });

  this.Search = function (query) {
    renderSearch(actions.filter((el) => {
      let queryLower = query.toLowerCase();
      let nameLower = el.name.toLowerCase();
      return nameLower.indexOf(queryLower) >= 0;
    }), query);
  };

  this.Recent = function () {
    renderSearch(actions.filter((el) => {
      return ActionHistory.includes(el.key);
    }));
  };

  const getItemsCount = (rows) => {
    let screenWidth = $(window).width();
    if (screenWidth > 960) return 3 * rows;
    if (screenWidth > 480) return 2 * rows;
    return rows;
  };

  const renderSearch = (items, query, rows) => {
    rows = rows || Math.floor(window.innerHeight / 100);
    let itemsCount = getItemsCount(rows);
    pages = _.chunk(items, itemsCount);
    lastQuery = query || "";
    total = items.length;
    current = 0;

    $(".results-recent").toggle(query == "");
    $(".results-empty").hide();

    let allInView = renderPage(pages[0]);
    if (!allInView && rows > 1) {
      renderSearch(items, query, rows - 1);
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
  };

  const renderPage = (page) => {
    let container = $("#results");
    container.unmark();
    container.empty();

    if (total == 0) {
      renderPagination();
      $(".results-empty").show();
      return true;
    }

    console.log(page);
    page.forEach((item) => {
      container.append(
        template({
          icon:
            item.groupId && item.groupId.length > 0
              ? _G[item.groupId]["icon"]
              : "../icons/browser.png",
          description: item.description,
          groupId: item.groupId,
          popup: item.popup,
          name: item.name,
          key: item.key,
        })
      );
    });

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
    container.mark(lastQuery);
    return inViewport(container);
  };

  this.Render = function () {
    $("#nextpage").click(() => renderPage(pages[++current]));
    $("#prevpage").click(() => renderPage(pages[--current]));

    $(window).resize(() => {
      if (lastQuery != "") {
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
    $("#searchinput").focus();
    $("#pagination").show();
    $(".actions").hide();
    $(".search").show();

    this.Recent();
  };

  this.Hide = function () {
    $("body").css("overflow-y", "visible");
    $("#searchinput").blur();
    $("#pagination").hide();
    $(".actions").show();
    $(".search").hide();

    $("#searchinput").val("");
  };

  let template = _.template(`
    <li class="result-item" data-value="<%= key %>" data-popup="<%= popup %>">
        <img src="<%= icon %>">
        <div class="result result-action">
          <%= name %>
        </div>
        <div class="result result-module">
          <%= groupId %>
        </div>
        <div class="result result-description">
          <%= description %>
        </div>
    </li>
  `);
}
