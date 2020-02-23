<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="首页">
      <van-icon name="arrow-left" slot="left" @click="$router.back()" />
    </van-nav-bar>
    <!-- 标题 -->
    <van-cell-group class="diyi">
      <van-cell>
        <template slot="title">
          <span>{{articleDetail.title}}</span>
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 作者 -->
    <van-skeleton
  title
  avatar
  :row="3"
  :loading="loading"
>
      <author :articleDetail="articleDetail"/>
      </van-skeleton>
      
    <!-- 内容 -->
    <van-cell-group>
      <van-cell>
        <template slot="title">
          <span>{{articleDetail.content}}</span>
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 点赞,不喜欢 -->
    <div class="btn">
      <van-button icon="star-o" type="info" size="small">点赞</van-button>
      <van-button icon="like-o" color="#d94029" type="default" size="small">不喜欢</van-button>
    </div>
    <!-- 文章评价 -->
    <div class="evaluate">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <evaluate v-for="(item,index) in commentsList" :key="index" :commentsListItem="item" />
      </van-list>
    </div>
    <!-- 输入框 -->
    <myInput :isFirst="true" class="myInput" :art_id="art_id" @obj="obj"></myInput>
    <!-- 弹出层:评论回复 -->
    <van-popup v-model="show" position="bottom" :style="{ height: '60%' }">
      <evaluate :commentsListItem="currentEvaluate"></evaluate>
      <span>当前评论的回复</span>
      <evaluate v-for="(item,index) in replyList" :key="index" :commentsListItem="item"></evaluate>
      <!-- 第二层输入框 -->
      <myInput
        :isFirst="false"
        class="myInput"
        :art_id="art_id"
        :com_id="com_id"
        @secondObj="secondObj"
      ></myInput>
    </van-popup>
  </div>
</template>
    
<script>
const evaluate = () => import("./components/evaluate");
const myInput = () => import("./components/input");
const author = () => import("./components/author");
import { articleDetail } from "../../api/articles";
import { getComments } from "../../api/comments.js";
import eventBus from "@/untils/eventBus.js";
export default {
  name:'detail',
  //导入一个组件之后,这里也要添加:
  components: {
    evaluate,
    myInput,
    author
  },
  //显示到视图层的初始数据:
  data() {
    return {
      art_id: this.$route.params.key, //文章id
      articleDetail: [], //文章详情
      commentsList: [], //文章评价
      lastId: 0, //上一页的id
      endId: 0, //最后一页的id
      offset: 0, //页,初始页设置为0
      loading: false,
      finished: false,
      show: false,
      currentEvaluate: [], //显示到弹出框的当前文章
      replyList: [], //回复数据
      com_id: 0 //评论id
    };
  },
  //注册事件:
  methods: {
    async getArticleDetail() {
      let res = await articleDetail(this.art_id);
      this.articleDetail = res;
    },
    // 上拉刷新
    async onLoad() {
      //如果等于初始页,说明是第一次自动触发
      if (this.offset == 0) {
        let res = await getComments({
          type: "a",
          source: this.art_id,
          limit: 10
        });
        //如果得到的评论数据的数组长度为0,说明没有评论条数,直接结束
        this.commentsList = res.results;
        if (this.commentsList.length == 0) {
          this.loading = false;
          this.finished = true;
          return;
        }
        this.lastId = res.last_id;
        this.offset = this.lastId;
        this.endId = res.end_id;
        this.loading = false;
      } else {
        let res = await getComments({
          type: "a",
          source: this.art_id,
          offset: this.offset,
          limit: 10
        });
        this.commentsList = [...this.commentsList, ...res.results];
        this.lastId = res.last_id;
        this.offset = this.lastId;
        this.endId = res.end_id;
        this.loading = false;
        //如果最后一页等于最后一页的id,说明没有了
        if (this.lastId == this.endId) {
          this.finished = true;
          this.loading = false;
          return;
        }
      }
    },
    //点击添加到评论列表
    obj(val) {
      this.commentsList.unshift(val);
    },
    //点击添加评论的回复
    secondObj(val) {
      this.replyList.unshift(val);
    }
  },
  //页面一打开就调用:
  mounted() {
    this.getArticleDetail();
    eventBus.$on("toReply", val => {
      this.currentEvaluate = val;
      this.show = val.toReply;
      this.com_id = val.com_id;
      console.log(val);
    });
  }
};
</script>
    
<style lang='less' scoped>
// 顶部tabBar
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
  /deep/.van-icon-arrow-left {
    color: #ffffff;
    font-size: 24px;
  }
}
.diyi {
  margin-top: 58px;
  .van-cell__title {
    font-weight: bold;
    font-size: 20px;
  }
}

//点赞,不喜欢
.btn {
  height: 90px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-around;
  .van-button {
    border-radius: 10px;
  }
}
.evaluate {
  margin-bottom: 50px;
}
//输入框
.myInput {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>