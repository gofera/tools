import ElementUI from 'element-ui';
import Vue from 'vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import 'element-ui/lib/theme-chalk/index.css';
import 'swiper/dist/css/swiper.css';
import locale from 'element-ui/lib/locale/lang/en';
import './element-variables.scss';
import './styles/index.scss';

Vue.use(VueAwesomeSwiper);
Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.use(ElementUI, {locale});
Vue.config.productionTip = false;

axios.interceptors.request.use((config) => {
  return config;
});
axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  return Promise.reject(error);
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
