//导入组件
import searchConponent from '../views/list/search/index.vue'
//创建一个secondPlugs对象
let secondPlugs = {}
//给secondPlugs对象添加install属性
secondPlugs.install = function (Vue) {
    //全局js调用的组件
   Vue.prototype.$isMyComponent=function() {
      console.log(searchConponent);
      //一使用this.$isMyComponent()就执行下边的代码
      //使用构造器,以这个组件为模板创建出一个组件的函数
      let secondPlugs = Vue.extend(searchConponent)   
      //将这个组件函数实例化成一个组件对象,log看得到,里边没有el选项
      let NewSecondPlugs = new secondPlugs()
      //因为它没有el选项,其实它还是处于未挂载的,所以要用vm.$mount()手动挂载起来
      let isNewSecondPlugs = NewSecondPlugs.$mount()
      console.log(isNewSecondPlugs);
      //这时候有el选项了,el选项里边是虚拟Dom,将虚拟Dom添加到文档中
      document.body.appendChild(isNewSecondPlugs.$el);
   }
}


export default secondPlugs