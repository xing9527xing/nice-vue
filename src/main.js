import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入svgIcon
Vue.config.productionTip = false
import './styles/theme.scss'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import store from './store/index.js'
Vue.use(VXETable)
// 全局注册组件（也可以使用局部注册）
Vue.use(ElementUI)
new Vue({
  render: h => h(App),
  store
}).$mount('#app')