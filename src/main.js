import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import ECharts from 'vue-echarts'
import 'echarts'
Vue.config.productionTip = false

// 全局注册组件（也可以使用局部注册）
Vue.component('v-chart', ECharts)
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
