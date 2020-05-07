import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currenAreaMsg:{},    // 区域数据
  },
  mutations: {
    getAreaPoints(state,msg){
      state.areaMsg=msg.areaMsg
    },
    getCurrentId(state,msg){
      state.currentId=msg.currentId
    }
  },
  actions: {
  },
  modules: {
  }
})
