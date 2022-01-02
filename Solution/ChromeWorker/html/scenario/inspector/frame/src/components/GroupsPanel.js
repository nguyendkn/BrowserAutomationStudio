'use strict';

window.GroupsPanel = {
  name: 'GroupsPanel',

  components: {
    PanelToolbar,
    GroupsList,
  },

  props: {
    styles: {
      required: true,
      type: Object,
    },

    title: {
      required: true,
      type: String,
    },

    name: {
      required: true,
      type: String,
    },

    data: {
      required: true,
      type: Object,
    },
  },

  data() {
    const filters = ['undefined', 'boolean', 'object', 'string', 'number', 'array', 'date', 'null'],
      sortings = ['frequency', 'dateModified', 'dateCreated', 'alphabetically'];

    return {
      sortings: sortings.map(name => ({ name, active: name === 'alphabetically' })),
      filters: filters.map(name => ({ name, active: true })),
      highlight: false,
      metadata: {},
      history: [],
      query: '',
    };
  },

  computed: {
    activeSortings() {
      return this.sortings.filter(s => s.active).map(s => s.name);
    },

    activeFilters() {
      return this.filters.filter(f => f.active).map(f => f.name);
    },

    filteredData() {
      const { source, activeFilters } = this;
      const query = this.query.toLowerCase();

      const result = Object.keys(source)
        .filter(key => {
          if (!key.toLowerCase().includes(query)) return false;
          const type = typeOf(source[key]);
          return this.activeFilters.some(f => f === type);
        })

      return result.reduce((acc, key) => (acc[key] = source[key], acc), {});
    },

    sortedKeys() {
      const { history, metadata, activeSortings } = this;
      const cache = history.flat(), updates = history.length;

      return Object.keys(this.filteredData).sort((a, b) => {
        if (a.startsWith('GLOBAL:') !== b.startsWith('GLOBAL:')) return 0;

        switch (activeSortings[0]) {
          case 'dateModified':
            return metadata[b].modifiedAt - metadata[a].modifiedAt;
          case 'dateCreated':
            return metadata[b].createdAt - metadata[a].createdAt;
          case 'frequency':
            const f1 = cache.filter(v => v === a).length + updates;
            const f2 = cache.filter(v => v === b).length + updates;
            return metadata[b].usages / f2 - metadata[a].usages / f1;
        }

        return a.localeCompare(b);
      });
    },

    isEmpty() {
      return !Object.keys(this.data).length;
    },

    source() {
      return this.transform(this.data);
    },
  },

  watch: {
    source($new, $old) {
      const diff = microdiff($old, $new);
      const highlight = this.highlight;
      const metadata = this.metadata;

      if (diff.length) {
        const history = [];

        diff.forEach(({ path, type }) => {
          if (path.length === 1) {
            const [name] = path, now = performance.now();

            if (hasOwn(metadata, name)) {
              if (type === 'REMOVE') return delete metadata[name];
              metadata[name].modifiedAt = now;
              metadata[name].usages += 1;
              metadata[name].count += 0;
            } else {
              metadata[name] = { modifiedAt: now, createdAt: now, usages: 1, count: 5 };
            }
  
            history.push(name);
          }
        });

        this.history = this.history.concat(history).slice(-100);
      }

      Object.entries(metadata).forEach(([name, item]) => {
        if (highlight) {
          item.count = diff.some(v => v.path[0] === name) ? 0 : Math.min(item.count + 1, 5);
          // this.trigger('highlight', { count: item.count, path });
        }
      });

      this.highlight = false;
    },
  },

  methods: {
    transform(data) {
      const callback = (acc, key) => {
        let val = data[key];
        if (typeof val === 'string') {
          if (val.startsWith('__UNDEFINED__')) {
            val = undefined;
          } else if (val.startsWith('__DATE__')) {
            val = new Date(val.slice(8));
          }
        } else if (typeof val === 'object' && val) {
          val = this.transform(val);
        }
        return (acc[key] = val, acc);
      };
      return Object.keys(data).reduce(callback, Array.isArray(data) ? [] : {});
    },
  },

  template: /*html*/ `
    <div class="app-panel">
      <panel-toolbar :sortings.sync="sortings" :filters.sync="filters" :query.sync="query">
        <template #controls>
          <button type="button" style="border-right-color: transparent;" @click="$refs.list.addGroup()">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.5 3.5V2h-6v12h15V3.5h-9Zm8 9.5h-13V5h13v8Z" fill="#606060" />
              <path d="M7.5 12h1V9.5H11v-1H8.5V6h-1v2.5H5v1h2.5V12Z" fill="#606060" />
            </svg>
          </button>
        </template>
      </panel-toolbar>
      <div v-show="isEmpty" class="app-panel-title" v-t="title"></div>
      <div v-show="!isEmpty" class="app-panel-content">
        <groups-list ref="list" :style="styles" :source="filteredData" :order="sortedKeys" />
      </div>
    </div>
  `,
};
