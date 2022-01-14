import Vue from 'vue'
import Vuex from 'vuex'
import moduleA from './moduleA'
import moduleB from './moduleB'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    count: 0,
    // name: 'test'
  },
  mutations: {
    increment(state) {
      state.count++
    },
    changeCount(state,payload) {
      state.count = payload
    }
  },
  actions: {
    changeCount({commit},count) {
      commit('changeCount',count)
    }
  },
  modules: {
    a: moduleA,
    b: moduleB
  }
})
export default store
