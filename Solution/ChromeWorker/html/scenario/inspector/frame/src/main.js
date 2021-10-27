Vue.use(window['v-click-outside']);

new Vue({
  i18n: new VueI18n({
    locale: new URL(window.location.href).searchParams.get('lang') || 'en',
    messages: { ...window.locales },
    pluralizationRules: {
      ru(choice, choicesLength) {
        if (choice === 0) return 0;

        const teen = choice > 10 && choice < 20;
        const endsWithOne = choice % 10 === 1;
        if (!teen && endsWithOne) return 1;

        return choicesLength < 4 || (!teen && choice % 10 >= 2 && choice % 10 <= 4) ? 2 : 3;
      }
    },
    fallbackLocale: 'en'
  }),
  render: h => h(App)
}).$mount('#app');
