<template>
  <div>
     <input type="file" @change="thisFile">
     <img :src="myImg" alt="" class="isMyImg">
  
     
  </div>
</template>
    
<script>
export default {
  //导入一个组件之后,这里也要添加:
  components: {},
  //显示到视图层的初始数据:
  data() {
    return {
         myImg:''
    };
  },
  //注册事件:
  methods: {
    thisFile(e){
      //得到选中的图片
      let imgFile = e.target.files[0] 
      //得到一个临时路径blob
      let url = URL.createObjectURL(imgFile);
      //赋值给src
      this.myImg = url


      // //创建一个reader
      // let reader = new FileReader()
      // //将图片对象转成base64格式
      // reader.readAsDataURL(imgFile)
      // //读取成功后的回调
      // reader.onloadend = res => {
      //    //将得到的base64格式的临时路径赋值给src
      //    this.myImg = res.target.result
      // }

    
      
    }
  },
  //页面一打开就调用:
  mounted() {}
};
</script>
    
<style lang='less' scoped>
.isMyImg{
  width: 200px;
  height: 200px;
}

</style>