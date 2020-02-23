<template>
  <div>
    <!-- 顶部tabBar -->
    <!-- <van-nav-bar title="首页" /> -->
    <div class="navBar">
      <div class="center" @click="toSearch">
        <span>搜索</span>
      </div>
    </div>
    <van-tabs
      @click="onClick"
      v-model="active"
      title-inactive-color="#777777"
      title-active-color="#333333"
    >
      <van-tab :title="item.name" v-for="(item,index) in channelsList" :key="index">
        <!-- list: tab栏里边的内容 -->
        {{item.upLoading}}
        <van-pull-refresh v-model="item.downLoading" @refresh="onRefresh">
          <van-list
            v-model="item.upLoading"
            :finished="item.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell v-for="(itemB,indexB) in item.article" :key="indexB">
              <van-cell-group @touchstart="start(itemB.art_id)" @touchend="end(indexB)">
                <van-cell @click="siScroll">
                  <!--因为标题部分要加上图片,所以要用插槽 -->
                  <template slot="title">
                    {{itemB.title}}
                    <!--不是每一篇文章都有图片的,加个条件判断, 不然会报错 -->
                    <van-grid :border="false" :column-num="3" v-if="itemB.cover.type > 0">
                      <van-grid-item
                        v-for="(imageItem,imageIndex) in itemB.cover.images"
                        :key="imageIndex"
                      >
                        <van-image :src="imageItem" lazy-load />
                      </van-grid-item>
                    </van-grid>
                  </template>
                  <!--因为描述信息要自己自定义样式所以要加插槽 -->
                  <template slot="label">
                    <div class="left">
                      <span>{{itemB.aut_name}}</span>
                      <span>评论 {{itemB.comm_count}}</span>
                    </div>
                    <span>{{itemB.pubdate | dateFilter}}</span>
                  </template>
                </van-cell>
              </van-cell-group>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!--标题右侧内容 -->
    <van-icon name="wap-nav" @click="showPopup" size="50" />
    <!-- 弹出层 -->
    <channelManage v-model="show" :channelsList="channelsList" @newactive="newactive"></channelManage>
    <!-- 长按文章显示的弹出层 -->
    <more v-model="moreShow" :deleteArtId="deleteArtId" @beDeleteArtId="beDeleteArtId"></more>
  </div>
</template>
    
