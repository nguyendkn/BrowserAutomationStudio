'use strict';

window.GroupsPanel = {
  name: 'GroupsPanel',

  components: {
    GroupsList,
  },

  props: {
    sortings: {
      type: Array,
      default: () => [],
    },

    filters: {
      type: Array,
      default: () => [],
    },

    options: {
      type: Array,
      default: () => [],
    },

    reverse: {
      type: Boolean,
      default: false,
    },

    query: {
      type: String,
      default: '',
    },

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
    return {
      metadata: {},
      history: [],
      diff: null,
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

    order() {
      const { data, usages, reverse, metadata, activeSortings } = this;

      return Object.keys(data).sort((a, b) => {
        if (a.startsWith('GLOBAL:') === b.startsWith('GLOBAL:')) {
          if (reverse) [a, b] = [b, a];

          switch (activeSortings[0]) {
            case 'dateModified':
              return metadata[b].modifiedAt - metadata[a].modifiedAt;
            case 'dateCreated':
              return metadata[b].createdAt - metadata[a].createdAt;
            case 'frequency':
              return usages[b] - usages[a];
          }
  
          return (a > b) - (a < b);
        }
      });
    },

    flat() {
      return !this.options[0].active;
    },
  },

  watch: {
    data(data, prev) {
      const { metadata } = this, diff = microdiff(prev, data);

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
      }

      this.diff = diff;
    },

    diff(diff, prev) {
      const { name, $store } = this, counters = $store.state.counters[name];

      const pointers = diff.map(({ path }) => {
        const pointer = JSON.stringify(path);
        counters[pointer] = prev ? 0 : 5;
        return pointer;
      });

      Object.keys(counters).forEach(key => {
        if (!pointers.includes(key)) {
          counters[key] = Math.min(counters[key] + 1, 5);
        }
      });

      $store.commit('setCounters', { id: name, counters });
    },
  },

  methods: {
    filter(name, value) {
      if (name.toLowerCase().includes(this.query.toLowerCase())) {
        return this.activeFilters.includes(typeOf(value));
      }
      return false;
    },

    addGroup() {
      this.$refs.list.addGroup();
    },
  },

  template: /*html*/ `
    <div class="app-panel">
      <div v-show="!isEmpty" class="app-panel-content">
        <groups-list ref="list" :source="data" :filter="filter" :order="order" :flat="flat" :id="name" />
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="title"></div>
    </div>
  `,
};
