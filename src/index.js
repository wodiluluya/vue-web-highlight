import ToolBar from "./components/HighLight/ToolBar/index.vue";
import setSelectRange from "./components/HighLight/setSelectRange";
import HighLight from "./components/HighLight/Note/index.vue";
import globalVariable from './components/HighLight/global'


const components = [HighLight, ToolBar];

const install = function (Vue) {
  components.map((component) => {
    Vue.component(component.name, component);
  });
 
};


//引用文件方式时，会使用，类似jquery方式引入
if (typeof window !== 'undefined' && window.Vue) {
/*   window.Vue.prototype.$setSelectRange = setSelectRange;
  window.Vue.prototype.$globalVariable = globalVariable; */
  install(window.Vue);
}
export {
  install,
  HighLight,
  ToolBar,
  setSelectRange,
  globalVariable
}
export default {
  install
}




