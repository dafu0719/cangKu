<template>
  <div>
    <!-- 文章评价列表 -->
    <van-cell-group class="author">
      <!-- 左 -->
      <div>
        <van-cell>
          <img :src="commentsListItem.aut_photo" alt />
        </van-cell>
      </div>
      <!-- 中 -->
      <div class="middle">
        <span class="name">{{commentsListItem.aut_name}}</span>
        <div class="content">
          <span>{{commentsListItem.content}}</span>
        </div>
        <span class="time">{{commentsListItem.pubdate | newFilter}}</span>
        <span class="reply" @click="reply">回复({{commentsListItem.reply_count}})</span>
      </div>
      <!-- 右 -->
      <div class="right">
        <van-icon name="good-job-o" />
        <span>{{commentsListItem.like_count}}</span>
      </div>
    </van-cell-group>
  </div>
</template>
    
<script>
import eventBus from "@/untils/eventBus.js";
import { getComments} from "@/api/comments";
export default {
  name:"evaluate",
  props: ["commentsListItem"],
  //导入一个组件之后,这里也要添加:
  components: {},
  //显示到视图层的初始数据:
  data() {
    return {
      //  isFirst = ''  //是第一层
    };
  },
  //注册事件:
  methods: {
    // 点击回复
    async reply() {
      let com_id = this.commentsListItem.com_id;
      let res = await getComments({
        type: "c",
        source: com_id,
        limit:10
      });
      console.log(res);
      let replyList = res.results
      console.log(com_id);
      //将参数传到父组件
      eventBus.$emit("toReply", {
        ...this.commentsListItem,
        toReply: true,
        replyList:replyList
      });
    }
  },
  //页面一打开就调用:
  mounted() {}
};
</script>
    
<style lang='less' scoped>
//文章评价列表
.author {
  display: flex;
  height: 80px;
  .middle {
    flex: 1;
    .name {
      color: #3296fa;
      font-size: 14px;
    }
    .content {
      margin-bottom: 10px;
    }
    .time {
      font-size: 10px;
    }
    .reply {
      font-size: 12px;
      margin-left: 8px;
    }
  }
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .van-button {
    border-radius: 10px;
  }
  .right {
    margin: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .van-icon {
      font-size: 20px;
      display: inline-block;
      color: #b4b4b4;
    }
    span {
      font-size: 12px;
      color: #b4b4b4;
    }
  }
}
</style>