<template>
  <div class="wenDa">
    <!-- <van-nav-bar title="问答" /> -->
    <div class="outDiv"></div>
  </div>
</template>
    
<script>
export default {
  //导入一个组件之后,这里也要添加:
  components: {},
  //显示到视图层的初始数据:
  data() {
    return {
        
    };
  },
  //注册事件:
  methods: {},
  //页面一打开就调用:
  mounted() {}
};
</script>
    
<style lang='less' scoped>
.outDiv{
  height: 20%;
  background-color: red;
}

//顶部tabBar
.van-nav-bar {
  position: fixed;
  top: 0;
  height: 58px;
  line-height: 58px;
  width: 100%;
  background-color: #3296fa;
  z-index: 20 !important;
  .van-nav-bar__title {
    color: #ffffff;
  }
}
</style>