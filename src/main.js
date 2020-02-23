import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import { Lazyload } from 'vant'; //懒加载
import dayjs from 'dayjs'   //时间插件
import 'dayjs/locale/zh-cn'      //导入日期插件简体中文语言包
import relativeTime from 'dayjs/plugin/relativeTime'   //导入日期相对时间插件
import myPlugs from './untils/myPlugs'  //个人制作的插件
import calendar from 'dayjs/plugin/calendar'
import VueLazyComponent from '@xunlei/vue-lazy-component'

import secondPlugs from './untils/secondPlugs'  //导入全局js调用的组件

import 'lib-flexible'

// const originalPush = router.prototype.push
// router.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }

//vee-validate验证插件
//导入方言
import zh_CN from 'vee-validate/dist/locale/zh_CN';
import VeeValidate, { Validator } from 'vee-validate';
//使用验证插件
Vue.use(VeeValidate);
//使用验证插件方言
Validator.localize('zh_CN', zh_CN);
//禁止验证插件提示
// Vue.use(VeeValidate, {
//   events: ''
// });

// vant组件
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);
Vue.use(Lazyload);    //图片懒加载
Vue.use(myPlugs);    //使用自己封装的插件
Vue.use(secondPlugs);    //使用js调用的全局组件
dayjs.locale('zh-cn')   //全局使用日期插件简体中文语言包
dayjs.extend(relativeTime)    //注册日期相对时间插件
dayjs.extend(calendar)

Vue.use(VueLazyComponent)

Vue.config.productionTip = false

//封装一个相对时间全局过滤器
Vue.filter('dateFilter', function (val) {
  return dayjs().from(dayjs(val))          //间隔时间,例如5个月前
})

Vue.filter('chineseFilter', function (val) {
    return dayjs(val).format('YYYY年MM月DD日')  //2019年9月9日
})

Vue.filter('newFilter', function (val) {
    return dayjs(val).format('MM-DD hh:mm')  //9-9 03:18
})

   
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
