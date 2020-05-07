import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './styles/index.css'
Vue.use(ElementUI);
Vue.config.productionTip = false //是否显示生产模式的消息

 

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
