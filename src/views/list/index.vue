<template>
  <div>
    <!-- 顶部栏 -->
    <!-- <van-nav-bar title="搜索结果页面"></van-nav-bar> -->
   <mySearch class="mySearch"  :isSecond="true" :isNewValue="isNewValue"></mySearch>
    <div id="top"></div>
    <!-- list -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell-group v-for="(item,index) in searchList" :key="index" >
        <van-cell>
          <template slot="title">
            <span>{{item.aut_name}}</span>
            <span class="time">{{item.pubdate | chineseFilter}}</span>
          </template>
        </van-cell>
        <van-cell>
          <template slot="title">
            <div class="content" @click="toDetails(item.art_id)">
                #<span style="color:#d9241d;">{{item.aut_name}}</span>#
              <span>{{item.title}}</span>
            </div>
          </template>
        </van-cell>
        <!-- 图片 -->
        <van-grid :border="false" :column-num="item.cover.type" v-if="item.cover.type > 0">
          <van-grid-item v-for="(imgItem,imgIndex) in item.cover.images" :key="imgIndex">
            <van-image  lazy-load :src="imgItem" />
          </van-grid-item>
        </van-grid>
        <!-- 宫格:转发,留言,点赞美 -->
        <van-grid :column-num="3">
          <van-grid-item>
            <van-icon name="exchange" @click="transpond" />
            <span>2</span>
          </van-grid-item>
          <van-grid-item>
            <van-icon name="chat-o" @click="leaveAMessage" />
            <span>20</span>
          </van-grid-item>
          <van-grid-item>
            <van-icon name="good-job-o" @click="like" />
            <span>45</span>
          </van-grid-item>
        </van-grid>
      </van-cell-group>
    </van-list>
    <!-- 最底部 -->
    <div class="bottom">
      <van-icon name="arrow-left" @click="isBack" />
      <div class="right">
        <a href="#top">
          <van-icon name="arrow-up" />
          <span>回到顶部</span>
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { search } from "../../api/articles";
import { Dialog } from "vant";
// import mySearch from './search' //搜索框组件
const mySearch = () => import('./search')
export default {
  //组件的姓名
  name:'list',
  //导入一个组件之后,这里也要添加:
  components: {
    mySearch
  },
  //显示到视图层的初始数据:
  data() {
    return {
      searchKey: this.$route.params.key, //搜索关键字
      page: 1, //初始页数
      searchList: [],
      loading: false,
      finished: false,
      isNewValue: ''
    };
  },
  //监听初始数据的变化,改变一次触发一次
  watch:{
    "$route"(to, from){
        this.searchKey = to.params.key   //新路由的,动态路由参数   
        this.isNewValue = to.params.key
        this.page = 1   //因为要刷新当前页面,将页码重置为初始状态
        this.onLoad()   //重新发送请求
    }
  },
  //注册事件:
  methods: {
    //点击返回
    isBack() {
      this.$router.back();
    },
    //转发
    transpond() {
      this.$login();
    },
    //留言
    leaveAMessage() {
      this.$login();
    },
    //点赞
    like() {
      this.$login();
    },
    //默认第一次进入页面会自动刷新一次, 之后就是触底刷新页面.
    async onLoad() {
      if (this.page == 1) {
        // console.log("第一次");
        let res = await search({
          page: this.page,
          per_page: 10,
          q: this.searchKey
        });
        this.searchList = res.results;
        this.page++; //2
      } else {
        // console.log("第二次");
        let res = await search({
          page: this.page, //2
          per_page: 10,
          q: this.searchKey
        });
        this.searchList = [...this.searchList, ...res.results];
        this.page++;
      }
      this.loading = false;
    },
    //跳转到详情页面
    toDetails(val){
       this.$login();
       this.$router.push(`/details/${val}`);
    },
    my(){
      console.log('11111111111111111111111111111');
    },
  },
  //页面一打开就调用:
  mounted() {
  
  },
  //创建阶段
  created(){
       console.log("列表创建");
  },
  //销毁阶段
  destroyed(){
       console.log("列表销毁");
  }

};
</script>
    
<style lang='less' scoped>
//顶部tabBar
// .van-nav-bar {
//   position: fixed;
//   top: 0;
//   height: 58px;
//   line-height: 58px;
//   width: 100%;
//   background-color: #3296fa;
//   z-index: 20 !important;
//   .van-nav-bar__title {
//     color: #ffffff;
//   }
//   /deep/.van-icon-arrow-left::before {
//     color: #ffffff;
//     font-size: 24px;
//   }
// }
.mySearch{
  position: fixed;
  top: 0;
    width: 100%;
      z-index: 20 !important;
}
#top {
  margin-top: 58px;
}
.van-cell__title {
  .time {
    left: 130px;
    position: absolute;
    color: #716f72;
  }
}

.van-cell-group {
  margin-bottom: 4px;
  /deep/.van-icon {
    font-size: 20px;
  }
  /deep/.van-grid-item__content {
    flex-direction: row;
    padding: 10px 8px;
    span {
      margin: 0 8px;
      font-size: 12px;
    }
  }
}
//最底部
.bottom {
  width: 100%;
  height: 44px;
  position: fixed;
  bottom: 0;
  background-color: #3296fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 20;
  padding: 0 20px;
  box-sizing: border-box;
  color: #b4d3f9;
  .van-icon {
    font-size: 20px;
  }
  .right {
    a {
      font-size: 14px;
      color: #b4d3f9;
      .van-icon {
        margin: 0 4px;
      }
    }
  }
}
</style>