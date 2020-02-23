<template>
  <div>
    <!-- <van-nav-bar title="视频" /> -->
    <!-- <p>{{isMe}}</p>
    <p>{{isShe}}</p> -->
    <button @click="isClick">按钮</button>
    
    <input type="text" @keydown.enter="isKeydown">


    <!-- <button type="submit" @click="isKeydown" @keydown.enter="isKeydown">你好 </button> -->
  </div>
</template>
    
<script>
import io from 'socket.io-client';
export default {
  //导入一个组件之后,这里也要添加:
  components: {},
  //显示到视图层的初始数据:
  data() {
    return {
        isMe:'在吗',
        isShe:''
    };
  },
  //注册事件:
  methods: {
    isKeydown(){
        console.log('123');
    },
    //按钮点击事件
    isClick(){
        // this.isMyComponent()
        console.log('1111');
        this.$isMyComponent()
       
    }
  },
  //页面一打开就调用:
  mounted() {
    let token =JSON.parse(window.localStorage.getItem("userKey")).token
    //创建连接
    //(双引号里边写接口路径,大括号里边写请求参数token)
    const socket = io('http://ttapi.research.itcast.cn', {token:token})
    //开始连接
    socket.on('connect', function(){
      console.log("连接成功123");
    });
    //发送请求,发送消息
    //(双引号里边写接收消息的事件(event),大括号里边写请求参数)
    socket.emit('message',{
      msg: this.isMe,
      timestamp: Date.now()
    })
    //接收响应数据,接收消息
    socket.on('message', res => {
       this.isShe = res.msg
    })
  }
};
</script>
    
<style lang='less' scoped>
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