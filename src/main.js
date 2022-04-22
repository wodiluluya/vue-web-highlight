import Vue from "vue";
import App from "./App.vue";
import './assets/index.less'
import globalVariable from './components/HighLight/global'
Vue.prototype.$globalVariable = globalVariable;

new Vue({
  // store,
  el: "#app",
  render: (h) => h(App),
});
