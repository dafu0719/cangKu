import { Dialog } from 'vant';

//封装Vue的插件
let myPlugs = {}
myPlugs.install = function (Vue) {
    //给Vue添加全局方法
    Vue.prototype.$login = function () {
        let user =  JSON.parse(window.localStorage.getItem("userKey"))
        if (!user) {
          Dialog.confirm({
            message: "请登录"
          })
            .then(() => {
              this.$router.push("/login");
            })
            .catch(() => {
              return;
            });
        }
    }
}

export default myPlugs