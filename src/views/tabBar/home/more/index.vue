<template>
  <div>
    <van-popup round :value="value" @input="$emit('input', $event)" :show-confirm-button="false">
      <van-cell-group v-if="!isReport">
        <van-cell title="不喜欢" @click="isDelete" />
        <van-cell title="举报" is-link @click="report" />
        <van-cell title="拉黑" />
      </van-cell-group>
      <van-cell-group v-if="isReport">
        <van-cell>
          <template slot="icon">
            <img src="@/assets/左箭头.png" alt @click="toBack" class="img" />
          </template>
        </van-cell>
        <van-cell :title="item.title" v-for="(item,index) in reportList" :key="index" />
      </van-cell-group>
    </van-popup>
  </div>
</template>
    
<script>
import { deleteArticles } from "@/api/articles";
export default {
  props: ["value", "deleteArtId"],
  //导入一个组件之后,这里也要添加:
  components: {},
  //显示到视图层的初始数据:
  data() {
    return {
      reportList: [
        { title: "其他问题" },
        { title: "标题夸张" },
        { title: "低俗色情" },
        { title: "错别字多" },
        { title: "旧闻重复" },
        { title: "广告软文" },
        { title: "内容不实" },
        { title: "涉嫌违法犯罪" },
        { title: "侵权" }
      ],
      isReport: false
    };
  },
  //注册事件:
  methods: {
    report() {
      this.isReport = true;
    },
    toBack() {
      this.isReport = false;
    },
    //点击不喜欢
    async isDelete() {
      this.$emit("beDeleteArtId", this.deleteArtId);
      //隐藏面板
      this.$emit("input", false);
      try {
        //向服务器发送请求
        await deleteArticles(this.deleteArtId);
        // this.moreShow = false;
        this.timeID = setTimeout(() => {
          this.$toast.success("删除成功");
        }, 500);
      } catch (error) {
        this.timeID = setTimeout(() => {
          this.$toast.fail('删除失败');
        }, 500);
      }
    }
  },
  //页面一打开就调用:
  mounted() {}
};
</script>
    
<style lang='less' scoped>
.van-popup {
  width: 250px;
}
.img {
  width: 8px;
  height: 14px;
}
</style>