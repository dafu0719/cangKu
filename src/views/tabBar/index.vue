<template>
  <div>
    <transition name="fade">
    <div v-if="isBegin === true">
      <!-- 开场大海报 -->
      <begin></begin>
    </div>
     </transition>
    <div v-if="isBegin !== true">
      <!--注意: 这里不要漏了这个,路由出口用来渲染子路由 -->

       <keep-alive >
        <router-view />
      </keep-alive>
  
      <!-- 底部tabBar -->
      <van-tabbar v-model="active" route>
        <van-tabbar-item icon="home-o" replace to="/home">首页</van-tabbar-item>
        <van-tabbar-item icon="friends-o" replace to="/wenDa">问答</van-tabbar-item>
        <van-tabbar-item icon="video-o" replace to="/video">视频</van-tabbar-item>
        <van-tabbar-item icon="manager-o" replace to="/my">我的</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>
    
<script>
// import begin from "@/views/begin";
const begin = () => import("@/views/begin");
export default {
  //导入一个组件之后,这里也要添加:
  components: { begin },
  //显示到视图层的初始数据:
  data() {
    return {
      active: 0,
      isBegin: false,
      timeID: null
    };
  },
  //注册事件:
  methods: {},
  created() {
    if (this.timeID) {
      clearTimeout(this.timeID);
    }
    //页面一打开显示海报的封面,一秒之后销毁
    this.isBegin = true;
    this.timeID = setTimeout(() => {
      this.isBegin = false;
    }, 1000);
  },
  //页面一打开就调用:
  mounted() {}
};
</script>
    
<style lang='less' scoped>
//淡入淡出动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.van-tabbar {
  height: 58px;
  /deep/.van-icon {
    font-size: 24px;
  }
}
</style>