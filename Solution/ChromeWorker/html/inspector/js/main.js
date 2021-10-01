Vue.config.productionTip = false;

const locale = new URL(location.href).searchParams.get('lang') || 'en';

new Vue({
  render: h => h(App),

  i18n: new VueI18n({
    messages: {
      en: {
        nav: {
          variables: 'Variables',
          resources: 'Resources',
          callstack: 'Call stack',
        }
      },
      ru: {
        nav: {
          variables: 'Переменные',
          resources: 'Ресурсы',
          callstack: 'Стек вызовов',
        }
      },
    },
    locale
  })
}).$mount('#app');