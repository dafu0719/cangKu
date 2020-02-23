<template>
  <div>
    <!-- 输入框 -->
    <van-cell-group>
      <van-field v-model="value" placeholder="有爱评论,说点儿好听的~" left-icon="edit" @keydown.enter="send">
        <van-button slot="button" size="small" type="info" @click="send">发送</van-button>
      </van-field>
    </van-cell-group>
  </div>
</template>
    
<script>
import { addComments } from "../../../api/comments.js";
export default {
  name:'input',
  props: ["art_id", "isFirst", "com_id"],
  //导入一个组件之后,这里也要添加:
  components: {},
  //显示到视图层的初始数据:
  data() {
    return {
      value: "" //输入的值
    };
  },
  //注册事件:
  methods: {
    async send() {
      //条件判断是不是第一层
      if (this.isFirst == true) {
        if (this.value == "") {
          this.$toast.fail("内容不能为空");
          return;
        } else {
          let res = await addComments({
            target: this.art_id,
            content: this.value
          });
          //将输入框清空
          this.value = "";
          //将得到的新对象传到父组件
          this.$emit("obj", res.new_obj);
        }
      } else {
        console.log("第二层");
        if (this.value == "") {
          this.$toast.fail("内容不能为空");
          return;
        } else {
          let res = await addComments({
            target: this.com_id,
            content: this.value,
            art_id: this.art_id
          });
          //将输入框清空
          this.value = "";
          //将得到的新对象传到父组件
          this.$emit("secondObj", res.new_obj);
        }
      }
    }
  },
  //页面一打开就调用:
  mounted() {}
};
</script>
    
<style lang='less' scoped>
.van-button {
  border-radius: 10px;
}
</style>