Vue.config.productionTip = false;

const app = new Vue({
  render: h => h(App),

  i18n: new VueI18n({
    locale: new URL(location.href).searchParams.get('lang') || 'en',
    messages: { ...locales },
    fallbackLocale: 'en'
  })
}).$mount('#app');