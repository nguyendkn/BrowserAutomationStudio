'use strict';

window.GroupsPanel = {
  name: 'GroupsPanel',

  components: {
    PanelToolbar,
    GroupsList,
  },

  props: {
    title: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    data: {
      type: Object,
      required: true,
    },
  },

  data() {
    const { sortings, filters } = this.$store.state[this.name];

    return {
      sortings: ['frequency', 'dateModified', 'dateCreated', 'alphabetically'].map(name => {
        return { name, active: sortings.length ? sortings.includes(name) : name === 'alphabetically' };
      }),
      filters: ['undefined', 'boolean', 'object', 'string', 'number', 'array', 'date', 'null'].map(name => {
        return { name, active: filters.length ? filters.includes(name) : true };
      }),
      order: 'ascending',
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

    isEmpty() {
      return !Object.keys(this.data).length;
    },

    sorted() {
      const { order, history, metadata, activeSortings } = this;
      const cache = history.flat(), updates = history.length;
      const descending = order === 'descending'; 

      return Object.keys(this.data).sort((a, b) => {
        if (a.startsWith('GLOBAL:') !== b.startsWith('GLOBAL:')) return 0;
        [a, b] = descending ? [b, a] : [a, b];

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

        return (a > b) - (a < b);
      });
    },
  },

  watch: {
    activeSortings(sortings) {
      this.$store.commit('setSortings', { id: this.name, sortings });
    },

    activeFilters(filters) {
      this.$store.commit('setFilters', { id: this.name, filters });
    },

    data($new, $old) {
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

      if (highlight) {
        Object.entries(metadata).forEach(([name, item]) => {
          item.count = diff.some(v => v.path[0] === name) ? 0 : Math.min(item.count + 1, 5);
        });
      }

      this.highlight = false;
    },
  },

  methods: {
    filter(name, value) {
      let query = this.query.slice();
      query = query.toLowerCase();
      name = name.toLowerCase();

      return name.includes(query) && this.activeFilters.includes(typeOf(value));
    },
  },

  template: /*html*/ `
    <div class="app-panel">
      <panel-toolbar :sortings.sync="sortings" :filters.sync="filters" :order.sync="order" :query.sync="query">
        <template #controls>
          <button type="button" style="border-right-color: transparent;" @click="$refs.list.addGroup()">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.5 3.5V2h-6v12h15V3.5h-9Zm8 9.5h-13V5h13v8Z" fill="#606060" />
              <path d="M7.5 12h1V9.5H11v-1H8.5V6h-1v2.5H5v1h2.5V12Z" fill="#606060" />
            </svg>
          </button>
        </template>
      </panel-toolbar>
      <div v-show="!isEmpty" class="app-panel-content">
        <groups-list ref="list" :source="data" :order="sorted" :filter="filter" :id="name" />
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="title"></div>
    </div>
  `,
};
