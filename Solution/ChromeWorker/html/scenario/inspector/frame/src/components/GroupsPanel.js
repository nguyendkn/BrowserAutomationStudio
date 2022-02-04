'use strict';

window.GroupsPanel = {
  name: 'GroupsPanel',

  components: {
    PanelToolbar,
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

    order: {
      type: String,
      required: true,
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

    addGroup() {
      this.$refs.list.addGroup();
    },
  },

  template: /*html*/ `
    <div class="app-panel">
      <panel-toolbar v-model.trim="query" />
      <div v-show="!isEmpty" class="app-panel-content">
        <groups-list ref="list" :source="data" :order="sorted" :filter="filter" :flat="flat" :id="name" />
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="title"></div>
    </div>
  `,
};
