<template>
  <div>
    <van-popup
      :value="value"
      @input="$emit('input', $event)"
      position="top"
      :style="{ height: '80%' }"
    >
      <!-- 我的频道 -->
      <div>
        <div class="title">
          <div>
            <p>我的频道</p>
          </div>
          <van-button plain type="info" round size="small" @click="edit" v-if="showDelete">编辑</van-button>
          <van-button plain type="info" round size="small" @click=" clearEdit" v-else>完成</van-button>
        </div>
        <!-- 列表 -->
        <div class="list">
          <li
            :class="{active: active == index}"
            v-for="(item,index) in channelsList"
            :key="index"
            @click="showDelete? changeActive(index) : ''"
          >
            {{item.name}}
            <img
              src="../../../../assets/chacha.png"
              v-show="showDelete == false"
              @click="index>0? toDelete(index) : ''"
              alt
            />
          </li>
        </div>
      </div>

      <!-- 频道推荐 -->
      <div class="bottom">
        <div class="title">
          <div>
            <p>频道推荐</p>
          </div>
        </div>
        <!-- 列表 -->
        <div class="list">
          <li
            v-for="(item,index) in recommedChanel"
            :key="index"
            :class="{activeB: activeB == index}"
            @click="showDelete? thisChangeActive(index, item) : ''"
          >{{item.name}}</li>
        </div>
      </div>
    </van-popup>
  </div>
</template>
    
<script>
//所有频道数据
import { getAllChannelRequest, resetChannels } from "@/api/channel";
import eventBus from "@/untils/eventBus.js";
export default {
  //channelsList是用户频道
  props: ["value", "channelsList"],
  //导入一个组件之后,这里也要添加:
  components: {},
  //显示到视图层的初始数据:
  data() {
    return {
      showDelete: true, //显示编辑文字
      allChannel: [], //所有频道数据
      active: 0, //我的频道被选中
      activeB: -1 //推荐频道被选中
    };
  },
  //计算属性,用于筛选
  computed: {
    recommedChanel() {
      // 遍历数组,取出值
      let nId = this.channelsList.map((item, index) => {
        return item.id;
      });
      //遍历数组, 过滤出满足条件的元素
      let otherChannel = this.allChannel.filter((item, index) => {
        //返回true就是符合条件的-输出
        return !nId.includes(item.id);
      });
      return otherChannel;
    }
  },
  //注册事件:
  methods: {
    edit() {
      this.showDelete = false;
    },
    clearEdit() {
      this.showDelete = true;
    },
    //获取所有频道数据
    async getAllChannel() {
      let res = await getAllChannelRequest();
      this.allChannel = res.channels;
    },
    //我的频道:切换选中的频道
    changeActive(index) {
      this.active = index;
      this.$emit("newactive", this.active);
    },
    //推荐频道选中:
    async thisChangeActive(index, item) {
      this.activeB = index;
      setTimeout(() => {
        this.activeB = -1;
      }, 100);
      //新增的对象里边是没有之前新增的属性的, 所以识别不到会报错
      this.$set(item, "article", []);
      this.$set(item, "upLoading", false);
      this.$set(item, "downLoading", false);
      this.$set(item, "finished", false);
      this.$set(item, "pre_timestamp", 0);
      //  this.channelsList.unshift(item) 这个不能用会报错
      this.channelsList.push(item);
      //判断有没登录, 登录了就存储到本地全局缓存
      let user = this.$store.state.getUser;
      if (!user) {
        console.log("没登录");
        //没有登录,将我的频道存储到本地全局缓存, 意义是即时更新我的频道的数据
        window.localStorage.setItem(
          "channel",
          JSON.stringify(this.channelsList)
        );
      } else {
         console.log("登录了");
        // 遍历我的频道数据,先设置成从下标1开始,调整成自己想要的数据. 数组里边只有一个id和顺序序号
        let newArr = this.channelsList.slice(1).map((item, index) => {  
          return {
             id:item.id,
             seq: index+2   //顺序序号是从1开始的
          };
        });
        //向服务器发送请求,重置我的频道数据
         let res = await resetChannels({
            channels:newArr
          })
      }
    },
    //我的频道删除
    async toDelete(index) {
      //根据指定下标删除用index
      this.channelsList.splice(index, 1);
      //判断有没登录
      let user = this.$store.state.getUser;
      if (!user) {
         console.log("没登录");
         //没有登录,将此时我的频道数据本地化
          window.localStorage.setItem("channel", JSON.stringify(this.channelsList));
      } else {
         console.log("登录了");
          // 遍历我的频道数据,先设置成从下标1开始,调整成自己想要的数据. 数组里边只有一个id和顺序序号
          let newArr = this.channelsList.slice(1).map((item, index) => {  
            return {
               id:item.id,
               seq: index+2   //顺序序号是从1开始的
            };
          });
         //向服务器发送请求,重置我的频道数据
          let res = await resetChannels({
            channels:newArr
          })
      }
    }
  },
  //页面一打开就调用:
  mounted() {
    eventBus.$on("myactive", val => {
      this.active = val;
    });
    this.getAllChannel();
  }
};
</script>
    
<style lang='less' scoped>
.van-popup {
  /deep/.van-icon {
    right: 37px;
  }
}
.title {
  display: flex;
  justify-content: space-between;
  margin: 0 14px;
  align-items: center;
}
.list {
  display: flex;
  flex-wrap: wrap;
  li {
    width: 15.7%;
    height: 40px;
    background-color: #ebebeb;
    text-align: center;
    line-height: 40px;
    margin: 8px 8px;
    font-size: 10px;
    border-radius: 10px;
    list-style: none;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    img {
      position: absolute;
      right: 2px;
      top: 2px;
      width: 14px;
      height: 14px;
    }
  }
  //被选中
  .active {
    color: #2b92fa;
    background-color: #b8b8b8;
  }
  .activeB {
    color: #2b92fa;
    background-color: #b8b8b8;
  }
}
.bottom {
  margin-top: 30px;
}
</style>