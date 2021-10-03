Vue.config.productionTip = false;

const app = new Vue({
  render: h => h(App),

  i18n: new VueI18n({
    messages: { ...locales },
    locale: new URL(location.href).searchParams.get('lang') || 'en',
    silentTranslationWarn: true,
    fallbackLocale: 'en'
  })
}).$mount('#app');