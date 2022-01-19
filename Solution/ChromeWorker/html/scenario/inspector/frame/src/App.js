'use strict';

window.App = {
  name: 'App',

  data() {
    const tabs = [
      {
        name: 'variables',
        props: {
          data: {},
          title: 'tabs.variablesEmpty',
        },
        component: GroupsPanel,
      },
      {
        name: 'resources',
        props: {
          data: {},
          title: 'tabs.resourcesEmpty',
        },
        component: GroupsPanel,
      },
      {
        name: 'callstack',
        props: {
          data: [],
          title: 'tabs.callstackEmpty',
        },
        component: CallstackPanel,
      },
    ];

    return { tabs, tab: tabs[0] };
  },

  watch: {
    tab({ name }) {
      if (name === 'callstack') {
        this.$nextTick(() => {
          window.dispatchEvent(new Event('resize'));
        });
      }
    },
  },

  mounted() {
    window.addEventListener('message', this.handleMessage);
    this.send('mounted');
  },

  destroyed() {
    window.removeEventListener('message', this.handleMessage);
    this.send('destroyed');
  },

  methods: {
    handleMessage({ data }) {
      const { type, payload } = data;

      if (type === 'update' && payload) {
        this.tabs.forEach(({ name, props }) => {
          if (hasOwn(payload, name)) {
            props.data = this.transform(payload[name]);
          }
        });
      }
    },

    transform(data) {
      return Object.keys(data).reduce((acc, key) => {
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
      }, Array.isArray(data) ? [] : {});
    },

    send(type) {
      window.top.postMessage({ type }, '*');
    },
  },

  template: /*html*/ `
    <div id="app">
      <div class="app-header">
        <ul class="app-tabs">
          <li v-for="item in tabs" :key="item.name" :class="{ active: tab === item }" class="app-tab">
            <a href="#" @click.prevent="tab = item">
              <img :src="'src/assets/icons/' + item.name + '.svg'" alt>
              {{ $t('tabs.' + item.name) }}
            </a>
          </li>
        </ul>
        <button type="button" @click="send('hide')">
          <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.87348 12.2583L3.93414 13.3189L8 9.25305L12.0659 13.3189L13.1265 12.2583L9.06066 8.19239L13.1265 4.12652L12.0659 3.06586L8 7.13173L3.93414 3.06586L2.87348 4.12652L6.93934 8.19239L2.87348 12.2583Z" fill="#606060" />
          </svg>
        </button>
      </div>
      <template v-for="item in tabs">
        <component :is="item.component" v-show="tab === item" :key="item.name" :name="item.name" :class="item.name" v-bind="item.props" />
      </template>
    </div>
  `,
};
