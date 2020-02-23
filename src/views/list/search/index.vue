<template>
  <div>
     <!-- {{historyList.length == 0}} -->
     <!-- 搜索框界面 -->
    <van-search
      v-model="value"
      show-action
      :placeholder="placeholder"
      shape="round"
      background="#3296fa"
      @search="value == '' ? '' : onSearch(value)"
      @focus="isFocus"
      @blur="isBlur"
      class="search"
    >
      <div slot="action" @click="value == '' ? '' : onSearch(value)">搜索</div>
    </van-search>
    <!-- {{value.length}} -->
    <!-- 联想界面 -->
    <van-cell-group v-if="value.length != 0">
      <van-cell
        @click="onSearch(item.item)"
        icon="search"
        v-for="(item,index) in lenoveList"
        :key="index"
      >
        <template slot="title">
          <div v-html="item.colorItem"></div>
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 历史界面 -->    
    <van-cell-group v-else-if="value.length == 0 && historyList.length != 0 && beIsFocus == true"   @mousedown.prevent ="mousedown" class="history">
      <van-cell @click="isShow == true? '' : onSearch(item)" :title="item" icon="search" v-for="(item,index) in historyList" :key="index">
          <template slot="right-icon">
             <van-icon name="close" @click="deleteItem(index)" v-show="isShow"/>
        </template>
      </van-cell>
      <div class="bottom">
        <div class="bottomText" v-if="isShow == true">
          <span @click="clear">全部删除</span>
          <span @click="finish">完成</span>
        </div>
        <van-icon name="delete" v-if="isShow == false" @click="isDelete"/>
      </div>
    </van-cell-group>
    <div></div>
  </div>
</template>
    
<script>
import { lenove } from "@/api/articles";
export default {
  //组件的姓名
  name:"search",
  props:['isSecond',"isNewValue"],
  //导入一个组件之后,这里也要添加:
  components: {},
  //显示到视图层的初始数据:
  data() {
    return {
      value: "",
      lenoveList: [], //联想
      timeId: null,
      isShow:false,  //叉叉默认不显示
      historyList:JSON.parse(window.localStorage.getItem("historyList")) || [], //历史记录,一打开页面就在本地全局缓存里边拿,没有就为空数组[]
      beIsFocus:false, //默认是失去焦点
      placeholder:"请输入搜索关键词"
   };
  },
  //监听初始数据的变化,改变一次触发一次
  watch: {
    //输入的值,用户有时会改变,要实时监听它, 一改变就得到newValue
    value(newValue, oldValue) {
      //要去掉空格,不然空格也发送请求
      if (newValue.trim().length == 0) {
        //把联想数组清空,不然一直一个页面停留着
        this.lenoveList = [];
        return
      }
      //防抖
      if (this.timeID) {
        clearTimeout(this.timeID);
      }
      this.timeID = setTimeout(async () => {
        //向服务器发送请求 - 获取联想建议
        let res = await lenove({
          q: newValue
        });
        // this.lenoveList = res.options;
        //遍历数组, 因为拥有html的字符串路由跳转是识别不到的,所以要返回一个对象:里边包含这一个有html的,一个没html的
        let myValue = res.options.map((item, index) => {
          return {
            colorItem: item.split(newValue).join(`<span style='color:red'>${newValue}</span>`),
            item: item
          }
        });
        this.lenoveList = myValue;
      }, 500);
    }
  },
  //注册事件:
  methods: {
    //搜索
    onSearch(val) {
        //将输入的值存起来,增加到一个数组里边,用作历史记录
         this.historyList.unshift(val)
         //去重处理
         this.historyList = [...new Set(this.historyList)]
         window.localStorage.setItem('historyList', JSON.stringify(this.historyList))
        //传入的参数添加到路由传值里边
        this.$router.push(`/list/${val}`);
        this.value=""          //输入框清空
        this.beIsFocus =false    //失去焦点
        this.placeholder = this.isNewValue
        return
    },
    //点击垃圾桶图标
    isDelete(){
       this.beIsFocus = true
       this.isShow = true
      
    },
    //点击完成
    finish(){
     this.isShow = false
    },
    //点击插插
    deleteItem(index){
      //删除之后更新本地缓存
       this.historyList.splice(index,1)
      window.localStorage.setItem('historyList', JSON.stringify(this.historyList))
    },
    //点击全部删除
    clear(){
        this.historyList=[]
        window.localStorage.removeItem('historyList')
    },
    //输入框获得焦点
    isFocus(){
      this.beIsFocus = true
    },
    //输入框失去焦点
    isBlur(e){
      this.beIsFocus = false
    },
    mousedown(){
       
    }
  },
  //页面一打开就调用:
  mounted() {}
};
</script>
    
<style lang='less' scoped>
.van-search__action {
  color: #f5f7f9;
  background-color: #77b7fb;
  border-radius: 20px;
  margin: 0 16px;
}

.bottom{
  display: flex;
   color:#666666;
   justify-content: flex-end; 
   span{
     margin: 4px 10px;
     font-size: 14px;
   }
   .van-icon{
      margin: 4px 10px;
      font-size: 18px
   }
}
.van-search {
  height: 58px;
}
</style>