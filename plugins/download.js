import Vue from 'vue'
import JsonExcel from 'vue-json-excel'

const VueExcel = {
  install(Vue, options) {
    Vue.component('downloadExcel', JsonExcel)
  }
};
Vue.use(VueExcel);
export default VueExcel;