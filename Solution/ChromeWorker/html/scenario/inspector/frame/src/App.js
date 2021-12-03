'use strict';

window.App = {
  name: 'App',

  data() {
    const tabs = [
      {
        name: 'variables',
        component: GroupsPanel,
        props: {
          title: 'tabs.variablesEmpty',
          styles: { '--group-br': '0px' },
          data: {
            VAR1: 0,
            VAR2: 'foo',
            VAR3: null,
            VAR4: false,
            VAR5: undefined,
            VAR6: new Date(),
            VAR7: ['foo', ['bar', 'baz']],
            VAR8: { a: 2, b: 3, c: { d: 4 } },
          },
        },
      },
      {
        name: 'resources',
        component: GroupsPanel,
        props: {
          title: 'tabs.resourcesEmpty',
          styles: { '--group-br': '10px' },
          data: {
            RES1: 0,
            RES2: 'foo',
            RES3: null,
            RES4: false,
            RES5: undefined,
            RES6: new Date(),
            RES7: ['foo', ['bar', 'baz']],
            RES8: { a: 2, b: 3, c: { d: 4 } },
          },
        },
      },
      {
        name: 'callstack',
        component: CallstackPanel,
        props: {
          title: 'tabs.callstackEmpty',
          data: [],
        },
      },
    ];

    return { tabs, tab: tabs[0] };
  },

  created() {
    window.addEventListener('message', this.handleMessage);
  },

  destroyed() {
    window.removeEventListener('message', this.handleMessage);
  },

  methods: {
    handleMessage({ data }) {
      const { type, payload } = data;

      if (type === 'update' && payload) {
        this.tabs.forEach(tab => {
          const json = payload[tab.name];
          if (json) tab.props.data = json;
        });
      }
    },

    hide() {
      window.top.postMessage({ type: 'hide' }, '*');
    },
  },

  template: html`
    <div id="app">
      <div class="app-header">
        <ul class="app-tabs">
          <li v-for="t in tabs" :key="t.name" :class="{ active: tab === t }" class="app-tab">
            <a href="#" @click.prevent="tab = t">
              <img :src="'src/assets/icons/' + t.name + '.svg'" alt>
              {{ $t('tabs.' + t.name) }}
            </a>
          </li>
        </ul>
        <button type="button" @click="hide">
          <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path fill="#606060" d="M2.87348 12.2583L3.93414 13.3189L8 9.25305L12.0659 13.3189L13.1265 12.2583L9.06066 8.19239L13.1265 4.12652L12.0659 3.06586L8 7.13173L3.93414 3.06586L2.87348 4.12652L6.93934 8.19239L2.87348 12.2583Z" />
          </svg>
        </button>
      </div>
      <keep-alive>
        <component :is="tab.component" :key="tab.name" v-bind="tab.props" />
      </keep-alive>
    </div>
  `,
};
