<template>
  <div>
    <!-- 作者信息 -->
    <van-cell-group class="author">
      <!-- 左 -->
      <div>
        <van-cell>
          <img
            :src="articleDetail.aut_photo"
            alt
          />
        </van-cell>
      </div>
      <!-- 中 -->
      <div class="middle">
        <van-cell>
          <template slot="title">
            <span style="color:#3296fa;">{{articleDetail.aut_name}}</span>
          </template>
          <template slot="label">
            <span>{{articleDetail.pubdate | newFilter}}</span>
          </template>
        </van-cell>
      </div>
      <!-- 右 -->
      <div>
        <van-cell>
          <van-button type="default" color="#d94029" size="mini" v-if="articleDetail.is_followed == true" @click="isDeleteFocusUser">不关注</van-button>
          <van-button type="info" size="mini" v-else-if="articleDetail.is_followed == false" @click="isFocusUser">关注</van-button>
        </van-cell>
      </div>
    </van-cell-group>
 
  </div>
</template>
<script>
import {focusUser, deleteFocusUser} from '@/api/user'
export default {
  name:"author",
  props:['articleDetail'],
  //导入一个组件之后,这里也要添加:
  components: {},
  //显示到视图层的初始数据:
  data() {
    return {};
  },
  //注册事件:
  methods: {
    //点击关注作者
   async isFocusUser(){
     //这里不需要返回值,因为只是发到服务器做标记
      await focusUser(this.articleDetail.aut_id)
      //因为数据库那边改变了,可是视图层不会自动响应,所以要手动修改
      this.articleDetail.is_followed = true
      this.$toast.success('关注成功');
    },
    //点击取消关注作者
   async isDeleteFocusUser(){
      await deleteFocusUser(this.articleDetail.aut_id)
      this.articleDetail.is_followed = false
      this.$toast.fail('取消关注');
    },
   


  },
  //页面一打开就调用:
  mounted() {}
};
</script>
    
<style lang='less' scoped>
//作者信息
.author {
  display: flex;
  align-items: center;
  .middle {
    flex: 1;
  }
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .van-button {
    border-radius: 10px;
  }
}
</style>