<script>
import { getChannelRequest } from "@/api/channel";
import { getArticles} from "@/api/articles";
const channelManage = () => import("../home/channelManage")
import eventBus from "@/untils/eventBus.js";
const more = () => import("../home/more")
export default {
  //导入一个组件之后,这里也要添加:
  components: { channelManage, more },
  //显示到视图层的初始数据:
  data() {
    return {
      active: 0,
      show: false, //弹出层
      channelsList: [], //频道
      timeID: null,
      moreShow: false,
      deleteArtId: 0
    };
  },
  //注册事件:
  methods: {
    siScroll(e){
          // console.log(e);
          let isRes = document.documentElement.scrollTop 
          
    },
    //上拉刷新
    async onLoad() {
      let channelsListItem = this.channelsList[this.active];
      //如果返回的时间戳直接是null, 那说明这个频道里边都没文章.数据都重置为初始状态.加载完成
      if (channelsListItem.pre_timestamp == null) {
        channelsListItem.upLoading = false;
        channelsListItem.finished = true;
        channelsListItem.article = [];
        return;
      }
      //如果是默认触发,传入当前时间戳,就只刷一页
      if (channelsListItem.pre_timestamp == 0) {
        //请求文章数据
        let res = await getArticles({
          channel_id: channelsListItem.id,
          timestamp: Date.now(),
          with_top: 1
        });
        channelsListItem.article = res.results;
        channelsListItem.pre_timestamp = res.pre_timestamp;
        // console.log(channelsListItem.article);
      } else {
        //不是第一次.传入上一次返回的时间戳,积累式渲染数据,数组解构+数组拼接
        let res = await getArticles({
          channel_id: channelsListItem.id,
          timestamp: channelsListItem.pre_timestamp,
          with_top: 1
        });
        channelsListItem.article = [
          ...channelsListItem.article,
          ...res.results
        ];
      }
      channelsListItem.upLoading = false;
    },
    //下拉刷新
    onRefresh() {
      //重置频道数据 - 用到的属性都重置为初始设置
      let channelsListItem = this.channelsList[this.active];
      channelsListItem.upLoading = false;
      channelsListItem.finished = false;
      channelsListItem.article = [];
      channelsListItem.pre_timestamp = 0;
      channelsListItem.downLoading = false;
      //因为每一次发送请求得到的数据都是不一样的,调用onload重新加载
      this.onLoad();
    },
    //点击显示弹出层
    showPopup() {
      this.show = true;
    },
    // 获取频道
    async getChannel() {
      let user = JSON.parse(window.localStorage.getItem("userKey"));
      if (user) {
        //登录了就直接获取数据
        console.log("登录了就直接获取数据");
        let res = await getChannelRequest();
        this.channelsList = res.channels;
      } else {
        console.log("没登录,看下缓存里边有没频道的缓存?");
        //没有登录就先看下缓存里边有没频道的缓存
        let myChannel = JSON.parse(window.localStorage.getItem("channel"));
        if (myChannel == null) {
          //没有就渲染默认的数据
          console.log("没频道缓存,渲染默认的数据");
          let res = await getChannelRequest();
          this.channelsList = res.channels;
        } else {
          //有就获取直接拿来渲染
          console.log("有频道缓存,直接拿来渲染");
          this.channelsList = myChannel;
        }
      }
      //给获取频道数据添加属性
      this.setChannelProperty();
    },
    //给获取频道数据添加属性:
    setChannelProperty() {
      //遍历数组,可是不会响应式变换,所有要加set
      this.channelsList.forEach((item, index) => {
        //文章
        this.$set(item, "article", []);
        //上拉刷新loading加载中动画效果
        this.$set(item, "upLoading", false);
        //下拉刷新loading加载中动画效果
        this.$set(item, "downLoading", false);
        //数据加载完成了
        this.$set(item, "finished", false);
        //初始时间戳
        this.$set(item, "pre_timestamp", 0);
      });
    },
    newactive(val) {
      this.active = val;
    },
    //标签栏的点击事件,选中哪个标签
    onClick(e) {
      eventBus.$emit("myactive", e);
    },
    //长按显示更多操作
    start(artId) {
      if (this.timeID) {
         clearTimeout(this.timeID);
      }
      this.timeID = setTimeout(() => {
        this.moreShow = true;
        this.deleteArtId = artId;
      }, 1000);
    },
    //长按结束
    end(indexB) {
      clearTimeout(this.timeID);
    },
    //子组件传值回来在父组件删除文章
    beDeleteArtId(val) {
      clearTimeout(this.timeID);
      let article = this.channelsList[this.active].article;
      //遍历数组,如果遍历到哪个对象里边的id等于传过来的id,就将它从数组里边删除
      article.forEach((item, index) => {
        if (item.art_id == val) {
          article.splice(index, 1);
        }
      });
    },
    toSearch(){
       this.$router.push('/search');
    }
  },
  //页面一打开就调用:
  mounted() {
    this.getChannel();
    this.newactive();
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
// }
.navBar{
  position: fixed;
  top: 0;
  height: 58px;
  width: 100%;
  background-color: #3296fa;
  z-index: 20 ;
  .center{
    height: 30px;
    margin: 0 80px;
    background-color: #5babfb;
    border-radius: 20px;
    margin-top: 18px;
    text-align: center;
    line-height: 30px;
    span{
       display: inline-block;
       color: #ffffff;
    }
  }
}


//标签栏
.van-tabs {
  margin-top: 58px;
}
.van-tabs {
  /deep/.van-tabs__nav {
    border-bottom: 1px solid red;
    /deep/.van-tabs__line {
      background-color: #3296fa;
      width: 2px;
      height: 4px;
    }
  }
}

/deep/ .van-tab {
  font-size: 20px;
}

.van-tabs--line /deep/ .van-tabs__wrap {
  height: 50px;
  margin-right: 50px;
}
/deep/.van-tabs__wrap {
  overflow: null;
  overflow: none;
  overflow: 0;
}
//标签栏右边的按钮
/deep/.van-icon {
  position: fixed;
  background-color: #ffffff;
  top: 58px;
  right: 0;
  z-index: 10;
  color: #333333;
  // padding: 20px 20px;
}
/deep/.van-tabs__wrap {
  width: 90%;
  position: fixed;
  z-index: 10;
}
//list列表
.van-list {
  margin-bottom: 50px;
  margin-top: 25px;
  /deep/.van-cell__label {
    display: flex;
    justify-content: space-between;
    .left {
      width: 140px;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>