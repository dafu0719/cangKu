import Vue from 'vue'
import Vuex from 'vuex'
import {setUserKey, getUserKey, removeUserKey} from "@/untils/user";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    getUser: getUserKey(),
    num: 1234
  },
  mutations: {
    setUser(state, val){
      setUserKey(val)
    }
  }
})
