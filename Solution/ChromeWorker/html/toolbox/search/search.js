function SearchManager() {
  const engine = new BasSearchEngine();

  let lastQuery = null;
  let pagesCount = 1;
  let pageIndex = 0;

  const inViewport = (element) => {
    let viewportTop = $(window).scrollTop();
    let viewportBottom = viewportTop + $(window).height();

    let boundsTop = element.offset().top;
    let boundsBottom = boundsTop + element.outerHeight();

    return boundsTop >= viewportTop && boundsBottom <= viewportBottom;
  };

  this.Search = function (query) {
    lastQuery = query;
    $('.results-recent').hide();
    this.RenderSearch(engine.search(query));
  };

  this.Recent = function () {
    lastQuery = null;
    $('.results-recent').show();
    this.RenderSearch(engine.recent());
  };

  this.RenderSearch = function (items) {
    const container = $('#results');
    // container.unmark();
    container.empty();

    const results = [];
    pagesCount = 1;
    pageIndex = 0;

    _.each(_.take(items, 100), (item, index) => {
      const template = templates[item.type]({
        index: _.padLeft(index + 1, 2, '0'),
        page: pagesCount - 1,
        ...item,
      });
      results.push($(template).appendTo(container));

      if (!inViewport(container)) {
        _.initial(results).forEach((result) => result.hide());

        if (index == 0) {
          _.last(results).data('page', pagesCount - 1);
        } else {
          _.last(results).data('page', pagesCount);
        }

        pagesCount += (index == 0) ? 0 : 1;
      }
    });

    // container.mark(lastQuery || '');
    this.AddOnClick();
    this.ShowPage(0);
  };

  this.AddOnClick = function () {
    $('.result-item').click(function () {
      const action = $(this).data('name');
      const popup = $(this).data('popup');
      const value = $(this).data('value');

      if (value.indexOf('https://') == 0 || value.indexOf('http://') == 0) {
        BrowserAutomationStudio_OpenUrl(value);
      } else {
        if (popup) {
          BrowserAutomationStudio_Notify('search', action);
        } else {
          BrowserAutomationStudio_OpenAction(value);
        }
      }
    });
  };

  this.ShowPage = function (index) {
    const results = $('.result-item');

    results.each(function () {
      const pageIndex = $(this).data('page');
      $(this).toggle(pageIndex == index);
    });

    $('#nextpage').prop('disabled', pageIndex == pagesCount - 1);
    $('#prevpage').prop('disabled', pageIndex == 0);
    $('#pagination').toggle(pagesCount > 1);

    $('#currpage').html(pageIndex + 1);
    $('#lastpage').html(pagesCount);

    if (!lastQuery) {
      $('.results-empty').html(tr('No recent actions found'));
    } else {
      $('.results-empty').html(tr('Nothing found'));
    }

    $('.results-recent').toggle(results.length && lastQuery == null);
    $('.results-empty').toggle(!results.length);
  };

  this.Render = function () {
    $('.results-recent').text(tr('Recent actions'));
    $('.results-recent').hide();
    $('.results-empty').hide();

    $('#nextpage').click((e) => {
      e.preventDefault();
      this.ShowPage(++pageIndex);
    });

    $('#prevpage').click((e) => {
      e.preventDefault();
      this.ShowPage(--pageIndex);
    });

    $(window).resize(() => {
      if ($('.search').is(':visible')) {
        if (lastQuery) {
          this.Search(lastQuery);
        } else {
          this.Recent();
        }
      }
    });

    $('#searchinputclear').hide();
    $('#pagination').hide();
    $('.search').hide();
  };

  this.Toggle = function (hide) {
    $('#searchinputclear, #pagination, .search').toggle(!hide);
    $('body').css('overflow', hide ? 'visible' : 'hidden');
    $('.actions').toggle(hide);
    $('#searchinput').val('');
  }

  this.Show = function () {
    $('#searchinput').focus();
    this.Toggle(false);
    this.Recent();
  };

  this.Hide = function () {
    $('#searchinput').blur();
    this.Toggle(true);
  };

  const templates = {
    action: _.template(`
      <li class="result-item bg-action" data-page="<%= page %>" data-value="<%= key %>" data-popup="<%= popup %>" data-name="<%= name %>">
        <div class="result-item-left">
          <img class="item-icon" src="<%= icon %>">
          <span class="item-index">
            <%= index %>
          </span>
        </div>
        <div class="result-item-right">
          <div>
            <div class="item-action">
              <%= name %>
            </div>
            <div class="item-description">
              <%= description %>
            </div>
          </div>
          <div class="item-module">
            <%= module %>
          </div>
        </div>
      </li>
    `),
    link: _.template(`
      <li class="result-item bg-link" data-page="<%= page %>" data-value="<%= key %>">
        <div class="result-item-left">
          <img class="item-icon" src="<%= icon %>">
          <span class="item-index">
            <%= index %>
          </span>
        </div>
        <div class="result-item-right">
          <div>
            <div class="item-action">
              <%= name %>
            </div>
          </div>
        </div>
      </li>
    `),
  };
}
