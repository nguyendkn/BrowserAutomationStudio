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
    const { sortings, options, filters } = this.$store.state[this.name];

    return {
      sortings: ['frequency', 'dateModified', 'dateCreated', 'alphabetically'].map(name => {
        const sorting = sortings.find(item => item.name === name);
        return { name, active: sorting ? sorting.active : name === 'alphabetically' };
      }),
      filters: ['undefined', 'boolean', 'object', 'string', 'number', 'array', 'date', 'null'].map(name => {
        const filter = filters.find(item => item.name === name);
        return { name, active: filter ? filter.active : true };
      }),
      options: ['groups'].map(name => {
        const option = options.find(item => item.name === name);
        return { name, active: option ? option.active : true };
      }),
      order: 'ascending',
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

    usages() {
      return this.history.flat().reduce((acc, key) => {
        return (acc[key] = (acc[key] || 0) + 1, acc);
      }, {});
    },

    sorted() {
      const { data, order, usages, metadata, activeSortings } = this;
      const ascending = order === 'ascending';

      return Object.keys(data).sort((a, b) => {
        if (a.startsWith('GLOBAL:') !== b.startsWith('GLOBAL:')) return 0;
        [a, b] = ascending ? [a, b] : [b, a];

        switch (activeSortings[0]) {
          case 'dateModified':
            return metadata[b].modifiedAt - metadata[a].modifiedAt;
          case 'dateCreated':
            return metadata[b].createdAt - metadata[a].createdAt;
          case 'frequency':
            return usages[b] - usages[a];
        }

        return (a > b) - (a < b);
      });
    },

    flat() {
      return !this.options[0].active;
    },
  },

  watch: {
    sortings(sortings) {
      this.$store.commit('setSortings', { id: this.name, sortings });
    },

    filters(filters) {
      this.$store.commit('setFilters', { id: this.name, filters });
    },

    options(options) {
      this.$store.commit('setOptions', { id: this.name, options });
    },

    data($new, $old) {
      const { metadata } = this, diff = microdiff($old, $new);

      if (diff.length) {
        const history = [];

        diff.forEach(({ path, type }) => {
          if (path.length === 1) {
            const [name] = path, now = performance.now();

            if (type === 'REMOVE') {
              this.$store.commit('removeNode', { id: this.name, path });
              return delete metadata[name];
            }

            if (hasOwn(metadata, name)) {
              metadata[name].modifiedAt = now;
            } else {
              metadata[name] = { modifiedAt: now, createdAt: now };
            }

            history.push(name);
          }
        });

        this.history = this.history.concat(history).slice(-100);
        this.$store.commit('setDiff', { id: this.name, diff });
      }
    },
  },

  methods: {
    filter(name, value) {
      if (name.toLowerCase().includes(this.query.toLowerCase())) {
        return this.activeFilters.includes(typeOf(value));
      }
      return false;
    },
  },

  template: /*html*/ `
    <div class="app-panel">
      <panel-toolbar v-model.trim="query" :sortings.sync="sortings" :filters.sync="filters" :options.sync="options" :order.sync="order">
        <template v-if="!isEmpty && !flat" #controls>
          <button type="button" style="border-right-color: transparent;" @click="$refs.list.addGroup()">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.5 3.5V2h-6v12h15V3.5h-9Zm8 9.5h-13V5h13v8Z" fill="#606060" />
              <path d="M7.5 12h1V9.5H11v-1H8.5V6h-1v2.5H5v1h2.5V12Z" fill="#606060" />
            </svg>
          </button>
        </template>
      </panel-toolbar>
      <div v-show="!isEmpty" class="app-panel-content">
        <groups-list ref="list" :source="data" :order="sorted" :filter="filter" :flat="flat" :id="name" />
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="title"></div>
    </div>
  `,
};
