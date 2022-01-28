import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import HighchartsVue from "highcharts-vue";
import Highcharts from "highcharts";
import darkUnica from "highcharts/themes/dark-unica.src";

darkUnica(Highcharts);
Vue.use(HighchartsVue);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
