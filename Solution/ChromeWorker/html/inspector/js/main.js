Vue.config.productionTip = false;

new Vue({
  render: h => h(App),

  i18n: new VueI18n({
    messages: {
      en: {
        nav: {
          variables: 'Variables',
          resources: 'Resources',
          callstack: 'Call stack',
        },
        filters: {
          functions: 'Functions',
          actions: 'Actions',
        }
      },
      ru: {
        nav: {
          variables: 'Переменные',
          resources: 'Ресурсы',
          callstack: 'Стек вызовов',
        },
        filters: {
          functions: 'Функции',
          actions: 'Действия',
        }
      },
    },

    locale: new URL(location.href).searchParams.get('lang') || 'en'
  })
}).$mount('#app');