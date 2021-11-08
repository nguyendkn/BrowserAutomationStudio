'use strict';

const json = {
  VAR1: 0,
  VAR2: 'foo',
  VAR3: null,
  VAR4: false,
  VAR5: undefined,
  VAR6: new Date(),
  VAR7: ['foo', ['bar', 'baz']],
  VAR8: { a: 2, b: 3, c: { d: 4 } }
};

const stack = [
  {
    type: 'action',
    name: 'If',
    id: 299996755,
    options: {
      expression:
        '([[CYCLE_INDEX]] > -1) || (false || true) && 1 && 2 && (true || false) && (true || false) && (true || false)',
      arguments: {},
      iterator: 1
    }
  },
  {
    type: 'action',
    name: 'While',
    id: 110819768,
    options: {
      expression: '',
      arguments: {},
      iterator: 2
    }
  },
  {
    type: 'function',
    name: 'test',
    id: 388761436,
    options: {
      expression: '',
      arguments: {
        a1: 1,
        a2: 2
      },
      iterator: 1
    }
  }
];

Vue.use(window['v-click-outside']);

new Vue({
  i18n: new VueI18n({
    locale: new URL(window.location.href).searchParams.get('lang') || 'en',
    messages: { ...window.locales },
    fallbackLocale: 'en',
    pluralizationRules: {
      ru(choice, choicesLength) {
        if (choice === 0) return 0;

        const teen = choice > 10 && choice < 20;
        if (!teen && choice % 10 === 1) return 1;

        return choicesLength < 4 || (!teen && choice % 10 >= 2 && choice % 10 <= 4) ? 2 : 3;
      }
    }
  }),
  render: h => h(App)
}).$mount('#app');
