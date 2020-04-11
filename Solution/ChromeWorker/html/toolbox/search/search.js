function SearchManager() {
  const excludedActions = ["httpclientgetcookiesforurl", "getcookiesforurl", "check"];

  const groups = _.filter(_TaskCollection.toJSON(), {type: "group"});

  let searchItems = [];
  let searchPages = [];

  let lastQuery = null;
  let currentPage = 0;

  const getText = (element) => {
    let html = tr(element.html());
    let node = $("<div/>");
    node.append(html);
    return node.text();
  };

  _.forOwn(_A, (value, key) => {
    let actionContent = $("#" + key).text();

    let defaultDesc = $(actionContent)
      .find(".tooltip-paragraph-first-fold");
    let shortDesc = $(actionContent)
      .find(".short-description");
    let description = null;

    if (defaultDesc.length)
      description = getText(defaultDesc);
    if (shortDesc.length)
      description = getText(shortDesc);

    let group = _.find(groups, {name: _A2G[key] || "browser"});

    let action = {description, name: tr(value.name), type: "action", key};

    if (value.class && value.class == "browser") {
      action.description += tr(" This action works only with element inside browser.");
      action.module = tr("Browser > Element");
      action.icon = "../icons/element.png";
      action.popup = true;
    } else {
      action.module = group.description;
      action.icon = group.icon;
      action.popup = false;
    }

    searchItems.push(action);
  });

  _.forEach(_VIDEO, (video) => {
    if (_K == video["lang"])
      searchItems.push({
        icon: "../icons/youtube.png",
        name: video["name"],
        key: video["url"],
        type: "video",
      });
  });

  _.forEach(_WIKI, (wiki) => {
    if (_K == wiki["lang"])
      searchItems.push({
        icon: "../icons/wiki.png",
        name: wiki["name"],
        key: wiki["url"],
        type: "wiki",
      });
  });

  this.Search = function (query) {
    lastQuery = query;
    $(".results-recent").hide();
    renderSearch(_.filter(searchItems, (el) => {
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
    $(".results-recent").show();
    renderSearch(_.map(ActionHistory, (el) => {
      return _.find(searchItems, {key: el});
    }));
  };

  const getItemsCount = (rows) => {
    let screenWidth = $(window).width();
    if (screenWidth > 960) return 3 * rows;
    if (screenWidth > 480) return 2 * rows;
    return rows;
  };

  const renderSearch = (results, rows) => {
    results = _.forEach(_.take(results, 100), (value, index) => {
      value.index = String(index + 1).padStart(2, "0");
    });

    rows = rows || 10;
    searchPages = _.chunk(results, getItemsCount(rows));
    currentPage = 0;

    let allInView = renderPage(searchPages[0]);
    if (!allInView && rows > 1) {
      renderSearch(results, rows - 1);
    }
  };

  const inViewport = (element) => {
    let viewportTop = $(window).scrollTop();
    let viewportBottom = viewportTop + $(window).height();

    let boundsTop = element.offset().top;
    let boundsBottom = boundsTop + element.outerHeight();

    return boundsTop >= viewportTop && boundsBottom <= viewportBottom;
  };

  const renderPagination = () => {
    $("#currentpage").html(currentPage + 1);

    if (searchPages.length == 0) {
      $("#lastpage").html(searchPages.length + 1);
    } else {
      $("#lastpage").html(searchPages.length);
    }

    $("#nextpage").prop("disabled", () => {
      return searchPages.length <= 1 || currentPage == searchPages.length - 1;
    });

    $("#prevpage").prop("disabled", () => {
      return searchPages.length <= 1 || currentPage == 0;
    });

    $(".results-empty").toggle(searchPages.length == 0);
    $("#pagination").toggle(searchPages.length > 1);
  };

  const renderPage = (page) => {
    let container = $("#results");
    container.unmark();
    container.empty();

    if (searchPages.length == 0) {
      renderPagination();
      return true;
    }

    page.forEach((item) => {
      if (item.type == "action") {
        container.append(actionTemplate({ item }));
      } else {
        container.append(linkTemplate({ item }));
      }
    });

    $(".result-item").click(function () {
      let action = $(this).data("name");
      let popup = $(this).data("popup");
      let value = $(this).data("value");

      if (value.indexOf("https://") == 0 || value.indexOf("http://") == 0) {
        BrowserAutomationStudio_OpenUrl(value);
      } else {
        if (popup) {
          BrowserAutomationStudio_Notify("search", action);
        } else {
          BrowserAutomationStudio_OpenAction(value);
        }
      }
    });

    renderPagination();
    container.mark(lastQuery || "");
    return inViewport(container);
  };

  this.Render = function () {
    $("#nextpage").click((e) => {
      e.preventDefault();
      renderPage(searchPages[++currentPage]);
    });

    $("#prevpage").click((e) => {
      e.preventDefault();
      renderPage(searchPages[--currentPage]);
    });

    $(window).resize(() => {
      if ($(".search").is(":visible")) {
        if (lastQuery) {
          this.Search(lastQuery);
        } else {
          this.Recent();
        }
      }
    });

    $("#pagination").hide();
    $(".search").hide();
  };

  this.Toggle = function (hide) {
    $("body").css("overflow-y", !hide ? 'hidden' : 'visible');
    $("#pagination, .search").toggle(!hide);
    $(".actions").toggle(hide);
    $("#searchinput").val("");
  }

  this.Show = function () {
    $(".search-clear-button").css("color", "#bf5d4e");
    $("#searchinput").focus();
    this.Toggle(false);
    this.Recent();
  };

  this.Hide = function () {
    $(".search-clear-button").css("color", "#f2f2f2");
    $("#searchinput").blur();
    this.Toggle(true);
  };

  let actionTemplate = _.template(`
    <li class="result-item bg-action" data-value="<%= item.key %>" data-popup="<%= item.popup %>" data-name="<%= item.name %>">
      <div class="result-item-left">
        <img class="item-icon" src="<%= item.icon %>">
        <span class="item-index">
          <%= item.index %>
        </span>
      </div>
      <div class="result-item-right">
        <div>
          <div class="item-action">
            <%= item.name %>
          </div>
          <div class="item-description">
            <%= item.description %>
          </div>
        </div>
        <div class="item-module">
          <%= item.module %>
        </div>
      </div>
    </li>
  `);

  let linkTemplate = _.template(`
    <li class="result-item bg-link" data-value="<%= item.key %>">
      <div class="result-item-left">
        <img class="item-icon" src="<%= item.icon %>">
        <span class="item-index">
          <%= item.index %>
        </span>
      </div>
      <div class="result-item-right">
        <div>
          <div class="item-action">
            <%= item.name %>
          </div>
        </div>
      </div>
    </li>
  `);

}
