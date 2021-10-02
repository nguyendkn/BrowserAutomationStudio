Vue.config.productionTip = false;

const app = new Vue({
  render: h => h(App),

  i18n: new VueI18n({
    messages: { ...window.locales },
    locale: new URL(location.href).searchParams.get('lang') || 'en',
    fallbackLocale: 'en'
  })
});

app.$mount('#app');