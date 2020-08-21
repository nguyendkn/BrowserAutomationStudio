class BasModalDialog {
  constructor ({
    itemColor = 'dark',
    itemType = 'none',
    items = []
  } = {}) {
    this.itemColor = itemColor;
    this.itemType = itemType;
    this.items = items;
    this.modal = null;
  }

  static create() {
    const instance = new this();
    instance.render();
    return instance;
  }

  get sorted() {
    const sorted = this.items.sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      return aLower.localeCompare(bLower);
    });
    let results = [], last = '';

    sorted.forEach((item) => {
      const splitter = item[0];

      if (splitter !== last) {
        results.push({
          type: 'splitter',
          value: splitter
        });
        last = splitter;
      }

      results.push({
        type: 'item',
        value: item
      });
    });

    return results;
  }

  render() {
    const template = _.template(`
      <div class="modal-dialog-container">
        <div class="modal-search-container">
          <input class="modal-search-input" type="text" placeholder="<%= tr('Start typing ' + itemType + ' name...') %>">
          <button type="button" id="modalClose" class="modal-search-close">
            <i class="fa fa-fw fa-times" aria-hidden="true"></i>
          </button>
          <button type="button" id="modalRecent" class="modal-search-recent">
            <i class="fa fa-fw fa-list" aria-hidden="true"></i>
          </button>
        </div>
        <div class="modal-list-container">
          <ul>
            <% _.each(items, (item) => { %>
              <li class="modal-list-<%= item.type %>"><%= item.value %></li>
            <% }); %>
          </ul>
        </div>
        <div class="modal-recent-container">
          <ul>
          
          </ul>
        </div>
      </div>
    `);

    this.modal = $(template({
      itemColor: this.itemColor,
      itemType: this.itemType,
      items: this.sorted,
    })).appendTo('body').show();
  }

  destroy() {
    if (this.modal === null) return;
    this.modal.remove();
    this.modal = null;
  }
}