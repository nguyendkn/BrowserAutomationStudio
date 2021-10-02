Vue.config.productionTip = false;

new Vue({
  render: h => h(App),

  i18n: new VueI18n({
    messages: {
      en: window.locales.en,
      ru: window.locales.ru,
    },
    locale: new URL(location.href).searchParams.get('lang') || 'en',
    fallbackLocale: 'en'
  })
}).$mount('#app');