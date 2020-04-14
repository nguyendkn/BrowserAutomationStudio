function SearchManager() {
  const excludedActions = ["httpclientgetcookiesforurl", "getcookiesforurl", "check"];

  let lastQuery = null;
  let searchItems = [];
  let currentPage = 0;
  let itemsCount = 0;
  let pagesCount = 1;

  /* Helpers */
  const inViewport = (element) => {
    let viewportTop = $(window).scrollTop();
    let viewportBottom = viewportTop + $(window).height();

    let boundsTop = element.offset().top;
    let boundsBottom = boundsTop + element.outerHeight();

    return boundsTop >= viewportTop && boundsBottom <= viewportBottom;
  };

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

    let group = _.find(_TaskCollection.toJSON(), { name: _A2G[key] || "browser", type: "group" });
    let action = { description, name: tr(value.name), type: "action", key };

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
        type: "link",
      });
  });

  _.forEach(_WIKI, (wiki) => {
    if (_K == wiki["lang"])
      searchItems.push({
        icon: "../icons/wiki.png",
        name: wiki["name"],
        key: wiki["url"],
        type: "link",
      });
  });

  this.Search = function (query) {
    lastQuery = query;
    $(".results-recent").hide();
    this.RenderSearch(_.filter(searchItems, (el) => {
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
    $(".results-recent").hide();
    this.RenderSearch(_.map(ActionHistory, (el) => {
      return _.find(searchItems, { key: el });
    }));
  };

  this.RenderSearch = function (items) {
    items = _.forEach(_.take(items, 100), (value, index) => {
      value.index = String(index + 1).padStart(2, "0");
    });

    let container = $("#results");
    container.unmark();
    container.empty();

    let results = [];
    currentPage = 0;
    pagesCount = 1;

    _.each(items, (item, index) => {
      let template = templates[item.type]({ item, page: pagesCount - 1 });
      results.push($(template).appendTo(container));

      if (!inViewport(container)) {
        _.slice(results, 0, -1).forEach((el) => el.hide());

        if (index == 0) {
          _.last(results).data("page", pagesCount - 1);
        } else {
          _.last(results).data("page", pagesCount);   
        }
        
        pagesCount += index == 0 ? 0 : 1;
      }
    });

    itemsCount = items.length;
    container.mark(lastQuery || "");
    this.AddOnClick();
    this.ShowPage(0);
  };

  this.AddOnClick = function () {
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
  };

  this.ShowPage = function (index) {
    $(".result-item").each(function () {
      let pageIndex = $(this).data("page");
      $(this).toggle(pageIndex == index);
    });

    $("#nextpage").prop("disabled", currentPage == pagesCount - 1);
    $("#prevpage").prop("disabled", currentPage == 0);
    $("#pagination").toggle(pagesCount > 1);

    $("#currentpage").html(currentPage + 1);
    $("#lastpage").html(pagesCount);

    if (!lastQuery) {
      $(".results-empty").html(tr("No recent actions found"));
    } else {
      $(".results-empty").html(tr("Nothing found"));
    }

    $(".results-recent").toggle(itemsCount > 0 && lastQuery == null);
    $(".results-empty").toggle(itemsCount == 0);
  };

  this.Render = function () {
    $(".results-recent").text(tr("Recent actions"));
    $(".results-recent, .results-empty").hide();

    $("#nextpage").click((e) => {
      e.preventDefault();
      this.ShowPage(++currentPage);
    });

    $("#prevpage").click((e) => {
      e.preventDefault();
      this.ShowPage(--currentPage);
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

    $("#searchinputclear").hide();
    $("#pagination").hide();
    $(".search").hide();
  };

  this.Toggle = function (hide) {
    $("#searchinputclear, #pagination, .search").toggle(!hide);
    $("body").css("overflow", hide ? "visible" : "hidden");
    $(".actions").toggle(hide);
    $("#searchinput").val("");
  }

  this.Show = function () {
    $("#searchinput").focus();
    this.Toggle(false);
    this.Recent();
  };

  this.Hide = function () {
    $("#searchinput").blur();
    this.Toggle(true);
  };

  const templates = {
    action: _.template(`
      <li class="result-item bg-action" data-page="<%= page %>" data-value="<%= item.key %>" data-popup="<%= item.popup %>" data-name="<%= item.name %>">
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
    `),
    link: _.template(`
      <li class="result-item bg-link" data-page="<%= page %>" data-value="<%= item.key %>">
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
    `),
  };
}
