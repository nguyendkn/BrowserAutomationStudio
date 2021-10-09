Vue.config.productionTip = false;

Vue.use(CollapseTransition);

const app = new Vue({
  i18n: new VueI18n({
    locale: new URL(window.location.href).searchParams.get('lang') || 'en',
    messages: { ...locales },
    fallbackLocale: 'en'
  }),

  render: h => h(App)
}).$mount('#app');