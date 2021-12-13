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

    data: {
      required: true,
      type: Object,
    },
  },

  data() {
    const filters = ['undefined', 'boolean', 'object', 'string', 'number', 'array', 'date', 'null'],
      sortings = ['frequency', 'dateModified', 'dateCreated', 'alphabetically'];

    return {
      sortings: sortings.map((name, idx) => ({ name, active: idx === 3 })),
      filters: filters.map(name => ({ name, active: true })),
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

    sortedData() {
      const { source, history, metadata, activeFilters, activeSortings } = this;
      const cache = history.flat(), updates = history.length;
      const query = this.query.toLowerCase();

      const result = Object.keys(source)
        .filter(key => {
          if (!key.toLowerCase().includes(query)) return false;
          const type = getType(source[key]);
          return this.activeFilters.some(f => f === type);
        })
        .sort((a, b) => {
          if (a.startsWith('GLOBAL:') !== b.startsWith('GLOBAL:')) return 0;
          a = `/${a}`;
          b = `/${b}`;

          switch (activeSortings[0]) {
            case 'dateModified':
              return metadata[b].modifiedAt - metadata[a].modifiedAt;
            case 'dateCreated':
              return metadata[b].createdAt - metadata[a].createdAt;
            case 'frequency':
              const f2 = cache.filter(v => v === b).length + updates;
              const f1 = cache.filter(v => v === a).length + updates;
              return metadata[b].usages / f2 - metadata[a].usages / f1;
          }

          return a.localeCompare(b);
        });

      return result.reduce((acc, key) => (acc[key] = source[key], acc), {});
    },

    isEmpty() {
      return !Object.keys(this.data).length;
    },

    source() {
      return this.transform(this.data);
    },
  },

  watch: {
    data: {
      handler(newData, oldData) {
        const diff = jsonpatch.compare(oldData, newData);
        const highlight = this.highlight;
        const metadata = this.metadata;

        if (diff.length) {
          let history = [];

          diff.forEach(({ path, op }) => {
            const now = performance.now();
            history.push(path);

            if (Object.prototype.hasOwnProperty.call(metadata, path)) {
              if (op === 'remove') return delete metadata[path];
              metadata[path].modifiedAt = now;
              metadata[path].usages += 1;
            } else {
              metadata[path] = { modifiedAt: now, createdAt: now, usages: 1, count: 5 };
            }
          });

          this.history = [...this.history, ...history].slice(-100);
        }

        Object.entries(metadata).forEach(([path, item]) => {
          if (highlight) {
            // item.count = diff.some(v => v.path === path) ? 0 : Math.min(item.count + 1, 5);
          }
        });

        this.highlight = false;
      },

      deep: true,
    },
  },

  methods: {
    transform(data) {
      const iteratee = (acc, key) => {
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
        return (acc[key] = val), acc;
      };
      return Object.keys(data).reduce(iteratee, Array.isArray(data) ? [] : {});
    },
  },

  template: html`
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
      <div v-if="isEmpty" class="app-panel-title" v-t="title"></div>
      <div v-else class="app-panel-content">
        <groups-list ref="list" :style="styles" :source="sortedData" />
      </div>
    </div>
  `,
};
