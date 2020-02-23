<template>
  <div>
    <van-nav-bar title="登录" />
    <van-cell-group class="van">
      <div class="first">
        <van-field
          v-validate="'required|max:11|min:11'"
          v-model="mobile"
          left-icon="smile-o"
          name="mobile"
          placeholder="请输入手机号"
          class="firstBtn"
          :error-message="errors.first('mobile')"
          clearable
        />
      </div>
      <div class="second">
        <van-field
          v-validate="'required|max:6|min:6'"
          v-model="code"
          left-icon="smile-o"
          name="code"
          placeholder="请输入验证码"
          :error-message="errors.first('code')"
        />
        <div class="right">
          <div class="rightBorder">
            <van-button type="info" size="small">获取验证码</van-button>
          </div>
        </div>
      </div>
    </van-cell-group>
    <div class="btn">
      <van-button
        type="info"
        @click="onSubmit"
        size="large"
        :loading="isLoading"
        loading-text="登录中..."
      >登录</van-button>
    </div>
  </div>
</template>
    
<script>
import { userRegister } from "@/api/user";
import { setUserKey } from "@/untils/user";
export default {
  //导入一个组件之后,这里也要添加:
  components: {},
  //显示到视图层的初始数据:
  data() {
    return {
      mobile: "18888888888", // 电话号码:必须是 18888888888
      code: "246810", // 验证码:必须是 246810
      isLoading: false
    };
  },
  //注册事件:
  methods: {
    //自定义规则提示
    myRules() {
      const dict = {
        custom: {
          // input的name
          mobile: {
            // 'required|max:11|min:11'
            required: "电话号码不能为空",
            max: "电话号码不能超过11位",
            min: "电话号码不能少于11位"
          },
          code: {
            //'required|max:6|min:6'
            required: "验证码不能为空",
            max: "验证码不能超过6位",
            min: "验证码不能少于6位"
          }
        }
      };
      //使用规则提示
      this.$validator.localize("zh_CN", dict);
    },
    //点击登录
    async onSubmit() {
      this.isLoading = true;
      let valid = await this.$validator.validate();
      if (valid) {
        //验证成功向服务器发送请求,然后跳转
        let res = await userRegister({
          mobile: this.mobile,
          code: this.code
        });
        //存储到本地全局缓存
        // this.$store.commit("setUser", res); 
        window.localStorage.setItem('userKey', JSON.stringify(res))
        //路由跳转
        this.$router.back()
      }
      this.isLoading = false;
    }
  },
  //页面一打开就调用:
  mounted() {
    this.myRules();
  }
};
</script>
    
<style lang='less' scoped>
//顶部tabBar
.van-nav-bar {
  background-color: #3296fa;
  .van-nav-bar__title {
    color: #ffffff;
  }
}
//输入框, 这里要用深度选择, 不然作用不到
/deep/.van-field__left-icon {
  margin-right: 20px;
}
.van {
  width: 100%;
  background-color: red;
  .first {
    background-color: #ffffff;
    padding: 0 15px;
    .firstBtn {
      border-bottom: 1px solid #eeeeee;
    }
  }
  .second {
    background-color: #ffffff;
    padding: 0 15px;
    display: flex;
    .van-cell {
      width: 70%;
    }
    .right {
      height: 44px;
      width: 30%;
      display: flex;
      justify-content: center;
      align-items: center;
      .rightBorder {
        height: 60%;
        width: 100%;
        border-left: 1px solid #eeeeee;
        padding: 0 14px;
        .van-button {
          height: 100%;
          width: 100%;
          background-color: #ededed;
          color: #666666;
          border: 0;
          border-radius: 100px;
        }
      }
    }
  }
}
// 按钮
.btn {
  margin-top: 50px;
  padding: 0 34px;
  .van-button {
    width: 100%;
    border-radius: 10px;
  }
}
</style>