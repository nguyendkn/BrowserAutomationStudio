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

    return { tab: tabs[0], tabs };
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
    post('mounted');
  },

  destroyed() {
    window.removeEventListener('message', this.handleMessage);
    post('destroyed');
  },

  methods: {
    handleMessage({ data }) {
      const { type, payload } = data;

      if (type === 'update' && payload) {
        this.tabs.forEach(({ name, props }) => {
          if (hasOwn(payload, name)) {
            props.data = mutate(payload[name], value => {
              if (typeof value === 'string') {
                if (value.startsWith('__undefined__')) {
                  return undefined;
                } else if (value.startsWith('__date__')) {
                  return new Date(value.slice(8));
                }
              }
              return value;
            });
          }
        });
      }
    },

    hide() {
      post('hide');
    },

    show() {
      post('show');
    },
  },

  template: /*html*/ `
    <div id="app">
      <div class="app-header">
        <ul class="app-tabs">
          <li v-for="item in tabs" :key="item.name" :class="{ active: item === tab }" class="app-tab">
            <a href="#" @click.prevent="tab = item">
              <img :src="'src/assets/icons/' + item.name + '.svg'" alt>
              {{ $t('tabs.' + item.name) }}
            </a>
          </li>
        </ul>
        <button type="button" @click="$store.commit('toggleToolbar')">
          <svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="m15.7164 15.111-4.2359-3.9328c2.1796-2.63853 1.8355-6.65365-.8031-8.83329C8.03894.165276 4.02382.509429 1.84418 3.14794-.335456 5.78644.00869703 9.80156 2.6472 11.9812c2.29436 1.9502 5.73589 1.9502 8.0302 0l4.2359 3.9329.8031-.8031ZM1.50003 7.16306c0-2.86795 2.29435-5.1623 5.16229-5.1623 2.86795 0 5.16228 2.29435 5.16228 5.1623 0 2.86794-2.29433 5.16234-5.16228 5.16234-2.86794 0-5.16229-2.2944-5.16229-5.16234Z" fill="#606060" />
          </svg>
        </button>
        <button type="button" @click="hide">
          <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.87348 12.2583L3.93414 13.3189L8 9.25305L12.0659 13.3189L13.1265 12.2583L9.06066 8.19239L13.1265 4.12652L12.0659 3.06586L8 7.13173L3.93414 3.06586L2.87348 4.12652L6.93934 8.19239L2.87348 12.2583Z" fill="#606060" />
          </svg>
        </button>
      </div>
      <template v-for="item in tabs">
        <component :is="item.component" v-show="item === tab" :key="item.name" :name="item.name" :class="item.name" v-bind="item.props" />
      </template>
    </div>
  `,
};
